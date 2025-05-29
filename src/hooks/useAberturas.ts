import { useState, useCallback, useEffect } from 'react';
import { type Abertura, type AberturaFormData } from '@/types/aberturas';

export type { Abertura, AberturaFormData };

// Constante para a chave do localStorage
const STORAGE_KEY = 'aberturas';

// Dados mockados iniciais (fallback para novos usuários)
const initialData: Abertura[] = [
  {
    id: '1',
    nome: 'Abertura Italiana',
    categoria: 'Tática',
    dificuldade: 'Iniciante',
    movimentos: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    descricao: 'Uma das aberturas mais antigas e clássicas do xadrez',
    status: 'Ativo',
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-12-01'
  },
  {
    id: '2',
    nome: 'Defesa Siciliana',
    categoria: 'Tática',
    dificuldade: 'Intermediário',
    movimentos: ['e4', 'c5'],
    descricao: 'A defesa mais popular contra 1.e4',
    status: 'Ativo',
    criadoEm: '2024-02-10',
    atualizadoEm: '2024-12-10'
  },
  {
    id: '3',
    nome: 'Gambito da Dama',
    categoria: 'Posicional',
    dificuldade: 'Intermediário',
    movimentos: ['d4', 'd5', 'c4'],
    descricao: 'Abertura posicional que visa controle central',
    status: 'Rascunho',
    criadoEm: '2024-03-05',
    atualizadoEm: '2024-12-15'
  },
  {
    id: '4',
    nome: 'Abertura Inglesa',
    categoria: 'Universal',
    dificuldade: 'Avançado',
    movimentos: ['c4'],
    descricao: 'Abertura flexível com muitas transposições',
    status: 'Ativo',
    criadoEm: '2024-04-20',
    atualizadoEm: '2024-12-18'
  }
];

// Função auxiliar para carregar dados do localStorage
const loadFromStorage = (): Abertura[] => {
  if (typeof window === 'undefined') return initialData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : initialData;
    }
  } catch (error) {
    console.warn('Erro ao carregar aberturas do localStorage:', error);
  }
  
  return initialData;
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
    
    // Se não há dados no localStorage, salva os dados iniciais
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      saveToStorage(storedData);
    }
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

  // Deletar abertura
  const deleteAbertura = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      const newAberturas = aberturas.filter(a => a.id !== id);
      updateStateAndStorage(newAberturas);
    } catch {
      const errorMessage = 'Erro ao deletar abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [aberturas, updateStateAndStorage]);

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