export interface Exercicio {
  id: string;
  titulo: string;
  descricao: string;
  licaoId: string;
  ordem: number;
  tipo: 'Passivo' | 'Interativo' | 'Quiz'; // Três tipos claros
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  conteudo: ConteudoExercicio;
  pontuacao: number;
  tempoLimite?: number; // em segundos (apenas para Interativo e Quiz)
  tentativasMaximas: number; // apenas para Interativo e Quiz
  criadoEm: string;
  atualizadoEm: string;
}

export interface ConteudoExercicio {
  posicaoInicial: string; // FEN
  contexto: string; // Explicação da situação
  
  // Para exercícios passivos - sequência de movimentos com explicações
  sequenciaMovimentos?: MovimentoPassivo[];
  
  // Para exercícios interativos - encontrar o lance correto
  movimentoCorreto?: string; // Lance correto em notação algébrica
  
  // Para exercícios quiz - múltiplas opções
  opcoes?: OpcaoQuiz[];
  
  // Campos comuns
  explicacao: string; // Explicação final/solução
  dicas: string[];
  feedbackCorreto: string;
  feedbackIncorreto: string;
}

// Para exercícios passivos - demonstração sequencial
export interface MovimentoPassivo {
  id: string;
  movimento: string; // Notação algébrica (ex: "e4", "Nf3")
  posicaoFEN: string; // Posição após o movimento
  explicacao: string; // Explicação do movimento
  destaque?: {
    casas: string[]; // Casas a destacar
    cor: 'amarelo' | 'verde' | 'azul' | 'vermelho';
  };
  tempoVisualizacao?: number; // tempo em ms para mostrar este movimento
}

// Para exercícios quiz - opções de múltipla escolha
export interface OpcaoQuiz {
  id: string;
  movimento: string; // Lance em notação algébrica
  texto: string; // Descrição da opção (ex: "Atacar o rei")
  correta: boolean;
  explicacao?: string; // Por que está certa/errada
}

export type ExercicioFormData = Omit<Exercicio, 'id' | 'criadoEm' | 'atualizadoEm'>;

export interface ProgressoExercicio {
  exercicioId: string;
  usuarioId: string;
  tentativas: number;
  correto: boolean;
  pontuacaoObtida: number;
  tempoGasto: number; // em segundos
  respostaDada?: string;
  completadoEm: string;
}

export interface EstatisticasExercicio {
  exercicioId: string;
  totalTentativas: number;
  totalCorretas: number;
  taxaSucesso: number; // 0-100
  tempoMedio: number; // em segundos
  ultimaAtualizacao: string;
} 