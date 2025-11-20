import { Chess } from 'chess.js'

export interface EngineClient {
  init(): Promise<void>
  analyze(fen: string, opts?: { movetimeMs?: number; depth?: number }): Promise<{ evalCp: number; bestmove?: string }>
  dispose(): Promise<void>
}

// Mock do motor preparado para futura troca por node-uci
export class StockfishMock implements EngineClient {
  private initialized = false

  async init(): Promise<void> {
    this.initialized = true
  }

  async analyze(fen: string, _opts?: { movetimeMs?: number; depth?: number }): Promise<{ evalCp: number; bestmove?: string }> {
    if (!this.initialized) await this.init()
    const game = new Chess()
    try { game.load(fen) } catch { return { evalCp: 0, bestmove: undefined } }
    const moves = game.moves({ verbose: true }) as Array<{
      from: string
      to: string
      san: string
      flags: string
      promotion?: 'q'|'r'|'b'|'n'
    }>
    if (moves.length === 0) return { evalCp: 0, bestmove: undefined }
    // Heurística simples: preferir capturas ou avanço central
    const central = new Set(['d4','e4','d5','e5'])
    const sorted = moves.slice().sort((a, b) => {
      const ac = a.flags.includes('c') ? 2 : (central.has(a.to) ? 1 : 0)
      const bc = b.flags.includes('c') ? 2 : (central.has(b.to) ? 1 : 0)
      return bc - ac
    })
    const best = sorted[0]
    const evalCp = 0 // Mock: avaliação neutra
    const uci = `${best.from}${best.to}${best.promotion ? best.promotion : ''}`
    return { evalCp, bestmove: uci }
  }

  async dispose(): Promise<void> {
    this.initialized = false
  }
}