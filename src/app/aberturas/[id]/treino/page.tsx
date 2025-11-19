'use client';

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { RotateCcw, ChevronLeft, ChevronRight, Target, Zap } from 'lucide-react'
import { useAberturas } from '@/hooks/useAberturas'
import { useLicoes } from '@/hooks/useLicoes'
import { useExercicios } from '@/hooks/useExercicios'
import { type MovimentoPassivo } from '@/types/exercicios'
type Square = Parameters<Chess['get']>[0]
import { SimpleEngine } from '@/utils/engine/simple'

export default function TreinoContraLinha() {
  const params = useParams()
  const aberturaId = params.id as string
  const { aberturas } = useAberturas()
  const abertura = useMemo(() => aberturas.find(a => a.id === aberturaId), [aberturas, aberturaId])
  const { licoes } = useLicoes()
  const { exercicios } = useExercicios()
  const bookOptions = useMemo(() => {
    const opts: { id: string; name: string; seq: string[] }[] = []
    if (abertura) {
      opts.push({ id: 'abertura', name: `Linha padrão (${abertura.nome})`, seq: abertura.movimentos || [] })
    }
    const lcs = licoes.filter(l => l.aberturaId === aberturaId)
    for (const l of lcs) {
      const passivos = exercicios.filter(e => e.licaoId === l.id && e.tipo === 'Passivo')
      for (const ex of passivos) {
        const seq = (ex.conteudo?.sequenciaMovimentos || []).map((m: MovimentoPassivo) => m.movimento)
        if (seq.length) {
          opts.push({ id: `licao-${l.id}`, name: l.titulo, seq })
          break
        }
      }
    }
    return opts
  }, [abertura, licoes, exercicios, aberturaId])
  const [selectedBookId, setSelectedBookId] = useState<string>('abertura')

  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const [game, setGame] = useState(new Chess(startFen))
  const [bookIndex, setBookIndex] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [userColor, setUserColor] = useState<'w' | 'b'>('w')
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null)

  useEffect(() => {
    setGame(new Chess(startFen))
    setBookIndex(0)
    setFeedback(null)
  }, [aberturaId])

  useEffect(() => {
    // Se o usuário escolhe jogar de pretas, engine faz o primeiro lance
    const engineColor = userColor === 'w' ? 'b' : 'w'
    if (new Chess(startFen).turn() === engineColor) {
      respondEngine(new Chess(startFen))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userColor])

  const sequence = useMemo(() => {
    const found = bookOptions.find(o => o.id === selectedBookId)
    const seq = found ? found.seq : (abertura?.movimentos || [])
    return (seq || []).map(s => (typeof s === 'string' ? s.trim() : s))
  }, [bookOptions, selectedBookId, abertura])

  const reset = () => {
    setGame(new Chess(startFen))
    setBookIndex(0)
    setFeedback(null)
  }

  const respondEngine = useCallback((current: Chess) => {
    const engineColor = userColor === 'w' ? 'b' : 'w'
    if (current.turn() !== engineColor) return
    const eng = new SimpleEngine(5)
    // Se houver lance de livro do lado da engine, aplique primeiro
    const nextBook = sequence[bookIndex]
    const bookTurnColor = bookIndex % 2 === 0 ? 'w' : 'b'
    if (nextBook && bookTurnColor === engineColor) {
      try {
        const g2 = new Chess(current.fen())
        g2.move(typeof nextBook === 'string' ? nextBook.trim() : nextBook)
        setGame(g2)
        setBookIndex(bookIndex + 1)
        const chk2 = new Chess(g2.fen())
        if (chk2.isCheckmate()) setFeedback('Xeque-mate!')
        return
      } catch {}
    }
    const bestUci = eng.bestmove(current.fen(), 200)
    if (!bestUci) return
    const from = bestUci.slice(0,2)
    const to = bestUci.slice(2,4)
    const promo: 'q' | 'r' | 'b' | 'n' | undefined = bestUci.length > 4 ? (bestUci.slice(4,5) as 'q' | 'r' | 'b' | 'n') : undefined
    try {
      const g2 = new Chess(current.fen())
      g2.move({ from, to, promotion: promo })
      setGame(g2)
      const chk3 = new Chess(g2.fen())
      if (chk3.isCheckmate()) setFeedback('Xeque-mate!')
      // não incrementa bookIndex se não for livro
    } catch {
      setFeedback('Engine não pôde jogar nesta posição.')
    }
  }, [userColor, sequence, bookIndex])

  const onDrop = (from: string, to: string) => {
    if (!abertura) return false
    // Apenas quando é a vez do usuário
    if (game.turn() !== userColor) return false
    const g = new Chess(game.fen())
    // Detecta promoção apenas para peão alcançando última fileira
    const piece = g.get ? g.get(from as Square) : null
    const isPawn = piece && piece.type === 'p'
    const lastRank = userColor === 'w' ? '8' : '1'
    // If pawn reaches last rank, prompt for promotion
    if (isPawn && to.endsWith(lastRank)) {
      setPendingPromotion({ from, to })
      return false
    }
    const move = g.move({ from, to })
    if (!move) return false
    const expected = sequence[bookIndex]
    const expectedTurnColor = bookIndex % 2 === 0 ? 'w' : 'b'
    if (expected && expectedTurnColor === userColor) {
      const expSan = typeof expected === 'string' ? expected.trim() : expected
      if (move.san !== expSan && move.lan !== expSan) {
        setFeedback(`Desviou da linha. Lance de livro seria: ${expected}`)
      } else {
        setFeedback(null)
      }
    } else {
      setFeedback(null)
    }
    setGame(g)
    if (expected && expectedTurnColor === userColor) {
      const expSan2 = typeof expected === 'string' ? expected.trim() : expected
      if (move.san === expSan2 || move.lan === expSan2) {
        setBookIndex(bookIndex + 1)
      }
    }
    const chk = new Chess(g.fen())
    if (chk.isCheckmate()) setFeedback('Xeque-mate!')
    // Engine responde
    setTimeout(() => { respondEngine(new Chess(g.fen())) }, 10)
    return true
  }

  const canPrev = bookIndex > 0
  const canNext = bookIndex < sequence.length

  const goPrev = () => {
    const g = new Chess(startFen)
    for (let i = 0; i < Math.max(0, bookIndex - 1); i++) {
      try { g.move(sequence[i]) } catch {}
    }
    setGame(g)
    setBookIndex(Math.max(0, bookIndex - 1))
    setFeedback(null)
  }

  const goNext = () => {
    const g = new Chess(game.fen())
    const san = sequence[bookIndex]
    if (!san) return
    try { g.move(san) } catch { return }
    setGame(g)
    setBookIndex(bookIndex + 1)
    setFeedback(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href={`/aberturas/${aberturaId}/trilha`} className="text-blue-600 hover:text-blue-800 text-sm">← Voltar</Link>
            <h1 className="font-title text-2xl font-bold text-gray-900">Treino contra a linha</h1>
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Target size={16} /> {abertura?.nome}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col items-center gap-4">
            <div className="w-full max-w-2xl flex justify-center">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={600}
                boardOrientation={userColor === 'w' ? 'white' : 'black'}
                customBoardStyle={{ borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
              />
            </div>
            {pendingPromotion && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-gray-700">Promoção:</span>
                {(['q','r','b','n'] as const).map(p => (
                  <button key={p} onClick={() => {
                    const g = new Chess(game.fen())
                    try {
                      g.move({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: p })
                      setGame(g)
                      setPendingPromotion(null)
                      // após promoção, engine responde
                      setTimeout(() => { respondEngine(new Chess(g.fen())) }, 10)
                    } catch {
                      setPendingPromotion(null)
                    }
                  }} className="px-2 py-1 border rounded-md hover:bg-gray-100">{p.toUpperCase()}</button>
                ))}
              </div>
            )}
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-600">Passo {bookIndex}/{sequence.length}</span>
                <span className="text-gray-500">{feedback ? feedback : 'Siga a linha e o adversário responde automaticamente'}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button onClick={reset} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"><RotateCcw size={18} /></button>
                <button onClick={goPrev} disabled={!canPrev} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-40"><ChevronLeft size={20} /></button>
                <button onClick={goNext} disabled={!canNext} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-40"><ChevronRight size={20} /></button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-600">Jogar como</label>
                    <div className="flex items-center gap-3 text-xs text-gray-700">
                      <label className="flex items-center gap-1"><input type="radio" checked={userColor==='w'} onChange={()=>setUserColor('w')} /> Branco</label>
                      <label className="flex items-center gap-1"><input type="radio" checked={userColor==='b'} onChange={()=>setUserColor('b')} /> Preto</label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-600">Linha alvo</label>
                    <select value={selectedBookId} onChange={e => { setSelectedBookId(e.target.value); setBookIndex(0); }} className="w-full px-3 py-2 border rounded-lg text-xs">
                      {bookOptions.map(o => (<option key={o.id} value={o.id}>{o.name}</option>))}
                    </select>
                  </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2 text-red-600"><Zap size={18} /><span className="font-semibold">Dica</span></div>
              <p className="text-sm text-gray-700">Jogue o lance correto da linha. Se acertar, o adversário responde automaticamente com o próximo lance teórico.</p>
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Sequência alvo</h3>
                <div className="font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 text-blue-700">{sequence.join(' ')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
