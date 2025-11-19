'use client';

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { useAberturas } from '@/hooks/useAberturas'
import { useLicoes } from '@/hooks/useLicoes'
import { useExercicios } from '@/hooks/useExercicios'

export default function EditorRapido() {
  const { aberturas } = useAberturas()
  const { createLicao } = useLicoes()
  const { createExercicio } = useExercicios()

  const [aberturaId, setAberturaId] = useState<string>('')
  const [game, setGame] = useState(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
  const [seq, setSeq] = useState<string[]>([])
  const [titulo, setTitulo] = useState('Nova Lição')

  useEffect(() => {
    setGame(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
    setSeq([])
  }, [aberturaId])

  const onDrop = (from: string, to: string) => {
    const g = new Chess(game.fen())
    const m = g.move({ from, to, promotion: 'q' })
    if (!m) return false
    setGame(g)
    setSeq(prev => [...prev, m.san])
    return true
  }

  const salvar = async () => {
    if (!aberturaId || seq.length === 0) return
    const licao = await createLicao({
      titulo,
      descricao: 'Criada pelo editor rápido',
      aberturaId,
      ordem: 1,
      dificuldade: 'Iniciante',
      status: 'Ativo',
      exercicios: [],
      estimativaTempo: 10,
      pontuacao: 100,
      prerequisitos: []
    })
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const sequenciaMovimentos = seq.map((san, i) => {
      const g = new Chess(startFen)
      for (let k = 0; k <= i; k++) { try { g.move(seq[k]) } catch {} }
      return { id: `m${i+1}`, movimento: san, posicaoFEN: g.fen(), explicacao: '' }
    })
    await createExercicio({
      titulo: 'Sequência criada',
      descricao: 'Passivo gerado automaticamente',
      licaoId: licao.id,
      ordem: 1,
      tipo: 'Passivo',
      dificuldade: 'Iniciante',
      status: 'Ativo',
      conteudo: {
        posicaoInicial: startFen,
        contexto: 'Sequência gravada no tabuleiro',
        sequenciaMovimentos,
        explicacao: '',
        dicas: [],
        feedbackCorreto: 'Sequência completa',
        feedbackIncorreto: ''
      },
      pontuacao: 100,
      tentativasMaximas: 1
    })
    setSeq([])
  }

  const reset = () => {
    setGame(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
    setSeq([])
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-title text-2xl font-bold text-gray-900 mb-4">Editor rápido</h1>
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <select value={aberturaId} onChange={e => setAberturaId(e.target.value)} className="px-3 py-2 border rounded-lg">
                <option value="">Selecione a abertura</option>
                {aberturas.map(a => (<option key={a.id} value={a.id}>{a.nome}</option>))}
              </select>
              <input value={titulo} onChange={e => setTitulo(e.target.value)} className="px-3 py-2 border rounded-lg flex-1" placeholder="Título da lição" />
              <button onClick={reset} className="px-3 py-2 bg-gray-100 rounded-lg">Reset</button>
              <button onClick={salvar} className="px-3 py-2 bg-blue-600 text-white rounded-lg">Salvar</button>
            </div>
            <div className="flex justify-center">
              <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={600} />
            </div>
          </div>
          <div>
            <div className="bg-gray-50 border rounded-xl p-4">
              <div className="font-mono text-xs text-blue-700">{seq.join(' ') || 'Sem movimentos'}</div>
              <p className="text-xs text-gray-600 mt-2">Grave lances no tabuleiro para criar uma sequência passiva, depois salve para publicar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

