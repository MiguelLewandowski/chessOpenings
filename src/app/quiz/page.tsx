'use client';

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Brain, Zap, Shield, Stars, Crown, Compass, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'

type Answer = 'Tática' | 'Posicional' | 'Universal'

const QUESTIONS: { id: string; text: string; options: { label: string; value: Answer }[] }[] = [
  { id: 'q1', text: 'Você prefere atacar mesmo sem total segurança?', options: [
    { label: 'Sim, confio nos cálculos', value: 'Tática' },
    { label: 'Depende da posição', value: 'Universal' },
    { label: 'Prefiro consolidar primeiro', value: 'Posicional' }
  ]},
  { id: 'q2', text: 'Como você define seu estilo em aberturas?', options: [
    { label: 'Linhas agudas e gambitos', value: 'Tática' },
    { label: 'Estruturas sólidas e planos claros', value: 'Posicional' },
    { label: 'Flexível: escolho conforme o adversário', value: 'Universal' }
  ]},
  { id: 'q3', text: 'Ao calcular, você tende a...', options: [
    { label: 'Buscar combinações que forcem vantagem', value: 'Tática' },
    { label: 'Comparar planos e melhorar peças', value: 'Posicional' },
    { label: 'Misturar cálculo e plano', value: 'Universal' }
  ]},
  { id: 'q4', text: 'Você valoriza mais...', options: [
    { label: 'Iniciativa e ataque ao rei', value: 'Tática' },
    { label: 'Estrutura de peões e casas chave', value: 'Posicional' },
    { label: 'Equilíbrio entre iniciativa e estrutura', value: 'Universal' }
  ]},
  { id: 'q5', text: 'Contra jogadores desconhecidos, você escolhe...', options: [
    { label: 'Linhas surpresa e agudas', value: 'Tática' },
    { label: 'Linhas clássicas e seguras', value: 'Posicional' },
    { label: 'Adapto após o primeiro jogo', value: 'Universal' }
  ]},
  { id: 'q6', text: 'Quanto ao risco calculado...', options: [
    { label: 'Aceito se houver compensação tática', value: 'Tática' },
    { label: 'Evito: prefiro vantagem estável', value: 'Posicional' },
    { label: 'Depende do contexto da partida', value: 'Universal' }
  ]},
  { id: 'q7', text: 'Tempo no relógio influencia seu estilo?', options: [
    { label: 'Acelero e busco complicar', value: 'Tática' },
    { label: 'Simplifico e jogo por técnica', value: 'Posicional' },
    { label: 'Alterno conforme necessário', value: 'Universal' }
  ]},
]

const ARCHETYPES: Record<Answer, { name: string; icon: React.ReactNode; color: string; gradient: string; traits: string[]; models: string[]; blurb: string }> = {
  'Tática': {
    name: 'Arquetipo Tático',
    icon: <Zap className="text-white" size={40} />,
    color: 'text-red-600',
    gradient: 'from-red-500 to-orange-500',
    traits: ['Iniciativa', 'Cálculo agudo', 'Complicações conscientes'],
    models: ['M. Tal', 'G. Kasparov', 'H. Nakamura'],
    blurb: 'Você prospera em ataque e iniciativa. Linhas agudas e gambitos combinam com sua energia.'
  },
  'Posicional': {
    name: 'Arquetipo Posicional',
    icon: <Shield className="text-white" size={40} />,
    color: 'text-blue-600',
    gradient: 'from-blue-600 to-indigo-600',
    traits: ['Estruturas sólidas', 'Planos claros', 'Melhoria lenta das peças'],
    models: ['A. Karpov', 'M. Carlsen', 'U. Petrosian'],
    blurb: 'Você valoriza estruturas, casas e técnica. Prefere aberturas clássicas com planos estáveis.'
  },
  'Universal': {
    name: 'Arquetipo Universal',
    icon: <Brain className="text-white" size={40} />,
    color: 'text-purple-600',
    gradient: 'from-purple-600 to-fuchsia-600',
    traits: ['Flexibilidade', 'Adaptação', 'Equilíbrio ataque/posição'],
    models: ['V. Anand', 'B. Fischer', 'L. Aronian'],
    blurb: 'Você se adapta ao adversário e contexto. Mistura iniciativa com boa estrutura.'
  }
}

