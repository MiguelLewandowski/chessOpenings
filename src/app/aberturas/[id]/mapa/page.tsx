'use client';

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useLicoes } from '@/hooks/useLicoes'
import { useUserProgress } from '@/hooks/useUserProgress'

export default function MapaAbertura() {
  const params = useParams()
  const aberturaId = params.id as string
  const { licoes } = useLicoes()
  const { getLicaoProgress } = useUserProgress()

  const nodes = useMemo(() => {
    return licoes
      .filter(l => l.aberturaId === aberturaId && l.status === 'Ativo')
      .sort((a, b) => a.ordem - b.ordem)
  }, [licoes, aberturaId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/aberturas/${aberturaId}/trilha`} className="text-blue-600 hover:text-blue-800 text-sm">← Voltar</Link>
          <h1 className="font-title text-2xl font-bold text-gray-900">Mapa da Abertura</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((l, i) => {
            const prog = getLicaoProgress(l.id)
            const done = prog?.isCompleted
            return (
              <div key={l.id} className={`relative bg-white rounded-2xl border p-4 ${done ? 'border-green-200' : 'border-gray-200'}`}>
                <div className="absolute -left-3 top-6 w-1 h-12 bg-gray-200 hidden sm:block" style={{ opacity: i % 3 === 0 ? 0 : 1 }} />
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{l.ordem}</div>
                  <div>
                    <div className="font-title font-bold text-gray-900">{l.titulo}</div>
                    <div className="text-xs text-gray-600">{l.estimativaTempo}min • {l.pontuacao}pts</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/aberturas/${aberturaId}/licao/${l.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Estudar</Link>
                  <Link href={`/aberturas/${aberturaId}/treino`} className="text-purple-600 hover:text-purple-800 text-sm font-medium">Treinar</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

