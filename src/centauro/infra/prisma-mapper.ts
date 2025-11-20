import type { LessonDTO } from '../dto/lesson'
import type { LicaoFormData } from '@/types/licoes'
import type { ExercicioFormData } from '@/types/exercicios'

function mapDificuldade(d: 'Iniciante' | 'Intermediario' | 'Avancado'): 'Iniciante' | 'Intermediário' | 'Avançado' {
  if (d === 'Intermediario') return 'Intermediário'
  if (d === 'Avancado') return 'Avançado'
  return 'Iniciante'
}

export function lessonToForms(lesson: LessonDTO): { licao: LicaoFormData; exercicios: ExercicioFormData[] } {
  const licao: LicaoFormData = {
    titulo: lesson.titulo,
    descricao: lesson.descricao,
    aberturaId: lesson.aberturaId ?? '',
    ordem: 1,
    dificuldade: mapDificuldade(lesson.dificuldade),
    status: 'Ativo',
    exercicios: [],
    estimativaTempo: 12,
    pontuacao: 100,
    prerequisitos: []
  }

  const isTeoria = lesson.tipo === 'Teoria'
  const exercicio: ExercicioFormData = isTeoria
    ? {
        titulo: `${lesson.titulo} — Sequência` ,
        descricao: lesson.descricao,
        licaoId: licao.aberturaId,
        ordem: 1,
        tipo: 'Passivo',
        dificuldade: mapDificuldade(lesson.dificuldade),
        status: 'Ativo',
        conteudo: {
          posicaoInicial: lesson.conteudo.posicaoInicial,
          contexto: lesson.conteudo.contexto,
          sequenciaMovimentos: lesson.conteudo.sequenciaMovimentos ?? [],
          explicacao: lesson.conteudo.explicacao,
          dicas: lesson.conteudo.dicas,
          feedbackCorreto: lesson.conteudo.feedbackCorreto,
          feedbackIncorreto: lesson.conteudo.feedbackIncorreto
        },
        pontuacao: 100,
        tentativasMaximas: 1
      }
    : {
        titulo: `${lesson.titulo} — Resposta Correta`,
        descricao: lesson.descricao,
        licaoId: licao.aberturaId,
        ordem: 1,
        tipo: 'Interativo',
        dificuldade: mapDificuldade(lesson.dificuldade),
        status: 'Ativo',
        conteudo: {
          posicaoInicial: lesson.conteudo.posicaoInicial,
          contexto: lesson.conteudo.contexto,
          movimentoCorreto: lesson.conteudo.movimentoCorreto,
          sequenciaMovimentos: lesson.conteudo.sequenciaMovimentos ?? [],
          explicacao: lesson.conteudo.explicacao,
          dicas: lesson.conteudo.dicas,
          feedbackCorreto: lesson.conteudo.feedbackCorreto,
          feedbackIncorreto: lesson.conteudo.feedbackIncorreto
        },
        pontuacao: 120,
        tempoLimite: 60,
        tentativasMaximas: 3
      }

  return { licao, exercicios: [exercicio] }
}