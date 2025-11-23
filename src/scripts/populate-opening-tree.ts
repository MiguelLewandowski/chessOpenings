import 'dotenv/config'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import { Chess } from 'chess.js'

type ExplorerMove = {
  uci: string
  san: string
  white: number
  black: number
  draws: number
  averageRating?: number | null
}

type ExplorerResponse = {
  white: number
  black: number
  draws: number
  moves: ExplorerMove[]
  averageRating?: number | null
}

const prisma = new PrismaClient()

function applyUci(fen: string, uci: string): string {
  const chess = new Chess(fen)
  const from = uci.slice(0, 2)
  const to = uci.slice(2, 4)
  const promotion = uci.length === 5 ? uci[4] : undefined
  const res = chess.move({ from, to, promotion })
  if (!res) throw new Error(`Movimento inválido: ${uci} para FEN: ${fen}`)
  return chess.fen()
}

async function fetchExplorer(fen: string): Promise<ExplorerResponse> {
  const url = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`
  const { data } = await axios.get(url, { timeout: 15000 })
  return data as ExplorerResponse
}

const visited = new Set<string>()

async function upsertRoot(fen: string, stats: ExplorerResponse) {
  const total = stats.white + stats.black + stats.draws
  const averageRating = stats.averageRating ?? null
  return prisma.openingNode.upsert({
    where: { fen },
    update: {
      san: 'start',
      uci: 'start',
      popularity: total,
      whiteWins: stats.white,
      blackWins: stats.black,
      draws: stats.draws,
      averageRating,
    },
    create: {
      fen,
      san: 'start',
      uci: 'start',
      popularity: total,
      whiteWins: stats.white,
      blackWins: stats.black,
      draws: stats.draws,
      averageRating,
    },
  })
}

async function upsertChild(parentId: string, fen: string, move: ExplorerMove) {
  const popularity = move.white + move.black + move.draws
  const averageRating = move.averageRating ?? null
  return prisma.openingNode.upsert({
    where: { fen },
    update: {
      san: move.san,
      uci: move.uci,
      popularity,
      whiteWins: move.white,
      blackWins: move.black,
      draws: move.draws,
      averageRating,
      parentId,
    },
    create: {
      fen,
      san: move.san,
      uci: move.uci,
      popularity,
      whiteWins: move.white,
      blackWins: move.black,
      draws: move.draws,
      averageRating,
      parentId,
    },
  })
}

async function crawl(fen: string, maxDepth: number) {
  if (visited.has(fen)) return
  visited.add(fen)
  const stats = await fetchExplorer(fen)
  const parent = await upsertRoot(fen, stats)
  if (maxDepth <= 0) return
  const total = stats.white + stats.black + stats.draws
  for (const m of stats.moves) {
    const movePopularity = m.white + m.black + m.draws
    const ratio = total === 0 ? 0 : movePopularity / total
    if (ratio < 0.05) continue
    let childFen: string
    try {
      childFen = applyUci(fen, m.uci)
    } catch {
      continue
    }
    await upsertChild(parent.id, childFen, m)
    await crawl(childFen, maxDepth - 1)
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const fenIndex = args.findIndex((a) => a === '--fen')
  const depthIndex = args.findIndex((a) => a === '--depth')
  const fen = fenIndex >= 0 ? args[fenIndex + 1] : ''
  const depth = depthIndex >= 0 ? Number(args[depthIndex + 1]) : 2
  return { fen, depth }
}

async function main() {
  const { fen, depth } = parseArgs()
  if (!fen) throw new Error('Parâmetro --fen é obrigatório')
  try {
    await crawl(fen, depth)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(async (err) => {
  console.error(err?.message || err)
  await prisma.$disconnect()
  process.exit(1)
})