export default function StyleQuizPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Answer | null>(null)
  const [recommended, setRecommended] = useState<any[]>([])

  const score = useMemo(() => {
    const tally: Record<Answer, number> = { 'Tática': 0, 'Posicional': 0, 'Universal': 0 }
    Object.values(answers).forEach(a => { tally[a]++ })
    return tally
  }, [answers])

  const dominant: Answer | null = useMemo(() => {
    const entries = Object.entries(score)
    entries.sort((a, b) => b[1] - a[1])
    return entries.length ? (entries[0][1] === 0 ? null : entries[0][0] as Answer) : null
  }, [score])

  useEffect(() => {
    if (!result) return
    ;(async () => {
      const res = await fetch('/api/aberturas')
      const items = await res.json()
      const filtered = items.filter((a: any) => a.categoria === result)
      setRecommended(filtered.slice(0, 6))
    })()
  }, [result])

  const handleSelect = (qid: string, value: Answer) => {
    setAnswers(prev => ({ ...prev, [qid]: value }))
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id])

  const submit = async () => {
    if (!allAnswered) return
    setSubmitting(true)
    setTimeout(() => {
      setResult(dominant)
      setSubmitting(false)
    }, 600)
  }

  const ArchetypeCard = ({ type }: { type: Answer }) => {
    const a = ARCHETYPES[type]
    return (
      <div className={`relative overflow-hidden rounded-2xl shadow-xl border border-white/10 bg-gradient-to-br ${a.gradient}`}>
        <div className="p-6 sm:p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              {a.icon}
            </div>
            <h2 className="text-2xl font-bold">{a.name}</h2>
          </div>
          <p className="text-white/90 mb-4">{a.blurb}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Stars size={16} />Traços</h3>
              <ul className="text-sm space-y-1">
                {a.traits.map(t => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle size={14} />{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Crown size={16} />Jogadores modelo</h3>
              <ul className="text-sm space-y-1">
                {a.models.map(m => (
                  <li key={m} className="flex items-center gap-2"><ArrowRight size={14} />{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!result ? (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h1 className="font-title text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Quiz de Estilo</h1>
              <p className="text-gray-600 mb-6">Responda e descubra seu arquétipo: Tático, Posicional ou Universal.</p>
              <div className="space-y-6">
                {QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Compass className="text-blue-600" size={18} />
                      <h2 className="font-semibold text-gray-900">{idx + 1}. {q.text}</h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {q.options.map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => handleSelect(q.id, opt.value)}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${answers[q.id] === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={submit}
                  disabled={!allAnswered || submitting}
                  className={`px-6 py-3 rounded-xl font-interface font-semibold text-white ${allAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} transition-colors`}
                >
                  {submitting ? 'Calculando...' : 'Ver Meu Estilo'}
                </button>
                <span className="text-sm text-gray-500">{Object.values(answers).length}/{QUESTIONS.length} respondidas</span>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <ArchetypeCard type={'Tática'} />
                <ArchetypeCard type={'Posicional'} />
                <ArchetypeCard type={'Universal'} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="font-title text-3xl sm:text-4xl font-bold text-gray-900">Seu Estilo: {result}</h1>
            <ArchetypeCard type={result} />
            <div>
              <h2 className="font-title text-2xl font-bold text-gray-900 mb-3">Aberturas Recomendadas</h2>
              {recommended.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommended.map((a: any) => (
                    <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="font-title font-bold text-gray-900 mb-1">{a.nome}</div>
                      <div className="text-sm text-gray-600 mb-2">{a.descricao}</div>
                      <Link href={`/aberturas/${a.id}/trilha`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Estudar <ArrowRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-700 text-sm">Sem aberturas cadastradas para este estilo ainda. Explore todas as aberturas e volte em breve — estamos ampliando o catálogo.</p>
                  <Link href="/aberturas" className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">Explorar Aberturas <ArrowRight size={16} /></Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

