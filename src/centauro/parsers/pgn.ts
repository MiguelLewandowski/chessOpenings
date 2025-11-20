import { Chess } from 'chess.js'

export interface ParsedGame {
  movesSAN: string[]
  headers: Record<string, string>
}

export function parsePGN(pgn: string): ParsedGame {
  const game = new Chess()
  try { game.load_pgn(pgn, { sloppy: true }) } catch {
    throw new Error('PGN inválido')
  }
  const history = game.history({ verbose: true })
  const movesSAN = history.map(h => h.san)
  const headers = (game.header() as unknown as Record<string,string>) || {}
  return { movesSAN, headers }
}