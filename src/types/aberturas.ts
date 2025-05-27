export interface Abertura {
  id: string;
  nome: string;
  categoria: 'Tática' | 'Posicional' | 'Universal';
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  movimentos: string[];
  descricao: string;
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  criadoEm: string;
  atualizadoEm: string;
}

export type AberturaFormData = Omit<Abertura, 'id' | 'criadoEm' | 'atualizadoEm'>;

export interface EstatisticasAbertura {
  aberturaId: string;
  totalLicoes: number;
  totalExercicios: number;
  usuariosCompletoram: number;
  tempoMedioCompletude: number; // em horas
  ultimaAtualizacao: string;
} 