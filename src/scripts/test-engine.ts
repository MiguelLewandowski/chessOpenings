import { StockfishMock } from '../centauro/engine/stockfish'
import { ConsoleLogger } from '../centauro/infra/logger'
import { CentauroCore } from '../centauro/core/CentauroCore'

async function main() {
  const pgn = `
[Event "-"]
[Site "-"]
[Date "2025.01.01"]
[Round "-"]
[White "GM"]
[Black "GM"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 *
`
  const games = [{ headers: {}, pgn }]
  const core = new CentauroCore({
    teoria: { minFrequencia: 0.6, maxProfundidade: 10, minPartidasPorNo: 1 },
    punicao: { limiarQuedaEval: 200, movetimeMs: 600, maxRamoPunicao: 6 }
  }, { engine: new StockfishMock(), logger: new ConsoleLogger() })
  const lessons = await core.processTheory(games)
  console.log(JSON.stringify(lessons, null, 2))
}

main().catch(() => { process.exit(1) })