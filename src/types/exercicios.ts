export interface Exercicio {
  id: string;
  titulo: string;
  descricao: string;
  licaoId: string;
  ordem: number;
  tipo: 'Tático' | 'Estratégico' | 'Técnico' | 'Final';
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  conteudo: ConteudoExercicio;
  pontuacao: number;
  tempoLimite?: number; // em segundos
  tentativasMaximas: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ConteudoExercicio {
  posicaoInicial: string; // FEN
  contexto: string;
  pergunta: string;
  opcoes?: OpcaoExercicio[]; // Para exercícios de múltipla escolha
  movimentoCorreto?: string[]; // Para exercícios de movimento
  explicacao: string;
  dicas: string[];
  feedbackCorreto: string;
  feedbackIncorreto: string;
}

export interface OpcaoExercicio {
  id: string;
  texto: string;
  movimento?: string;
  correta: boolean;
  explicacao?: string;
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