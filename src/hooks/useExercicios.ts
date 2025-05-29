import { useState, useCallback, useEffect } from 'react';
import { type Exercicio, type ExercicioFormData } from '@/types/exercicios';

export type { Exercicio, ExercicioFormData };

// Constante para a chave do localStorage
const STORAGE_KEY = 'exercicios';

// Função auxiliar para carregar dados do localStorage
const loadFromStorage = (): Exercicio[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Erro ao carregar exercícios do localStorage:', error);
  }
  
  return [];
};

// Função auxiliar para salvar dados no localStorage
const saveToStorage = (data: Exercicio[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar exercícios no localStorage:', error);
  }
};

export function useExercicios() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedData = loadFromStorage();
    setExercicios(storedData);
  }, []);

  // Função para gerar ID único
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Simular delay de API
  const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

  // Função auxiliar para atualizar estado e localStorage
  const updateStateAndStorage = useCallback((newData: Exercicio[]) => {
    setExercicios(newData);
    saveToStorage(newData);
  }, []);

  // Criar novo exercício
  const createExercicio = useCallback(async (data: ExercicioFormData): Promise<Exercicio> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const novoExercicio: Exercicio = {
        ...data,
        id: generateId(),
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0]
      };

      const newExercicios = [novoExercicio, ...exercicios];
      updateStateAndStorage(newExercicios);
      
      return novoExercicio;
    } catch {
      const errorMessage = 'Erro ao criar exercício';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios, updateStateAndStorage]);

  // Atualizar exercício existente
  const updateExercicio = useCallback(async (id: string, data: ExercicioFormData): Promise<Exercicio> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const exercicioExistente = exercicios.find(e => e.id === id);
      if (!exercicioExistente) {
        throw new Error('Exercício não encontrado');
      }

      const exercicioAtualizado: Exercicio = {
        ...exercicioExistente,
        ...data,
        atualizadoEm: new Date().toISOString().split('T')[0]
      };

      const newExercicios = exercicios.map(e => e.id === id ? exercicioAtualizado : e);
      updateStateAndStorage(newExercicios);
      
      return exercicioAtualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar exercício';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios, updateStateAndStorage]);

  // Deletar exercício
  const deleteExercicio = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const newExercicios = exercicios.filter(e => e.id !== id);
      updateStateAndStorage(newExercicios);
    } catch {
      const errorMessage = 'Erro ao deletar exercício';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios, updateStateAndStorage]);

  // Deletar todos os exercícios de lições específicas (para exclusão em cascata)
  const deleteExerciciosByLicoes = useCallback(async (licaoIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      // Filtrar para manter apenas exercícios que não pertencem às lições deletadas
      const newExercicios = exercicios.filter(e => !licaoIds.includes(e.licaoId));
      updateStateAndStorage(newExercicios);
    } catch {
      const errorMessage = 'Erro ao deletar exercícios das lições';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios, updateStateAndStorage]);

  // Buscar exercício por ID
  const getExercicio = useCallback((id: string): Exercicio | undefined => {
    return exercicios.find(e => e.id === id);
  }, [exercicios]);

  // Filtrar exercícios
  const filterExercicios = useCallback((
    searchTerm: string,
    licaoId: string = 'all',
    tipo: string = 'all',
    dificuldade: string = 'all'
  ): Exercicio[] => {
    return exercicios.filter(exercicio => {
      const matchSearch = exercicio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercicio.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLicao = licaoId === 'all' || exercicio.licaoId === licaoId;
      const matchTipo = tipo === 'all' || exercicio.tipo === tipo;
      const matchDificuldade = dificuldade === 'all' || exercicio.dificuldade === dificuldade;
      
      return matchSearch && matchLicao && matchTipo && matchDificuldade;
    });
  }, [exercicios]);

  // Exercícios por lição
  const getExerciciosByLicao = useCallback((licaoId: string): Exercicio[] => {
    return exercicios
      .filter(e => e.licaoId === licaoId)
      .sort((a, b) => a.ordem - b.ordem);
  }, [exercicios]);

  // Estatísticas
  const getStats = useCallback(() => {
    const total = exercicios.length;
    const ativos = exercicios.filter(e => e.status === 'Ativo').length;
    const rascunhos = exercicios.filter(e => e.status === 'Rascunho').length;
    const arquivados = exercicios.filter(e => e.status === 'Arquivado').length;
    
    // Por tipo
    const passivos = exercicios.filter(e => e.tipo === 'Passivo').length;
    const interativos = exercicios.filter(e => e.tipo === 'Interativo').length;
    const quiz = exercicios.filter(e => e.tipo === 'Quiz').length;
    
    const pontuacaoTotal = exercicios.reduce((total, e) => total + e.pontuacao, 0);

    return {
      total,
      ativos,
      rascunhos,
      arquivados,
      passivos,
      interativos,
      quiz,
      pontuacaoTotal
    };
  }, [exercicios]);

  return {
    exercicios,
    loading,
    error,
    createExercicio,
    updateExercicio,
    deleteExercicio,
    deleteExerciciosByLicoes,
    getExercicio,
    filterExercicios,
    getExerciciosByLicao,
    getStats,
    clearError: () => setError(null)
  };
} 