export interface Licao {
  id: string;
  titulo: string;
  descricao: string;
  aberturaId: string;
  ordem: number;
  tipo: 'Visualização' | 'Interativo';
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  conteudo: ConteudoLicao;
  exercicios: string[]; // IDs dos exercícios
  estimativaTempo: number; // em minutos
  pontuacao: number;
  prerequisitos: string[]; // IDs de lições anteriores
  criadoEm: string;
  atualizadoEm: string;
}

export interface ConteudoLicao {
  introducao: string;
  explicacao: string;
  movimentos: MovimentoLicao[];
  dicas: string[];
  conclusao: string;
}

export interface MovimentoLicao {
  id: string;
  movimento: string;
  posicaoFEN: string;
  explicacao: string;
  destaque?: {
    casas: string[];
    cor: 'amarelo' | 'verde' | 'azul' | 'vermelho';
  };
  tempo?: number; // tempo de pausa em ms para visualização
}

export type LicaoFormData = Omit<Licao, 'id' | 'criadoEm' | 'atualizadoEm'>;

export interface ProgressoLicao {
  licaoId: string;
  usuarioId: string;
  progresso: number; // 0-100
  completada: boolean;
  pontuacaoObtida: number;
  tempoGasto: number; // em segundos
  iniciadaEm: string;
  completadaEm?: string;
} 