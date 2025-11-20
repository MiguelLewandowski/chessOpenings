import { Chess } from 'chess.js'

export interface MoveNode {
  fen: string
  total: number
  children: Map<string, { count: number; node: MoveNode }>
}

export function buildMoveTree(games: Array<string[]>): MoveNode {
  const start = new Chess()
  const root: MoveNode = { fen: start.fen(), total: 0, children: new Map() }
  for (const sanList of games) {
    const game = new Chess()
    let current = root
    for (const san of sanList) {
      current.total += 1
      const key = san
      const child = current.children.get(key)
      if (child) {
        child.count += 1
        current = child.node
      } else {
        const next = new Chess(game.fen())
        try { next.move(san) } catch { break }
        const node: MoveNode = { fen: next.fen(), total: 0, children: new Map() }
        current.children.set(key, { count: 1, node })
        current = node
      }
      try { game.move(san) } catch { break }
    }
  }
  return root
}

export function selectMainLines(
  root: MoveNode,
  opts: { minFrequencia: number; maxProfundidade: number; minPartidasPorNo: number }
): Array<{ moves: string[]; fens: string[]; stats: { frequencias: number[] } }> {
  const lines: Array<{ moves: string[]; fens: string[]; stats: { frequencias: number[] } }> = []

  function dfs(node: MoveNode, prefixMoves: string[], prefixFens: string[], prefixFreqs: number[], depth: number) {
    if (depth >= opts.maxProfundidade) {
      lines.push({ moves: prefixMoves.slice(), fens: prefixFens.slice(), stats: { frequencias: prefixFreqs.slice() } })
      return
    }
    if (node.children.size === 0) {
      if (prefixMoves.length) lines.push({ moves: prefixMoves.slice(), fens: prefixFens.slice(), stats: { frequencias: prefixFreqs.slice() } })
      return
    }
    const total = node.total || Array.from(node.children.values()).reduce((a, c) => a + c.count, 0)
    const candidates = Array.from(node.children.entries())
      .map(([san, meta]) => ({ san, count: meta.count, node: meta.node, freq: total ? meta.count / total : 0 }))
      .filter(c => c.count >= opts.minPartidasPorNo && c.freq >= opts.minFrequencia)
      .sort((a, b) => b.freq - a.freq)

    if (candidates.length === 0) {
      // Encerrar linha atual
      if (prefixMoves.length) lines.push({ moves: prefixMoves.slice(), fens: prefixFens.slice(), stats: { frequencias: prefixFreqs.slice() } })
      return
    }
    // Explorar ramos qualificados (principal + secundários)
    for (const c of candidates) {
      dfs(c.node, [...prefixMoves, c.san], [...prefixFens, c.node.fen], [...prefixFreqs, c.freq], depth + 1)
    }
  }

  dfs(root, [], [root.fen], [], 0)
  return lines
}