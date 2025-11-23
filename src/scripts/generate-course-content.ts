import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { Chess } from 'chess.js'
import axios from 'axios'

type AiPayload = {
  explanation: string
  quiz_question: string
  quiz_options: string[]
  correct_index: number
  feedback_success: string
  feedback_fail: string
}

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

const color = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
}

function parseArgs() {
  const args = process.argv.slice(2)
  const nameIdx = args.findIndex((a) => a === '--course')
  const fenIdx = args.findIndex((a) => a === '--fen')
  const maxIdx = args.findIndex((a) => a === '--maxMoves')
  const course = nameIdx >= 0 ? args[nameIdx + 1] : ''
  const fen = fenIdx >= 0 ? args[fenIdx + 1] : ''
  const maxMoves = maxIdx >= 0 ? Number(args[maxIdx + 1]) : 10
  return { course, fen, maxMoves }
}

async function getNodeByFen(fen: string) {
  const exact = await prisma.openingNode.findUnique({ where: { fen } })
  if (exact) return exact
  const parts = fen.trim().split(/\s+/)
  const normalized = parts.slice(0, 4).join(' ')
  const fallback = await prisma.openingNode.findFirst({
    where: { fen: { startsWith: normalized } },
    orderBy: { popularity: 'desc' },
  })
  return fallback || null
}

async function getMainline(startFen: string, limit: number) {
  const path: { nodeId: string; fen: string; san: string; uci: string }[] = []
  const start = await getNodeByFen(startFen)
  if (!start) throw new Error('FEN inicial não encontrado em OpeningNode')
  let current = start
  let moves = 0
  while (moves < limit) {
    const next = await prisma.openingNode.findMany({
      where: { parentId: current.id },
      orderBy: { popularity: 'desc' },
      take: 1,
    })
    if (next.length === 0) break
    const child = next[0]
    path.push({ nodeId: child.id, fen: child.fen, san: child.san, uci: child.uci })
    current = child
    moves++
  }
  return path
}

function courseDescription(name: string, startFen: string, movesSan: string[]) {
  return `${name}: linha principal a partir de ${startFen}, cobrindo ${movesSan.join(' ')}.`
}

async function callAi(san: string, fen: string, courseName: string) {
  // 1. CALCULAMOS A VERDADE MATEMÁTICA ANTES
  const context = getMoveContext(fen, san)
  
  const system = `
    Você é o "Grandmaster Duo", um analista de xadrez de elite.
    
    SUA MISSÃO:
    Explicar o lance fornecido usando APENAS os dados geométricos reais que eu te passar.
    
    REGRA DE OURO (ANTI-ALUCINAÇÃO):
    - Eu vou te dizer exatamente quais casas a peça controla agora. NÃO INVENTE OUTRAS CASAS.
    - Se a peça for um Cavalo em c3, e eu disser que ele controla "d5, e4", você NÃO PODE dizer que ele ajuda em "d4".
    - Seja tecnicamente preciso como um Grande Mestre, mas divertido como o Duolingo.
    
    FORMATO JSON:
    {
      "explanation": "Explicação estratégica focada nas casas controladas.",
      "quiz_question": "Pergunta conceitual.",
      "quiz_options": ["Errada", "Certa", "Errada"],
      "correct_index": 1,
      "feedback_success": "Boa!",
      "feedback_fail": "Tente de novo."
    }
  `

  const user = `
    CONTEXTO TÉCNICO (USE ISTO COMO VERDADE ABSOLUTA):
    - Abertura: ${courseName}
    - Lance Jogado: ${san}
    - Peça: ${context.piece === 'n' ? 'Cavalo' : context.piece === 'p' ? 'Peão' : context.piece}
    - Esta peça agora está na casa: ${context.to}
    - **CASAS QUE ELA CONTROLA/ATACA AGORA**: [${context.controlledSquares}]
    
    INSTRUÇÃO:
    Explique por que controlar essas casas específicas ([${context.controlledSquares}]) é bom nesta abertura.
  `

  const prompt = `${system}\n\n${user}`
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }]}],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          explanation: { type: SchemaType.STRING },
          quiz_question: { type: SchemaType.STRING },
          quiz_options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          correct_index: { type: SchemaType.INTEGER },
          feedback_success: { type: SchemaType.STRING },
          feedback_fail: { type: SchemaType.STRING },
        },
        required: ['explanation','quiz_question','quiz_options','correct_index','feedback_success','feedback_fail'],
      },
    },
  })

  return result.response.text() || '{}'
}

