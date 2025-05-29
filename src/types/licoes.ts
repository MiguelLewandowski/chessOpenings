export interface Licao {
  id: string;
  titulo: string;
  descricao: string;
  aberturaId: string;
  ordem: number;
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  exercicios: string[]; // IDs dos exercícios
  estimativaTempo: number; // em minutos
  pontuacao: number;
  prerequisitos: string[]; // IDs de lições anteriores
  criadoEm: string;
  atualizadoEm: string;
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