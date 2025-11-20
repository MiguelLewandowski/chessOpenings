import { Chess } from 'chess.js'
import type { EngineClient } from '../engine/stockfish'

export function detectBlunder(evals: number[], limiarQuedaEval: number): { index: number; delta: number } | null {
  if (evals.length < 2) return null
  for (let i = 1; i < evals.length; i++) {
    const delta = evals[i] - evals[i - 1]
    if (delta <= -Math.abs(limiarQuedaEval)) return { index: i, delta }
  }
  return null
}

export async function buildPunishment(
  engine: EngineClient,
  fen: string,
  opts: { movetimeMs: number; maxRamo: number }
): Promise<{ moves: string[]; fens: string[] }> {
  const moves: string[] = []
  const fens: string[] = [fen]
  let current = new Chess()
  try { current.load(fen) } catch { return { moves, fens } }

  for (let k = 0; k < opts.maxRamo; k++) {
    const res = await engine.analyze(current.fen(), { movetimeMs: opts.movetimeMs })
    if (!res.bestmove) break
    const from = res.bestmove.slice(0, 2)
    const to = res.bestmove.slice(2, 4)
    const promo = res.bestmove.length > 4 ? res.bestmove.slice(4, 5) as 'q'|'r'|'b'|'n' : undefined
    try {
      const m = current.move({ from, to, promotion: promo })
      if (!m) break
      moves.push(m.san)
      fens.push(current.fen())
    } catch {
      break
    }
  }
  return { moves, fens }
}