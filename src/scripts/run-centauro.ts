import fs from 'fs'
import path from 'path'
import { StockfishMock } from '../centauro/engine/stockfish'
import { ConsoleLogger } from '../centauro/infra/logger'
import { CentauroCore } from '../centauro/core/CentauroCore'
import { lessonToForms } from '../centauro/infra/prisma-mapper'

async function main() {
  const args = new Map<string, string>()
  process.argv.slice(2).forEach(a => {
    const [k, v] = a.split('=')
    args.set(k.replace(/^--/, ''), v ?? 'true')
  })
  const mode = (args.get('mode') ?? 'theory').toLowerCase()
  const dry = args.get('dry-run') !== undefined || args.get('save') === undefined

  const opts = {
    teoria: { minFrequencia: 0.6, maxProfundidade: 10, minPartidasPorNo: 20 },
    punicao: { limiarQuedaEval: 200, movetimeMs: 600, maxRamoPunicao: 6 }
  }

  const engine = new StockfishMock()
  const logger = new ConsoleLogger()
  const core = new CentauroCore(opts, { engine, logger })

  const dir = path.resolve(process.cwd(), 'data', 'pgns')
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.pgn')) : []
  const games = files.map(f => ({ headers: {}, pgn: fs.readFileSync(path.join(dir, f), 'utf8') }))

  const lessons = mode === 'punicao' ? await core.processTactics(games) : await core.processTheory(games)

  if (dry) {
    console.log(JSON.stringify(lessons, null, 2))
    return
  }

  try {
    const { prisma } = await import('../server/db')
    const { dificuldadeToEnum } = await import('../server/mappers')
    for (const lesson of lessons) {
      const { licao, exercicios } = lessonToForms(lesson)
      if (!licao.aberturaId) continue
      const licaoData = { ...licao, dificuldade: dificuldadeToEnum(licao.dificuldade) as unknown as string }
      const created = await prisma.licao.create({ data: licaoData as any })
      for (const ex of exercicios) {
        const exData = { ...ex, licaoId: created.id, dificuldade: dificuldadeToEnum(ex.dificuldade) as unknown as string }
        await prisma.exercicio.create({ data: exData as any })
      }
    }
  } catch {
    console.log(JSON.stringify(lessons, null, 2))
  }
}

main().catch(() => { process.exit(1) })