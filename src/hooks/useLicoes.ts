import { useState, useCallback, useEffect } from 'react';
import { type Licao, type LicaoFormData } from '@/types/licoes';

export type { Licao, LicaoFormData };

// Constante para a chave do localStorage
const STORAGE_KEY = 'licoes';

// Função auxiliar para carregar dados do localStorage
const loadFromStorage = (): Licao[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Erro ao carregar lições do localStorage:', error);
  }
  
  return [];
};

// Função auxiliar para salvar dados no localStorage
const saveToStorage = (data: Licao[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar lições no localStorage:', error);
  }
};

export function useLicoes() {
  const [licoes, setLicoes] = useState<Licao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedData = loadFromStorage();
    setLicoes(storedData);
  }, []);

  // Função para gerar ID único
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Simular delay de API
  const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

  // Função auxiliar para atualizar estado e localStorage
  const updateStateAndStorage = useCallback((newData: Licao[]) => {
    setLicoes(newData);
    saveToStorage(newData);
  }, []);

  // Criar nova lição
  const createLicao = useCallback(async (data: LicaoFormData): Promise<Licao> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const novaLicao: Licao = {
        ...data,
        id: generateId(),
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0]
      };

      const newLicoes = [novaLicao, ...licoes];
      updateStateAndStorage(newLicoes);
      
      return novaLicao;
    } catch {
      const errorMessage = 'Erro ao criar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes, updateStateAndStorage]);

  // Atualizar lição existente
  const updateLicao = useCallback(async (id: string, data: LicaoFormData): Promise<Licao> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const licaoExistente = licoes.find(l => l.id === id);
      if (!licaoExistente) {
        throw new Error('Lição não encontrada');
      }

      const licaoAtualizada: Licao = {
        ...licaoExistente,
        ...data,
        atualizadoEm: new Date().toISOString().split('T')[0]
      };

      const newLicoes = licoes.map(l => l.id === id ? licaoAtualizada : l);
      updateStateAndStorage(newLicoes);
      
      return licaoAtualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes, updateStateAndStorage]);

  // Deletar lição
  const deleteLicao = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const newLicoes = licoes.filter(l => l.id !== id);
      updateStateAndStorage(newLicoes);
    } catch {
      const errorMessage = 'Erro ao deletar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes, updateStateAndStorage]);

  // Deletar todas as lições de uma abertura (para exclusão em cascata)
  const deleteLicoesByAbertura = useCallback(async (aberturaId: string): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      // Encontrar todas as lições da abertura
      const licoesParaDeletar = licoes.filter(l => l.aberturaId === aberturaId);
      const idsLicoesDeletadas = licoesParaDeletar.map(l => l.id);
      
      // Filtrar para manter apenas as lições que não são da abertura
      const newLicoes = licoes.filter(l => l.aberturaId !== aberturaId);
      updateStateAndStorage(newLicoes);
      
      return idsLicoesDeletadas;
    } catch {
      const errorMessage = 'Erro ao deletar lições da abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes, updateStateAndStorage]);

  // Buscar lição por ID
  const getLicao = useCallback((id: string): Licao | undefined => {
    return licoes.find(l => l.id === id);
  }, [licoes]);

  // Filtrar lições
  const filterLicoes = useCallback((
    searchTerm: string,
    aberturaId: string = 'all',
    tipo: string = 'all',
    dificuldade: string = 'all'
  ): Licao[] => {
    return licoes.filter(licao => {
      const matchSearch = licao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         licao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAbertura = aberturaId === 'all' || licao.aberturaId === aberturaId;
      const matchTipo = tipo === 'all' || licao.tipo === tipo;
      const matchDificuldade = dificuldade === 'all' || licao.dificuldade === dificuldade;
      
      return matchSearch && matchAbertura && matchTipo && matchDificuldade;
    });
  }, [licoes]);

  // Lições por abertura
  const getLicoesByAbertura = useCallback((aberturaId: string): Licao[] => {
    return licoes
      .filter(l => l.aberturaId === aberturaId)
      .sort((a, b) => a.ordem - b.ordem);
  }, [licoes]);

  // Estatísticas
  const getStats = useCallback(() => {
    const total = licoes.length;
    const ativas = licoes.filter(l => l.status === 'Ativo').length;
    const rascunhos = licoes.filter(l => l.status === 'Rascunho').length;
    const arquivadas = licoes.filter(l => l.status === 'Arquivado').length;
    const visualizacao = licoes.filter(l => l.tipo === 'Visualização').length;
    const interativo = licoes.filter(l => l.tipo === 'Interativo').length;
    const tempoTotal = licoes.reduce((total, l) => total + l.estimativaTempo, 0);

    return {
      total,
      ativas,
      rascunhos,
      arquivadas,
      visualizacao,
      interativo,
      tempoTotal
    };
  }, [licoes]);

  return {
    licoes,
    loading,
    error,
    createLicao,
    updateLicao,
    deleteLicao,
    deleteLicoesByAbertura,
    getLicao,
    filterLicoes,
    getLicoesByAbertura,
    getStats,
    clearError: () => setError(null)
  };
} 