'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Play, 
  Zap, 
  Shield, 
  Trophy,
  ChevronRight,
  Check,
  Star,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  BarChart3
} from 'lucide-react';
import Navbar from '@/components/Navbar';

// Importação dinâmica para evitar problemas de SSR com o tabuleiro
const ChessDemo = dynamic(() => import('../components/ChessDemo'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-2xl mx-auto h-96 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Carregando demonstração...</div>
    </div>
  )
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Otimizado para Conversão */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Conteúdo à esquerda - Proposta de Valor Forte */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Aprenda Aberturas
                  <span className="block text-blue-600">com um Método</span>
                  <span className="block text-gray-800">Gamificado</span>
                </h1>
                <p className="font-body text-xl text-gray-600 max-w-lg">
                  <strong>Descubra seu estilo de jogo</strong>, pratique contra qualquer linha e 
                  <strong> suba de nível</strong> com lições interativas. O complemento perfeito 
                  para quem já viu vídeos mas quer <strong>praticar de verdade</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 font-interface font-semibold bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25 text-lg">
                  <Sparkles size={20} />
                  Fazer Quiz de Estilo
                </button>
                <Link
                  href="/aberturas"
                  className="flex items-center justify-center gap-2 font-interface font-semibold text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <BookOpen size={18} />
                  Explorar Aberturas
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Stats Melhoradas */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                <div className="text-center">
                  <div className="font-title text-2xl font-bold text-blue-600">50+</div>
                  <div className="font-body text-sm text-gray-600">Aberturas Clássicas</div>
                </div>
                <div className="text-center">
                  <div className="font-title text-2xl font-bold text-green-600">95%</div>
                  <div className="font-body text-sm text-gray-600">Satisfação</div>
                </div>
                <div className="text-center">
                  <div className="font-title text-2xl font-bold text-purple-600">3 min</div>
                  <div className="font-body text-sm text-gray-600">Média por Lição</div>
                </div>
              </div>
            </div>

            {/* Demo à direita */}
            <div className="lg:pl-8">
              <ChessDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - 3 Passos Focados */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-title text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Transforme seu jogo em apenas 3 passos simples e eficientes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="text-white" size={32} />
              </div>
              <div className="w-8 h-1 bg-blue-600 rounded-full mx-auto mb-4"></div>
              <h3 className="font-title text-xl font-bold text-gray-900 mb-3">
                1. Faça o Quiz e Descubra seu Estilo
              </h3>
              <p className="font-body text-gray-600">
                Quiz inteligente identifica se você é mais tático, posicional ou 
                universal para recomendar as aberturas ideais.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="text-white" size={32} />
              </div>
              <div className="w-8 h-1 bg-green-600 rounded-full mx-auto mb-4"></div>
              <h3 className="font-title text-xl font-bold text-gray-900 mb-3">
                2. Estude com Lições Interativas
              </h3>
              <p className="font-body text-gray-600">
                Clique no tabuleiro, pratique sequências e receba feedback 
                instantâneo. Muito mais eficaz que apenas assistir vídeos.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="text-white" size={32} />
              </div>
              <div className="w-8 h-1 bg-purple-600 rounded-full mx-auto mb-4"></div>
              <h3 className="font-title text-xl font-bold text-gray-900 mb-3">
                3. Domine seu Repertório
              </h3>
              <p className="font-body text-gray-600">
                Ganhe pontos, desbloqueie conquistas e suba de nível. 
                Seu progresso é salvo automaticamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blocos de Persuasão Específicos */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Bloco 1: Prática Real */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <Play className="text-green-600" size={28} />
              </div>
              <h3 className="font-title text-3xl font-bold text-gray-900">
                Prática Real e Interatividade
              </h3>
              <p className="font-body text-lg text-gray-600 leading-relaxed">
                <strong>Complemento ideal para o que você já viu em vídeos</strong> — aqui você vai 
                praticar de verdade com lições interativas e feedback visual. Clique no tabuleiro, 
                experimente sequências e veja na prática como cada movimento afeta o jogo.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="font-body text-gray-700">Tabuleiro interativo com validação em tempo real</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="font-body text-gray-700">Feedback instantâneo para cada movimento</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="font-body text-gray-700">Explicações contextuais detalhadas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-4">
                <div className="h-4 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between text-sm font-body text-gray-600">
                  <span>Abertura Italiana</span>
                  <span>75% completa</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Trophy className="text-blue-600 mx-auto mb-2" size={24} />
                    <div className="font-title text-lg font-bold text-gray-900">1,247</div>
                    <div className="font-body text-xs text-gray-600">Pontos XP</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <Zap className="text-orange-600 mx-auto mb-2" size={24} />
                    <div className="font-title text-lg font-bold text-gray-900">7</div>
                    <div className="font-body text-xs text-gray-600">Dias seguidos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 2: Treino Direcionado */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Target className="text-blue-600" size={28} />
              </div>
              <h3 className="font-title text-3xl font-bold text-gray-900">
                Treino Direcionado e Eficiente
              </h3>
              <p className="font-body text-lg text-gray-600 leading-relaxed">
                <strong>Chega de esperar que o adversário jogue a linha certa</strong> — aqui você 
                treina contra todos os estilos, exatamente onde precisa melhorar. Nossa IA adapta 
                o conteúdo ao seu perfil e mostra as variações mais importantes para seu nível.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="text-blue-600" size={20} />
                  <span className="font-body text-gray-700">Quiz personalizado identifica seu estilo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-blue-600" size={20} />
                  <span className="font-body text-gray-700">Recomendações baseadas no seu perfil</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-blue-600" size={20} />
                  <span className="font-body text-gray-700">Foco nas variações mais relevantes</span>
                </li>
              </ul>
            </div>
            <div className="lg:order-1 bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="text-white" size={32} />
                  </div>
                  <h4 className="font-title text-lg font-bold text-gray-900 mb-2">Seu Perfil de Jogo</h4>
                  <p className="font-body text-sm text-gray-600">Baseado no quiz de personalidade</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-body text-sm text-gray-700">Estilo Tático</span>
                    <span className="font-title text-sm font-bold text-blue-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-body text-sm text-gray-700">Estilo Posicional</span>
                    <span className="font-title text-sm font-bold text-green-600">45%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-body text-sm text-gray-700">Estilo Universal</span>
                    <span className="font-title text-sm font-bold text-purple-600">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prévia da Gamificação */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="font-title text-4xl font-bold text-gray-900 mb-4">
              Sistema de Gamificação Motivador
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Ganhe pontos, desbloqueie conquistas e acompanhe seu progresso visual. 
              Aprender xadrez nunca foi tão envolvente!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                Conquistas Desbloqueáveis
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Medalhas especiais para marcos importantes: primeira lição, 7 dias seguidos, 
                maestria em abertura e muito mais.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                Progresso Visual
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Barras de progresso, estatísticas detalhadas e gráficos que mostram 
                sua evolução em tempo real.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                Sistema de Streaks
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Mantenha sua sequência de dias estudando e ganhe multiplicadores 
                de pontos especiais.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h4 className="font-title text-lg font-bold text-gray-900 mb-6">
              Desbloqueie sua Primeira Medalha!
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-xl opacity-50">
                <Trophy className="text-gray-400 mx-auto mb-2" size={24} />
                <span className="font-body text-xs text-gray-400">Primeira Lição</span>
              </div>
              <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-xl opacity-50">
                <Zap className="text-gray-400 mx-auto mb-2" size={24} />
                <span className="font-body text-xs text-gray-400">Streak 7 dias</span>
              </div>
              <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-xl opacity-50">
                <Target className="text-gray-400 mx-auto mb-2" size={24} />
                <span className="font-body text-xs text-gray-400">100% Abertura</span>
              </div>
              <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-xl opacity-50">
                <Star className="text-gray-400 mx-auto mb-2" size={24} />
                <span className="font-body text-xs text-gray-400">Nível Mestre</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Aberturas */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="font-title text-4xl font-bold text-gray-900 mb-4">
              Descubra Nossa Galeria de Aberturas
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore mais de 50 aberturas clássicas organizadas por estilo, 
              com preview visual e lições interativas.
            </p>
            
            {/* Preview cards mini */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="font-title text-lg font-bold text-gray-900 mb-2">
                  Aberturas Táticas
                </h3>
                <p className="font-body text-gray-600 text-sm mb-3">
                  Ataques dinâmicos e jogadas agressivas
                </p>
                <span className="font-body text-xs text-red-600 font-semibold">15 aberturas</span>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="font-title text-lg font-bold text-gray-900 mb-2">
                  Aberturas Posicionais
                </h3>
                <p className="font-body text-gray-600 text-sm mb-3">
                  Estratégia sólida e controle do tabuleiro
                </p>
                <span className="font-body text-xs text-blue-600 font-semibold">20 aberturas</span>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-white" size={24} />
                </div>
                <h3 className="font-title text-lg font-bold text-gray-900 mb-2">
                  Aberturas Universais
                </h3>
                <p className="font-body text-gray-600 text-sm mb-3">
                  Flexíveis para todos os estilos
                </p>
                <span className="font-body text-xs text-purple-600 font-semibold">18 aberturas</span>
              </div>
            </div>
            
            <Link
              href="/aberturas"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-interface font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              <BookOpen size={20} />
              Explorar Todas as Aberturas
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-title text-3xl font-bold text-gray-900 mb-12">
            Junte-se a Centenas de Jogadores em Evolução
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="font-title text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="font-body text-gray-600">Jogadores ativos</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="font-title text-3xl font-bold text-green-600 mb-2">10,000+</div>
                <div className="font-body text-gray-600">Lições completadas</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="font-title text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="font-body text-gray-600">Taxa de conclusão</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-current text-yellow-400" />
              ))}
            </div>
            <span className="font-body">
              4.8/5 - Avaliação média dos usuários
            </span>
          </div>
        </div>
      </section>

      {/* CTA Final Otimizado */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-title text-4xl sm:text-5xl font-bold text-white mb-6">
            Comece sua Jornada no Xadrez Hoje
          </h2>
          <p className="font-body text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Descubra seu estilo único, domine suas aberturas favoritas e 
            veja seu rating subir com nossa metodologia gamificada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="flex items-center gap-2 font-interface font-semibold bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg w-full sm:w-auto text-lg">
              <Sparkles size={20} />
              Fazer Quiz de Estilo Gratuito
            </button>
            <Link
              href="/aberturas"
              className="inline-flex items-center justify-center font-interface font-semibold border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors w-full sm:w-auto"
            >
              Explorar Sem Cadastro
            </Link>
          </div>

          {/* Garantias */}
          <div className="flex items-center justify-center gap-6 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              <span>100% Gratuito para começar</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-300" />
              <span>Apenas 3 min/dia</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-blue-300" />
              <span>Sem spam ou compromisso</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="font-title text-2xl font-bold text-white mb-4">
                Chess<span className="text-blue-400">Openings</span>
              </h3>
              <p className="font-body text-gray-400 mb-6 max-w-md">
                Plataforma gamificada para aprender aberturas de xadrez de forma 
                personalizada e interativa. Descubra seu estilo e domine seu repertório.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Check size={16} className="text-green-400" />
                  <span className="font-body text-sm">Método comprovado e eficaz</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-interface text-lg font-semibold text-white mb-4">
                Recursos
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="font-body text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Quiz de Estilo
                  </a>
                </li>
                <li>
                  <Link href="/aberturas" className="font-body text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Galeria de Aberturas
                  </Link>
                </li>
                <li>
                  <a href="#" className="font-body text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Lições Interativas
                  </a>
                </li>
                <li>
                  <a href="#" className="font-body text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Sistema de Progresso
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-interface text-lg font-semibold text-white mb-4">
                Suporte
              </h4>
              <ul className="space-y-2">
                {['Como Começar', 'FAQ', 'Contato', 'Comunidade'].map((item) => (
                  <li key={item}>
                    <a href="#" className="font-body text-gray-400 hover:text-blue-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="font-body text-gray-400 text-sm">
              © 2024 ChessOpenings. Desenvolvido para transformar sua forma de aprender xadrez.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
