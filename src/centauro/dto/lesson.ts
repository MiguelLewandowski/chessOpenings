// Interfaces DTO para saída de lições geradas pelo CENTAURO
export interface LessonDTO {
  aberturaId?: string
  titulo: string
  descricao: string
  tipo: 'Teoria' | 'Punicao'
  dificuldade: 'Iniciante' | 'Intermediario' | 'Avancado'
  conteudo: {
    posicaoInicial: string
    contexto: string
    sequenciaMovimentos?: Array<{
      id: string
      movimento: string
      posicaoFEN: string
      explicacao?: string
    }>
    movimentoCorreto?: string
    opcoes?: Array<{ id: string; movimento: string; texto: string; correta: boolean; explicacao?: string }>
    explicacao: string
    dicas: string[]
    feedbackCorreto: string
    feedbackIncorreto: string
  }
  estatisticas?: {
    partidasProcessadas: number
    frequenciaMedia?: number
    quedaEval?: number
  }
}

export interface CentauroOptions {
  teoria: { minFrequencia: number; maxProfundidade: number; minPartidasPorNo: number }
  punicao: { limiarQuedaEval: number; movetimeMs: number; maxRamoPunicao: number }
}