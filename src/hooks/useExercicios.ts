import { useState, useCallback, useEffect } from 'react';
import { type Exercicio, type ExercicioFormData } from '@/types/exercicios';

export type { Exercicio, ExercicioFormData };



export function useExercicios() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/exercicios')
      const data = await res.json()
      setExercicios(data)
    }
    fetchData()
  }, []);

// Helpers removidos após migração para API

  // Criar novo exercício
  const createExercicio = useCallback(async (data: ExercicioFormData): Promise<Exercicio> => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/exercicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const created = await res.json()
      setExercicios(prev => [created, ...prev])
      return created
    } catch {
      const errorMessage = 'Erro ao criar exercício';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios]);

  // Atualizar exercício existente
  const updateExercicio = useCallback(async (id: string, data: ExercicioFormData): Promise<Exercicio> => {
    setLoading(true);
    setError(null);
    
    try {
      const exercicioExistente = exercicios.find(e => e.id === id);
      if (!exercicioExistente) {
        throw new Error('Exercício não encontrado');
      }

      const res = await fetch(`/api/exercicios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const updated = await res.json()
      setExercicios(prev => prev.map(e => e.id === id ? updated : e))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar exercício';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios]);

  // Deletar exercício
  const deleteExercicio = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await fetch(`/api/exercicios/${id}`, { method: 'DELETE' })
      setExercicios(prev => prev.filter(e => e.id !== id))
    } catch {
      const errorMessage = 'Erro ao deletar exercício';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios]);

  // Deletar todos os exercícios de lições específicas (para exclusão em cascata)
  const deleteExerciciosByLicoes = useCallback(async (licaoIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Filtrar para manter apenas exercícios que não pertencem às lições deletadas
      const keep = exercicios.filter(e => !licaoIds.includes(e.licaoId))
      const remove = exercicios.filter(e => licaoIds.includes(e.licaoId))
      for (const ex of remove) {
        await fetch(`/api/exercicios/${ex.id}`, { method: 'DELETE' })
      }
      setExercicios(keep)
    } catch {
      const errorMessage = 'Erro ao deletar exercícios das lições';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercicios]);

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