function getMoveContext(fen: string, san: string) {
  const game = new Chess(fen)
  const mv = game.move(san)
  if (!mv) {
    return { piece: '?', to: '?', controlledSquares: '' }
  }
  const after = new Chess(game.fen())
  const sq = mv.to
  const piece = mv.piece
  const color = mv.color
  const board = after.board()
  const files = ['a','b','c','d','e','f','g','h']
  const file = sq[0]
  const rank = Number(sq[1])
  const c = files.indexOf(file)
  const r = 8 - rank
  const inB = (rr:number, cc:number)=> rr>=0&&rr<8&&cc>=0&&cc<8
  const pushRay = (dr:number, dc:number, acc:string[])=>{
    let rr=r+dr, cc=c+dc
    while(inB(rr,cc)){
      const p = board[rr][cc]
      const sqName = `${files[cc]}${8-rr}`
      if(p){
        if(p.color !== color) acc.push(sqName)
        break
      } else {
        acc.push(sqName)
      }
      rr+=dr; cc+=dc
    }
  }
  let controls:string[] = []
  if (piece === 'n') {
    const offs = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
    for(const [dr,dc] of offs){
      const rr=r+dr, cc=c+dc
      if(!inB(rr,cc)) continue
      const p = board[rr][cc]
      const sqName = `${files[cc]}${8-rr}`
      if(!p || p.color !== color) controls.push(sqName)
    }
  } else if (piece === 'b') {
    pushRay(-1,-1,controls); pushRay(-1,1,controls); pushRay(1,-1,controls); pushRay(1,1,controls)
  } else if (piece === 'r') {
    pushRay(-1,0,controls); pushRay(1,0,controls); pushRay(0,-1,controls); pushRay(0,1,controls)
  } else if (piece === 'q') {
    pushRay(-1,-1,controls); pushRay(-1,1,controls); pushRay(1,-1,controls); pushRay(1,1,controls);
    pushRay(-1,0,controls); pushRay(1,0,controls); pushRay(0,-1,controls); pushRay(0,1,controls)
  } else if (piece === 'k') {
    const offs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
    for(const [dr,dc] of offs){
      const rr=r+dr, cc=c+dc
      if(!inB(rr,cc)) continue
      const p = board[rr][cc]
      const sqName = `${files[cc]}${8-rr}`
      if(!p || p.color !== color) controls.push(sqName)
    }
  } else if (piece === 'p') {
    const dir = color === 'w' ? -1 : 1
    const rr = r + dir
    for (const dc of [-1,1]){
      const cc = c + dc
      if(!inB(rr,cc)) continue
      const sqName = `${files[cc]}${8-rr}`
      controls.push(sqName)
    }
  }
  return { piece, to: sq, controlledSquares: controls.join(', ') }
}

function safeJsonParse(str: string): AiPayload | null {
  try {
    const obj = JSON.parse(str)
    if (
      typeof obj.explanation === 'string' &&
      typeof obj.quiz_question === 'string' &&
      Array.isArray(obj.quiz_options) &&
      typeof obj.correct_index === 'number' &&
      typeof obj.feedback_success === 'string' &&
      typeof obj.feedback_fail === 'string'
    ) {
      return obj as AiPayload
    }
    return null
  } catch {
    return null
  }
}

function extractJson(str: string): AiPayload | null {
  const start = str.indexOf('{')
  const end = str.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  return safeJsonParse(str.slice(start, end + 1))
}

async function getAiPayload(san: string, fen: string, courseName: string): Promise<AiPayload> {
  const first = await callAi(san, fen, courseName)
  let parsed = safeJsonParse(first) || extractJson(first)
  if (parsed) return parsed
  const system = 'Você é um professor de xadrez divertido estilo Duolingo. Retorne exclusivamente um objeto JSON com as chaves: explanation, quiz_question, quiz_options, correct_index, feedback_success, feedback_fail.'
  const user = `Explique o lance ${san} na posição ${fen}. Abertura: ${courseName}. Responda apenas com JSON.`
  const retryPrompt = `${system}\n\n${user}`
  const retry = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: retryPrompt }]}],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          explanation: { type: SchemaType.STRING },
          quiz_question: { type: SchemaType.STRING },
          quiz_options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          correct_index: { type: SchemaType.INTEGER },
          feedback_success: { type: SchemaType.STRING },
          feedback_fail: { type: SchemaType.STRING },
        },
        required: ['explanation','quiz_question','quiz_options','correct_index','feedback_success','feedback_fail'],
      },
    },
  })
  const retryContent = retry.response.text() || ''
  parsed = safeJsonParse(retryContent) || extractJson(retryContent)
  if (!parsed) throw new Error('Resposta da IA inválida')
  return parsed
}

