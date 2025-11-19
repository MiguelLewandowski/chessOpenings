import { prisma } from '../src/server/db'
import { Chess } from 'chess.js'

function fenAfterMoves(startFen: string, moves: string[], count: number) {
  const game = new Chess()
  try { game.load(startFen) } catch {}
  for (let i = 0; i < Math.min(count, moves.length); i++) {
    try { game.move(moves[i]) } catch {}
  }
  return game.fen()
}

function makePassiveExercise(licaoId: string, ordem: number, title: string, startFen: string, seq: string[], context: string) {
  const sequenciaMovimentos = seq.map((san, i) => ({
    id: `m${ordem}-${i+1}`,
    movimento: san,
    posicaoFEN: fenAfterMoves(startFen, seq, i+1),
    explicacao: ''
  }))
  return {
    titulo: title,
    descricao: 'Visualização da sequência',
    licaoId,
    ordem,
    tipo: 'Passivo' as const,
    dificuldade: 'Iniciante' as const,
    status: 'Ativo' as const,
    conteudo: {
      posicaoInicial: startFen,
      contexto: context,
      sequenciaMovimentos,
      explicacao: 'Observe a coordenação das peças e os planos típicos.',
      dicas: [],
      feedbackCorreto: 'Sequência acompanhada com sucesso!',
      feedbackIncorreto: ''
    },
    pontuacao: 100,
    tentativasMaximas: 1
  }
}

function makeInteractiveExercise(licaoId: string, ordem: number, title: string, startFen: string, preMoves: string[], correctSan: string, context: string) {
  const positionFen = fenAfterMoves(startFen, preMoves, preMoves.length)
  return {
    titulo: title,
    descricao: 'Encontre o melhor lance nesta posição',
    licaoId,
    ordem,
    tipo: 'Interativo' as const,
    dificuldade: 'Intermediario' as const,
    status: 'Ativo' as const,
    conteudo: {
      posicaoInicial: positionFen,
      contexto: context,
      movimentoCorreto: correctSan,
      explicacao: `O lance ${correctSan} segue os princípios da posição.`,
      dicas: ['Observe as peças desenvolvidas', 'Controle do centro primeiro'],
      feedbackCorreto: 'Excelente! Lance correto.',
      feedbackIncorreto: 'Não é o melhor lance nesta posição.'
    },
    pontuacao: 120,
    tempoLimite: 60,
    tentativasMaximas: 3
  }
}

function makeQuizExercise(licaoId: string, ordem: number, title: string, startFen: string, preMoves: string[], correctSan: string, wrongSans: string[], context: string) {
  const positionFen = fenAfterMoves(startFen, preMoves, preMoves.length)
  const options = [
    { id: `opt-${ordem}-a`, movimento: correctSan, texto: 'Linha principal', correta: true, explicacao: `O lance ${correctSan} mantém a iniciativa.` },
    { id: `opt-${ordem}-b`, movimento: wrongSans[0], texto: 'Alternativa menos precisa', correta: false, explicacao: 'Perde tempo ou cede o centro.' },
    { id: `opt-${ordem}-c`, movimento: wrongSans[1], texto: 'Move sem objetivo claro', correta: false },
    { id: `opt-${ordem}-d`, movimento: wrongSans[2], texto: 'Compromete a posição', correta: false }
  ]
  return {
    titulo: title,
    descricao: 'Escolha o melhor movimento',
    licaoId,
    ordem,
    tipo: 'Quiz' as const,
    dificuldade: 'Intermediario' as const,
    status: 'Ativo' as const,
    conteudo: {
      posicaoInicial: positionFen,
      contexto: context,
      opcoes: options,
      explicacao: `O melhor movimento é ${correctSan}.`,
      dicas: ['Compare alternativas e planos'],
      feedbackCorreto: 'Correto! Você escolheu a linha principal.',
      feedbackIncorreto: 'Revise o controle do centro e desenvolvimento.'
    },
    pontuacao: 100,
    tentativasMaximas: 1
  }
}

