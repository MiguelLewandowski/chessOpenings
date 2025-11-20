import { Chess } from 'chess.js'
import type { CentauroOptions, LessonDTO } from '../dto/lesson'
import type { EngineClient } from '../engine/stockfish'
import { parsePGN } from '../parsers/pgn'
import { buildMoveTree, selectMainLines } from '../analytics/frequency'
import { detectBlunder, buildPunishment } from '../analytics/blunder'
import { runWithConcurrency } from '../utils/concurrency'
import type { Logger } from '../infra/logger'

export class CentauroCore {
  constructor(
    private readonly opts: CentauroOptions,
    private readonly deps: { engine: EngineClient; prisma?: unknown; logger?: Logger }
  ) {}

  // Processa partidas de GMs para construir linhas principais por frequência
  async processTheory(games: Array<{ headers: Record<string, string>; pgn: string }>): Promise<LessonDTO[]> {
    const logger = this.deps.logger
    const parsed = await runWithConcurrency(games, async (g, idx) => {
      try { return parsePGN(g.pgn) } catch { logger?.warn('PGN inválido', { idx }); return undefined }
    }, 4)

    const validGames = parsed.filter(Boolean).map(pg => (pg as { movesSAN: string[] }).movesSAN)
    const tree = buildMoveTree(validGames)
    const lines = selectMainLines(tree, this.opts.teoria)

    const lessons: LessonDTO[] = lines.map((ln, i) => {
      const startFen = ln.fens[0]
      const seq = ln.moves.map((san, k) => ({ id: `m${i+1}-${k+1}`, movimento: san, posicaoFEN: ln.fens[k+1] ?? startFen }))
      const explicacao = generateExplanation(startFen, ln.moves)
      return {
        titulo: `Linha Principal ${i+1}`,
        descricao: 'Construída por frequência em partidas de GMs',
        tipo: 'Teoria',
        dificuldade: 'Intermediario',
        conteudo: {
          posicaoInicial: startFen,
          contexto: 'Sequência teórica mais jogada nesta abertura',
          sequenciaMovimentos: seq,
          explicacao,
          dicas: [],
          feedbackCorreto: 'Você seguiu a linha teórica corretamente.',
          feedbackIncorreto: 'Compare com a linha principal e ajuste seus lances.'
        },
        estatisticas: { partidasProcessadas: validGames.length, frequenciaMedia: avg(ln.stats.frequencias) }
      }
    })
    return lessons
  }

  // Processa partidas de amadores para detectar blunders e gerar lições de punição
  async processTactics(games: Array<{ headers: Record<string, string>; pgn: string }>): Promise<LessonDTO[]> {
    const logger = this.deps.logger
    const parsed = await runWithConcurrency(games, async (g, idx) => {
      try { return parsePGN(g.pgn) } catch { logger?.warn('PGN inválido', { idx }); return undefined }
    }, 4)

    const lessons: LessonDTO[] = []
    for (let gi = 0; gi < parsed.length; gi++) {
      const pg = parsed[gi]
      if (!pg) continue
      // Reproduzir partida e coletar FENs + evals
      const game = new Chess()
      const fens: string[] = [game.fen()]
      const evals: number[] = [0]
      for (const san of pg.movesSAN) {
        try { game.move(san) } catch { logger?.warn('Lance inválido durante reprodução', { gi }); break }
        fens.push(game.fen())
        try {
          const { evalCp } = await this.deps.engine.analyze(game.fen(), { movetimeMs: this.opts.punicao.movetimeMs })
          evals.push(evalCp)
        } catch {
          logger?.warn('Falha engine durante análise', { gi })
          evals.push(evals[evals.length - 1])
        }
      }
      const bl = detectBlunder(evals, this.opts.punicao.limiarQuedaEval)
      if (!bl) continue
      const blunderIndex = bl.index
      const blunderFen = fens[blunderIndex]
      const punishment = await buildPunishment(this.deps.engine, blunderFen, { movetimeMs: this.opts.punicao.movetimeMs, maxRamo: this.opts.punicao.maxRamoPunicao })
      if (!punishment.moves.length) continue
      const explicacao = generateExplanation(blunderFen, punishment.moves)
      lessons.push({
        titulo: 'Punição ao erro crítico',
        descricao: 'Identificação do blunder e sequência de punição recomendada pelo motor',
        tipo: 'Punicao',
        dificuldade: 'Intermediario',
        conteudo: {
          posicaoInicial: blunderFen,
          contexto: 'A posição após o erro admite resposta precisa',
          movimentoCorreto: punishment.moves[0],
          sequenciaMovimentos: punishment.moves.map((san, k) => ({ id: `p${gi+1}-${k+1}`, movimento: san, posicaoFEN: punishment.fens[k+1] ?? blunderFen })),
          explicacao,
          dicas: ['Priorize capturas forçadas e ameaças diretas ao rei.'],
          feedbackCorreto: 'Sequência correta aplicada com precisão.',
          feedbackIncorreto: 'Revise o tema tático e tente novamente.'
        },
        estatisticas: { partidasProcessadas: 1, quedaEval: bl.delta }
      })
    }
    return lessons
  }
}

function avg(ns: number[]): number { return ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0 }

function generateExplanation(fen: string, moveList: string[]): string {
  return `Nesta posição (${fen}), a sequência ${moveList.join(' → ')} ilustra a ideia central: ` +
    `controle de casas críticas, melhoria das peças e exploração de fraquezas.`
}