type ExplorerMove = { uci: string; san: string; white: number; black: number; draws: number }
type ExplorerResponse = { white: number; black: number; draws: number; moves: ExplorerMove[] }

async function fetchExplorer(fen: string): Promise<ExplorerResponse> {
  const url = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`
  const { data } = await axios.get(url, { timeout: 15000 })
  return data as ExplorerResponse
}

function applyUci(fen: string, uci: string): string {
  const chess = new Chess(fen)
  const from = uci.slice(0, 2)
  const to = uci.slice(2, 4)
  const promotion = uci.length === 5 ? uci[4] : undefined
  const res = chess.move({ from, to, promotion })
  if (!res) throw new Error('Movimento inválido')
  return chess.fen()
}

async function buildMainlineFromExplorer(startFen: string, limit: number) {
  const path: { nodeId: string; fen: string; san: string; uci: string }[] = []
  let currentFen = startFen
  let steps = 0
  while (steps < limit) {
    const stats = await fetchExplorer(currentFen)
    const total = stats.white + stats.black + stats.draws
    if (!stats.moves || stats.moves.length === 0 || total === 0) break
    const sorted = [...stats.moves].sort((a, b) => (b.white + b.black + b.draws) - (a.white + a.black + a.draws))
    const best = sorted[0]
    const popularity = best.white + best.black + best.draws
    const ratio = popularity / total
    if (ratio < 0.05) break
    const nextFen = applyUci(currentFen, best.uci)
    path.push({ nodeId: `${steps}`, fen: nextFen, san: best.san, uci: best.uci })
    currentFen = nextFen
    steps++
  }
  return path
}

async function generate() {
  const { course, fen, maxMoves } = parseArgs()
  if (!course) throw new Error('Parâmetro --course é obrigatório')
  if (!fen) throw new Error('Parâmetro --fen é obrigatório')

  console.log(`${color.cyan}Construindo linha principal...${color.reset}`)
  const mainline = await getMainline(fen, maxMoves)
  const filtered = mainline.filter(
    (m) => m.san && m.san.toLowerCase() !== 'start' && m.uci && m.uci.toLowerCase() !== 'start'
  )
  let effective = filtered
  if (effective.length === 0) {
    const apiPath = await buildMainlineFromExplorer(fen, maxMoves)
    effective = apiPath.filter((m) => m.san && m.uci)
  }
  if (effective.length === 0) throw new Error('Nenhum lance válido encontrado para a linha principal')
  const movesSan = effective.map((m) => m.san)
  console.log(`${color.cyan}Linha principal: ${movesSan.join(' ')}${color.reset}`)

  console.log(`${color.green}Gerando estrutura do curso...${color.reset}`)

  const aiPayloads: AiPayload[] = []
  const quizOptionsPerStep: { id: string; movimento: string; texto: string; correta: boolean; explicacao?: string }[][] = []
  for (let i = 0; i < effective.length; i++) {
    const step = effective[i]
    const promptFen = i === 0 ? fen : effective[i - 1].fen
    const stepSan = step.san
    const ai = await getAiPayload(stepSan, promptFen, course)
    aiPayloads.push(ai)

    try {
      const stats = await fetchExplorer(promptFen)
      const optionsRaw = stats.moves || []
      const top = optionsRaw
        .map((m, idx) => ({ m, idx, pop: m.white + m.black + m.draws }))
        .sort((a, b) => b.pop - a.pop)
        .slice(0, 4)
        .map((o, k) => ({
          id: `opt_${i}_${k}`,
          movimento: o.m.san,
          texto: `Opção ${k + 1}`,
          correta: o.m.san === stepSan,
          explicacao: o.m.san === stepSan ? ai.explanation : undefined,
        }))
      const ensureCorrect = top.some((o) => o.correta)
      if (!ensureCorrect) {
        top.unshift({ id: `opt_${i}_c`, movimento: stepSan, texto: 'Melhor lance', correta: true, explicacao: ai.explanation })
      }
      quizOptionsPerStep.push(top.slice(0, 4))
    } catch {
      quizOptionsPerStep.push([
        { id: `opt_${i}_c`, movimento: stepSan, texto: 'Melhor lance', correta: true, explicacao: ai.explanation },
      ])
    }
  }

  await prisma.$transaction(async (tx) => {
    const abertura = await tx.abertura.create({
      data: {
        nome: course,
        categoria: 'Universal',
        dificuldade: 'Intermediario',
        movimentos: movesSan,
        descricao: courseDescription(course, fen, movesSan),
        status: 'Ativo',
      },
    })

    const modulo = await (tx as any).modulo.create({
      data: {
        titulo: 'Linha Principal',
        descricao: 'Variante principal navegando pelos lances mais populares.',
        aberturaId: abertura.id,
        ordem: 1,
        status: 'Ativo',
      },
    })

    const toSan = (parentFen: string, uci: string, san: string) => {
      if (san && san.toLowerCase() !== 'start') return san
      const chess = new Chess(parentFen)
      const from = uci.slice(0, 2)
      const to = uci.slice(2, 4)
      const promotion = uci.length === 5 ? uci[4] : undefined
      const m = chess.move({ from, to, promotion })
      return m?.san || san
    }

    let ordemLicao = 1
    for (let i = 0; i < effective.length; i++) {
      const step = effective[i]
      const promptFen = i === 0 ? fen : effective[i - 1].fen
      const stepSan = toSan(promptFen, step.uci, step.san)
      if (!stepSan || stepSan.toLowerCase() === 'start') continue
      console.log(`${color.yellow}Gerando lição para ${stepSan}...${color.reset}`)
      const ai = aiPayloads[i]

      const licao = await tx.licao.create({
        data: {
          titulo: `Lance ${ordemLicao}: ${stepSan}`,
          descricao: ai.explanation,
          aberturaId: abertura.id,
          moduloId: modulo.id,
          ordem: ordemLicao,
          dificuldade: 'Intermediario',
          status: 'Ativo',
          estimativaTempo: 5,
          pontuacao: 10,
        } as any,
      })

      console.log(`${color.cyan}Salvando exercícios...${color.reset}`)
      await tx.exercicio.create({
        data: {
          titulo: `Interativo: ${stepSan}`,
          descricao: 'Pratique o lance movendo a peça correta.',
          licaoId: licao.id,
          ordem: 1,
          tipo: 'Interativo',
          dificuldade: 'Intermediario',
          status: 'Ativo',
          conteudo: {
            posicaoInicial: promptFen,
            contexto: `Encontre o lance ${stepSan} nessa posição para seguir na linha principal.`,
            movimentoCorreto: stepSan,
            explicacao: ai.explanation,
            dicas: [
              'Pense no desenvolvimento rápido das peças.',
              'Controle o centro e prepare a segurança do rei.',
            ],
            feedbackCorreto: ai.feedback_success,
            feedbackIncorreto: ai.feedback_fail,
          },
          pontuacao: 10,
          tempoLimite: 60,
          tentativasMaximas: 3,
        },
      })

      await tx.exercicio.create({
        data: {
          titulo: `Quiz: ${stepSan}`,
          descricao: ai.quiz_question || `Qual é o melhor lance a partir desta posição?`,
          licaoId: licao.id,
          ordem: 2,
          tipo: 'Quiz',
          dificuldade: 'Intermediario',
          status: 'Ativo',
          conteudo: {
            posicaoInicial: promptFen,
            contexto: `Escolha o melhor lance que segue a linha principal da abertura.`,
            opcoes: quizOptionsPerStep[i],
            explicacao: ai.explanation,
            dicas: [],
            feedbackCorreto: ai.feedback_success,
            feedbackIncorreto: ai.feedback_fail,
          },
          pontuacao: 10,
          tempoLimite: 60,
          tentativasMaximas: 1,
        },
      })

      ordemLicao++
    }
  }, { timeout: 30000 })

  console.log(`${color.green}Curso gerado com sucesso.${color.reset}`)
}

async function main() {
  try {
    await generate()
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(async (err) => {
  console.error(`${color.red}${err?.message || err}${color.reset}`)
  await prisma.$disconnect()
  process.exit(1)
})