async function run() {
  await prisma.user.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' }
  })

  const abertura = await prisma.abertura.create({
    data: {
      nome: 'Abertura Italiana',
      categoria: 'Posicional',
      dificuldade: 'Iniciante',
      movimentos: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
      descricao: 'Desenvolvimento rápido e controle do centro',
      status: 'Ativo'
    }
  })

  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

  const lessonDefs = [
    { titulo: 'Princípios da Italiana', dificuldade: 'Iniciante', seq: ['e4','e5','Nf3','Nc6','Bc4'] },
    { titulo: 'Giuoco Piano (Bc4 Bc5)', dificuldade: 'Iniciante', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d4'] },
    { titulo: 'Two Knights Defense', dificuldade: 'Intermediario', seq: ['e4','e5','Nf3','Nc6','Bc4','Nf6','Ng5'] },
    { titulo: 'Evans Gambit', dificuldade: 'Intermediario', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4'] },
    { titulo: 'Ataque ao centro com d4', dificuldade: 'Intermediario', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','d4','exd4','c3'] },
    { titulo: 'Gambito de Fegatello (Ng5)', dificuldade: 'Avancado', seq: ['e4','e5','Nf3','Nc6','Bc4','Nf6','Ng5','d5'] },
    { titulo: 'Plano com c3 e d4', dificuldade: 'Iniciante', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','d6','d4'] },
    { titulo: 'Linha com a4 contra ...b5', dificuldade: 'Intermediario', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4','Bxb4','c3','Ba5','a4'] },
    { titulo: 'Desenvolvimento harmonioso', dificuldade: 'Iniciante', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','Nc3','Nf6','d3'] },
    { titulo: 'Domínio das casas centrais', dificuldade: 'Intermediario', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','d3','d6','c3','a6'] },
    { titulo: 'Transição para meio-jogo', dificuldade: 'Intermediario', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','d3','d6','c3','Nf6','O-O'] },
    { titulo: 'Recurso tático: Bxf7+', dificuldade: 'Avancado', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','Bxf7+'] },
    { titulo: 'Estratégia de roque rápido', dificuldade: 'Iniciante', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','O-O','Nf6','Re1'] },
    { titulo: 'Jogo posicional com h3', dificuldade: 'Intermediario', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','h3','Nf6','d3'] },
    { titulo: 'Plano contra ...Na5', dificuldade: 'Avancado', seq: ['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Na5','Be2'] }
  ]

  for (let i = 0; i < lessonDefs.length; i++) {
    const def = lessonDefs[i]
    const licao = await prisma.licao.create({
      data: {
        titulo: def.titulo,
        descricao: 'Lição prática com objetivos claros',
        aberturaId: abertura.id,
        ordem: i + 1,
        dificuldade: def.dificuldade as 'Iniciante' | 'Intermediario' | 'Avancado',
        status: 'Ativo',
        estimativaTempo: 12,
        pontuacao: 100
      }
    })

    // Exercício 1: Passivo (sequência principal da lição)
    await prisma.exercicio.create({ data: makePassiveExercise(licao.id, 1, 'Sequência principal', startFen, def.seq, 'Acompanhe os lances da linha.') })

    // Exercício 2: Interativo (jogue o próximo lance da sequência)
    if (def.seq.length >= 2) {
      const pre = def.seq.slice(0, Math.max(0, def.seq.length - 1))
      const correct = def.seq[def.seq.length - 1]
      await prisma.exercicio.create({ data: makeInteractiveExercise(licao.id, 2, 'Seu lance', startFen, pre, correct, 'Encontre a continuação correta.') })
    } else {
      await prisma.exercicio.create({ data: makeInteractiveExercise(licao.id, 2, 'Seu lance', startFen, def.seq, 'Nf3', 'Encontre a continuação correta.') })
    }

    // Exercício 3: Quiz (melhor lance entre opções)
    const preQuiz = def.seq.slice(0, Math.max(1, def.seq.length - 1))
    const correctQuiz = def.seq[Math.max(0, def.seq.length - 1)]
    const wrongs = ['a3','h3','Qc2']
    await prisma.exercicio.create({ data: makeQuizExercise(licao.id, 3, 'Qual é o melhor lance?', startFen, preQuiz, correctQuiz, wrongs, 'Escolha a melhor continuação.') })

    // Exercício 4: Passivo curto (3 lances)
    const shortSeq = def.seq.slice(0, Math.min(3, def.seq.length))
    await prisma.exercicio.create({ data: makePassiveExercise(licao.id, 4, 'Mini sequência', startFen, shortSeq, 'Visualização rápida.') })

    // Exercício 5: Interativo de revisão
    const pre2 = def.seq.slice(0, Math.min(2, def.seq.length))
    const next2 = def.seq[Math.min(2, def.seq.length - 1)] || 'Nc3'
    await prisma.exercicio.create({ data: makeInteractiveExercise(licao.id, 5, 'Revisão prática', startFen, pre2, next2, 'Refixe o padrão com o lance correto.') })
  }
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    await prisma.$disconnect()
    process.exit(1)
  })
