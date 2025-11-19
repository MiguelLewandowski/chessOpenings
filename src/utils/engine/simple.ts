import { Chess } from 'chess.js'

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
}

const CENTER = new Set(['d4','e4','d5','e5'])

function evaluateBoard(game: Chess): number {
  const board = game.board()
  let score = 0
  for (const row of board) {
    for (const cell of row) {
      if (!cell) continue
      const val = PIECE_VALUES[cell.type] || 0
      score += cell.color === 'w' ? val : -val
      if (CENTER.has(cell.square)) {
        score += cell.color === 'w' ? 10 : -10
      }
    }
  }
  const mobility = game.moves().length
  score += (game.turn() === 'w' ? 1 : -1) * mobility
  return score
}

export class SimpleEngine {
  depth: number
  constructor(depth = 2) {
    this.depth = depth
  }

  bestmove(fen: string, timeMs = 800): string {
    const deadline = Date.now() + Math.max(200, timeMs)
    const game = new Chess()
    try { game.load(fen) } catch { return '' }
    const moves = game.moves({ verbose: true })
    if (moves.length === 0) return ''
    moves.sort((a,b) => ((b as any).flags?.includes('c') ? 1 : 0) - ((a as any).flags?.includes('c') ? 1 : 0))
    let best = moves[0]
    let bestScore = -Infinity
    for (let d = 1; d <= this.depth; d++) {
      for (const mv of moves) {
        const g = new Chess(game.fen())
        g.move(mv)
        const score = -this.search(g, d - 1, -Infinity, Infinity, deadline)
        if (score > bestScore) {
          bestScore = score
          best = mv
        }
        if (Date.now() > deadline) break
      }
      if (Date.now() > deadline) break
    }
    const uci = `${best.from}${best.to}${best.promotion ? best.promotion : ''}`
    return uci
  }

  private search(game: Chess, depth: number, alpha: number, beta: number, deadline: number): number {
    if (depth <= 0 || Date.now() > deadline) {
      return evaluateBoard(game)
    }
    const moves = game.moves({ verbose: true })
    if (moves.length === 0) {
      if ((game as any).isCheckmate && (game as any).isCheckmate()) return -99999
      return 0
    }
    moves.sort((a,b) => ((b as any).flags?.includes('c') ? 1 : 0) - ((a as any).flags?.includes('c') ? 1 : 0))
    let best = -Infinity
    for (const mv of moves) {
      const g = new Chess(game.fen())
      g.move(mv)
      const val = -this.search(g, depth - 1, -beta, -alpha, deadline)
      best = Math.max(best, val)
      alpha = Math.max(alpha, val)
      if (alpha >= beta) break
      if (Date.now() > deadline) break
    }
    return best
  }
}
