import { useState, useCallback } from 'react';
import { type Licao, type LicaoFormData } from '@/types/licoes';

export type { Licao, LicaoFormData };

// Dados mockados iniciais
const initialData: Licao[] = [
  {
    id: '1',
    titulo: 'Introdução à Abertura Italiana',
    descricao: 'Aprenda os fundamentos da Abertura Italiana e seus objetivos principais',
    aberturaId: '1',
    ordem: 1,
    tipo: 'Visualização',
    dificuldade: 'Iniciante',
    status: 'Ativo',
    conteudo: {
      introducao: 'A Abertura Italiana é uma das mais antigas aberturas do xadrez...',
      explicacao: 'Esta abertura busca controle central e desenvolvimento rápido das peças...',
      movimentos: [
        {
          id: '1',
          movimento: 'e4',
          posicaoFEN: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
          explicacao: 'Primeiro movimento: controle do centro'
        },
        {
          id: '2',
          movimento: 'e5',
          posicaoFEN: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
          explicacao: 'Resposta simétrica das pretas'
        }
      ],
      dicas: [
        'Desenvolva as peças antes dos peões',
        'Mantenha o rei seguro',
        'Controle o centro do tabuleiro'
      ],
      conclusao: 'A Abertura Italiana oferece jogo equilibrado e muitas possibilidades táticas.'
    },
    exercicios: ['1', '2'],
    estimativaTempo: 15,
    pontuacao: 100,
    prerequisitos: [],
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-12-01'
  },
  {
    id: '2',
    titulo: 'Reações na Defesa Siciliana',
    descricao: 'Como responder às principais variantes da Defesa Siciliana',
    aberturaId: '2',
    ordem: 1,
    tipo: 'Interativo',
    dificuldade: 'Intermediário',
    status: 'Ativo',
    conteudo: {
      introducao: 'A Defesa Siciliana oferece jogo desequilibrado...',
      explicacao: 'As pretas buscam contrajogo no flanco da dama...',
      movimentos: [
        {
          id: '3',
          movimento: 'e4',
          posicaoFEN: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
          explicacao: 'Abertura com e4'
        },
        {
          id: '4',
          movimento: 'c5',
          posicaoFEN: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
          explicacao: 'A Defesa Siciliana'
        }
      ],
      dicas: [
        'Considere o Ataque Inglês',
        'Desenvolva o cavalo para f3',
        'Prepare o roque curto'
      ],
      conclusao: 'A Siciliana requer estudo profundo mas oferece grandes recompensas.'
    },
    exercicios: ['3', '4', '5'],
    estimativaTempo: 25,
    pontuacao: 150,
    prerequisitos: [],
    criadoEm: '2024-02-10',
    atualizadoEm: '2024-12-10'
  },
  {
    id: '3',
    titulo: 'Estruturas do Gambito da Dama',
    descricao: 'Entenda as estruturas de peões típicas do Gambito da Dama',
    aberturaId: '3',
    ordem: 1,
    tipo: 'Visualização',
    dificuldade: 'Intermediário',
    status: 'Rascunho',
    conteudo: {
      introducao: 'O Gambito da Dama cria estruturas únicas...',
      explicacao: 'As estruturas de peões determinam os planos do meio-jogo...',
      movimentos: [
        {
          id: '5',
          movimento: 'd4',
          posicaoFEN: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
          explicacao: 'Início com d4'
        }
      ],
      dicas: [
        'Observe a tensão central',
        'Controle as casas claras',
        'Desenvolva o bispo de c1'
      ],
      conclusao: 'O Gambito da Dama é fundamental para entender xadrez posicional.'
    },
    exercicios: ['6'],
    estimativaTempo: 20,
    pontuacao: 120,
    prerequisitos: ['1'],
    criadoEm: '2024-03-05',
    atualizadoEm: '2024-12-15'
  }
];

export function useLicoes() {
  const [licoes, setLicoes] = useState<Licao[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para gerar ID único
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Simular delay de API
  const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

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

      setLicoes(prev => [novaLicao, ...prev]);
      return novaLicao;
    } catch {
      const errorMessage = 'Erro ao criar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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

      setLicoes(prev => 
        prev.map(l => l.id === id ? licaoAtualizada : l)
      );
      
      return licaoAtualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes]);

  // Deletar lição
  const deleteLicao = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await simulateApiDelay();
      
      setLicoes(prev => prev.filter(l => l.id !== id));
    } catch {
      const errorMessage = 'Erro ao deletar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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
    getLicao,
    filterLicoes,
    getLicoesByAbertura,
    getStats,
    clearError: () => setError(null)
  };
} 