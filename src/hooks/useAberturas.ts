import { useState, useCallback, useEffect } from 'react';
import { type Abertura, type AberturaFormData } from '@/types/aberturas';
import { deleteAberturaWithCascade } from '@/utils/localStorage';

export type { Abertura, AberturaFormData };

// Constante para a chave do localStorage
const STORAGE_KEY = 'aberturas';

// Função auxiliar para carregar dados do localStorage
const loadFromStorage = (): Abertura[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Erro ao carregar aberturas do localStorage:', error);
  }
  
  return [];
};

// Função auxiliar para salvar dados no localStorage
const saveToStorage = (data: Abertura[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar aberturas no localStorage:', error);
  }
};

export function useAberturas() {
  const [aberturas, setAberturas] = useState<Abertura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedData = loadFromStorage();
    setAberturas(storedData);
  }, []);

  // Função para gerar ID único
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Simular delay de API
  const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

  // Função auxiliar para atualizar estado e localStorage
  const updateStateAndStorage = useCallback((newData: Abertura[]) => {
    setAberturas(newData);
    saveToStorage(newData);
  }, []);

  // Criar nova abertura
  const createAbertura = useCallback(async (data: AberturaFormData): Promise<Abertura> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const novaAbertura: Abertura = {
        ...data,
        id: generateId(),
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0]
      };

      const newAberturas = [novaAbertura, ...aberturas];
      updateStateAndStorage(newAberturas);
      
      return novaAbertura;
    } catch {
      const errorMessage = 'Erro ao criar abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [aberturas, updateStateAndStorage]);

  // Atualizar abertura existente
  const updateAbertura = useCallback(async (id: string, data: AberturaFormData): Promise<Abertura> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const aberturaExistente = aberturas.find(a => a.id === id);
      if (!aberturaExistente) {
        throw new Error('Abertura não encontrada');
      }

      const aberturaAtualizada: Abertura = {
        ...aberturaExistente,
        ...data,
        atualizadoEm: new Date().toISOString().split('T')[0]
      };

      const newAberturas = aberturas.map(a => a.id === id ? aberturaAtualizada : a);
      updateStateAndStorage(newAberturas);
      
      return aberturaAtualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [aberturas, updateStateAndStorage]);

  // Deletar abertura com exclusão em cascata
  const deleteAbertura = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      // Usar a função de exclusão em cascata
      const resultado = await deleteAberturaWithCascade(id);
      
      // Recarregar dados do localStorage para manter o estado sincronizado
      const updatedAberturas = loadFromStorage();
      setAberturas(updatedAberturas);
      
      // Log para feedback (pode ser usado para notificações)
      console.log(`Abertura excluída com sucesso:
        - 1 abertura removida
        - ${resultado.licoesRemovidas} lições removidas
        - ${resultado.exerciciosRemovidos} exercícios removidos`);
        
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar abertura por ID
  const getAbertura = useCallback((id: string): Abertura | undefined => {
    return aberturas.find(a => a.id === id);
  }, [aberturas]);

  // Filtrar aberturas
  const filterAberturas = useCallback((
    searchTerm: string,
    categoria: string = 'all',
    dificuldade: string = 'all'
  ): Abertura[] => {
    return aberturas.filter(abertura => {
      const matchSearch = abertura.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         abertura.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategoria = categoria === 'all' || abertura.categoria === categoria;
      const matchDificuldade = dificuldade === 'all' || abertura.dificuldade === dificuldade;
      
      return matchSearch && matchCategoria && matchDificuldade;
    });
  }, [aberturas]);

  // Estatísticas (lições e exercícios serão calculados dinamicamente pelos hooks relacionados)
  const getStats = useCallback(() => {
    const total = aberturas.length;
    const ativas = aberturas.filter(a => a.status === 'Ativo').length;
    const rascunhos = aberturas.filter(a => a.status === 'Rascunho').length;
    const arquivadas = aberturas.filter(a => a.status === 'Arquivado').length;

    return {
      total,
      ativas,
      rascunhos,
      arquivadas
    };
  }, [aberturas]);

  // Função para obter estatísticas avançadas com relacionamentos
  const getAdvancedStats = useCallback((licoes: Array<{id: string; aberturaId: string}> = [], exercicios: Array<{id: string; licaoId: string}> = []) => {
    const baseStats = getStats();
    const totalLicoes = licoes.length;
    const totalExercicios = exercicios.length;
    
    // Contar lições e exercícios por abertura
    const aberturaStats = aberturas.map(abertura => ({
      ...abertura,
      licoes: licoes.filter(licao => licao.aberturaId === abertura.id).length,
      exercicios: exercicios.filter(exercicio => 
        licoes.some(licao => licao.id === exercicio.licaoId && licao.aberturaId === abertura.id)
      ).length
    }));

    return {
      ...baseStats,
      totalLicoes,
      totalExercicios,
      aberturaStats
    };
  }, [aberturas, getStats]);

  return {
    aberturas,
    loading,
    error,
    createAbertura,
    updateAbertura,
    deleteAbertura,
    getAbertura,
    filterAberturas,
    getStats,
    getAdvancedStats,
    clearError: () => setError(null)
  };
} 