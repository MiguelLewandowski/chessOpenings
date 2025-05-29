import { useState, useCallback, useEffect } from 'react';
import { type Exercicio, type ExercicioFormData } from '@/types/exercicios';

export type { Exercicio, ExercicioFormData };

// Constante para a chave do localStorage
const STORAGE_KEY = 'exercicios';

// Dados mockados iniciais (fallback para novos usuários)
const initialData: Exercicio[] = [
  {
    id: '1',
    titulo: 'Mate em 2 - Abertura Italiana',
    descricao: 'Encontre o mate em 2 lances nesta posição da Abertura Italiana',
    licaoId: '1',
    ordem: 1,
    tipo: 'Tático',
    dificuldade: 'Iniciante',
    status: 'Ativo',
    conteudo: {
      posicaoInicial: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4',
      contexto: 'Posição típica da Abertura Italiana após alguns lances',
      pergunta: 'As brancas podem dar mate em 2 lances. Qual é o primeiro movimento?',
      opcoes: [
        {
          id: '1',
          texto: 'Ng5',
          movimento: 'Ng5',
          correta: true,
          explicacao: 'Ng5 ataca f7 e prepara Qf3 com mate'
        },
        {
          id: '2',
          texto: 'Qf3',
          movimento: 'Qf3',
          correta: false,
          explicacao: 'Muito direto, as pretas podem defender'
        },
        {
          id: '3',
          texto: 'Bxf7+',
          movimento: 'Bxf7+',
          correta: false,
          explicacao: 'Sacrifício prematuro sem continuação'
        },
        {
          id: '4',
          texto: 'd4',
          movimento: 'd4',
          correta: false,
          explicacao: 'Não contribui para o ataque'
        }
      ],
      explicacao: 'Ng5 é o movimento chave que ataca f7 e prepara Qf3, criando uma ameaça de mate imparável.',
      dicas: [
        'Observe os pontos fracos das pretas',
        'Procure por ataques duplos',
        'O rei preto está vulnerável'
      ],
      feedbackCorreto: 'Excelente! Ng5 é o movimento correto que leva ao mate forçado.',
      feedbackIncorreto: 'Tente novamente. Procure por movimentos que atacam pontos fracos.'
    },
    pontuacao: 50,
    tempoLimite: 120,
    tentativasMaximas: 3,
    criadoEm: '2024-01-15',
    atualizadoEm: '2024-12-01'
  },
  {
    id: '2',
    titulo: 'Estrutura de Peões - Siciliana',
    descricao: 'Analise a estrutura de peões típica da Defesa Siciliana',
    licaoId: '2',
    ordem: 1,
    tipo: 'Estratégico',
    dificuldade: 'Intermediário',
    status: 'Ativo',
    conteudo: {
      posicaoInicial: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
      contexto: 'Posição inicial da Defesa Siciliana após 1.e4 c5',
      pergunta: 'Qual é a principal característica estratégica desta estrutura?',
      opcoes: [
        {
          id: '1',
          texto: 'Jogo desequilibrado com chances para ambos os lados',
          correta: true,
          explicacao: 'A Siciliana cria desequilíbrio estrutural que oferece chances dinâmicas'
        },
        {
          id: '2',
          texto: 'Posição simétrica e equilibrada',
          correta: false,
          explicacao: 'A estrutura é assimétrica, não simétrica'
        },
        {
          id: '3',
          texto: 'Vantagem clara para as brancas',
          correta: false,
          explicacao: 'As pretas têm boas chances de contrajogo'
        },
        {
          id: '4',
          texto: 'Estrutura defensiva para as pretas',
          correta: false,
          explicacao: 'A Siciliana é uma defesa ativa, não passiva'
        }
      ],
      explicacao: 'A Defesa Siciliana cria uma estrutura desequilibrada onde as brancas atacam no centro e flanco do rei, enquanto as pretas buscam contrajogo no flanco da dama.',
      dicas: [
        'Observe a assimetria dos peões',
        'Considere os planos de ambos os lados',
        'Pense em termos de dinâmica, não só material'
      ],
      feedbackCorreto: 'Correto! A Siciliana é conhecida pelo jogo desequilibrado e dinâmico.',
      feedbackIncorreto: 'Revise os conceitos de estruturas assimétricas no xadrez.'
    },
    pontuacao: 75,
    tempoLimite: 180,
    tentativasMaximas: 2,
    criadoEm: '2024-02-10',
    atualizadoEm: '2024-12-10'
  },
  {
    id: '3',
    titulo: 'Final de Torre - Técnica Básica',
    descricao: 'Aprenda a técnica fundamental dos finais de torre',
    licaoId: '3',
    ordem: 1,
    tipo: 'Final',
    dificuldade: 'Intermediário',
    status: 'Rascunho',
    conteudo: {
      posicaoInicial: '8/8/8/8/8/8/1k6/K1R5 w - - 0 1',
      contexto: 'Final básico de rei e torre contra rei',
      pergunta: 'Qual é o método correto para dar mate nesta posição?',
      movimentoCorreto: ['Rc2+', 'Kb3', 'Rc3+', 'Kb4', 'Rc4+', 'Kb5', 'Rc5+'],
      explicacao: 'O método correto é empurrar o rei adversário para a lateral do tabuleiro usando xeques sistemáticos.',
      dicas: [
        'Use xeques para forçar o rei à lateral',
        'Mantenha seu rei próximo para apoiar',
        'Seja paciente e sistemático'
      ],
      feedbackCorreto: 'Excelente técnica! Continue empurrando o rei para a lateral.',
      feedbackIncorreto: 'Revise a técnica básica de finais de torre contra rei.'
    },
    pontuacao: 100,
    tentativasMaximas: 5,
    criadoEm: '2024-03-05',
    atualizadoEm: '2024-12-15'
  },
  {
    id: '4',
    titulo: 'Desenvolvimento de Peças - Inglesa',
    descricao: 'Princípios de desenvolvimento na Abertura Inglesa',
    licaoId: '1',
    ordem: 2,
    tipo: 'Técnico',
    dificuldade: 'Avançado',
    status: 'Ativo',
    conteudo: {
      posicaoInicial: 'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1',
      contexto: 'Abertura Inglesa após 1.c4',
      pergunta: 'Qual peça as brancas devem desenvolver primeiro?',
      opcoes: [
        {
          id: '1',
          texto: 'Cavalo de g1 para f3',
          movimento: 'Nf3',
          correta: true,
          explicacao: 'Nf3 é flexível e controla casas centrais importantes'
        },
        {
          id: '2',
          texto: 'Bispo de f1 para e2',
          movimento: 'Be2',
          correta: false,
          explicacao: 'Muito passivo nesta fase da abertura'
        },
        {
          id: '3',
          texto: 'Cavalo de b1 para c3',
          movimento: 'Nc3',
          correta: false,
          explicacao: 'Possível, mas menos flexível que Nf3'
        },
        {
          id: '4',
          texto: 'Peão g2-g3',
          movimento: 'g3',
          correta: false,
          explicacao: 'Desenvolvimento de peças tem prioridade'
        }
      ],
      explicacao: 'Na Abertura Inglesa, Nf3 é geralmente o desenvolvimento mais flexível, controlando e4 e d4.',
      dicas: [
        'Priorize desenvolvimento sobre estrutura',
        'Mantenha flexibilidade',
        'Controle casas centrais'
      ],
      feedbackCorreto: 'Perfeito! Nf3 é o desenvolvimento mais flexível.',
      feedbackIncorreto: 'Considere quais casas importantes o movimento controla.'
    },
    pontuacao: 80,
    tempoLimite: 90,
    tentativasMaximas: 3,
    criadoEm: '2024-04-20',
    atualizadoEm: '2024-12-18'
  }
];

// Função auxiliar para carregar dados do localStorage
const loadFromStorage = (): Exercicio[] => {
  if (typeof window === 'undefined') return initialData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : initialData;
    }
  } catch (error) {
    console.warn('Erro ao carregar exercícios do localStorage:', error);
  }
  
  return initialData;
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
    const tatico = exercicios.filter(e => e.tipo === 'Tático').length;
    const estrategico = exercicios.filter(e => e.tipo === 'Estratégico').length;
    const tecnico = exercicios.filter(e => e.tipo === 'Técnico').length;
    const final = exercicios.filter(e => e.tipo === 'Final').length;
    const pontuacaoTotal = exercicios.reduce((total, e) => total + e.pontuacao, 0);

    return {
      total,
      ativos,
      rascunhos,
      arquivados,
      tatico,
      estrategico,
      tecnico,
      final,
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
    getExercicio,
    filterExercicios,
    getExerciciosByLicao,
    getStats,
    clearError: () => setError(null)
  };
} 