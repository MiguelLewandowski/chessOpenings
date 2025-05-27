'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Users, 
  Play, 
  Zap, 
  Shield, 
  Trophy,
  ChevronRight,
  Check,
  Star
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

      {/* Hero Section com Demo */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Conteúdo à esquerda */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Domine
                  <span className="block text-blue-600">Aberturas</span>
                  de Xadrez
                </h1>
                <p className="font-body text-xl text-gray-600 max-w-lg">
                  Aprenda aberturas de forma <strong>inteligente e personalizada</strong> 
                  com nossa plataforma interativa inspirada nos melhores métodos de ensino.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 font-interface font-semibold bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25">
                  <Play size={20} />
                  Começar Agora
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                <div>
                  <div className="font-title text-2xl font-bold text-gray-900">50+</div>
                  <div className="font-body text-sm text-gray-600">Aberturas</div>
                </div>
                <div>
                  <div className="font-title text-2xl font-bold text-gray-900">1000+</div>
                  <div className="font-body text-sm text-gray-600">Exercícios</div>
                </div>
                <div>
                  <div className="font-title text-2xl font-bold text-gray-900">95%</div>
                  <div className="font-body text-sm text-gray-600">Satisfação</div>
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

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-title text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o ChessOpenings?
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma combina tecnologia avançada com metodologia comprovada 
              para acelerar seu aprendizado de aberturas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-white" size={24} />
              </div>
              <h3 className="font-title text-xl font-bold text-gray-900 mb-3">
                Personalização Inteligente
              </h3>
              <p className="font-body text-gray-600">
                Sistema adaptativo que analisa seu estilo de jogo e recomenda 
                aberturas ideais para seu perfil.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-white" size={24} />
              </div>
              <h3 className="font-title text-xl font-bold text-gray-900 mb-3">
                Aprendizado Prático
              </h3>
              <p className="font-body text-gray-600">
                Exercícios interativos com tabuleiro real e feedback 
                instantâneo para fixar conceitos.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="font-title text-xl font-bold text-gray-900 mb-3">
                Progressão Estruturada
              </h3>
              <p className="font-body text-gray-600">
                Trilhas de aprendizado organizadas do básico ao avançado, 
                garantindo base sólida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Aberturas Destacada */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="font-title text-4xl font-bold text-gray-900 mb-4">
              Descubra Nossa Galeria de Aberturas
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore mais de 50 aberturas clássicas com preview visual, 
              estatísticas detalhadas e lições interativas.
            </p>
            
            {/* Preview cards mini */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-red-600" size={24} />
                </div>
                <h3 className="font-title text-lg font-bold text-gray-900 mb-2">
                  Aberturas Táticas
                </h3>
                <p className="font-body text-gray-600 text-sm">
                  Ataques dinâmicos e jogadas agressivas
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="text-blue-600" size={24} />
                </div>
                <h3 className="font-title text-lg font-bold text-gray-900 mb-2">
                  Aberturas Posicionais
                </h3>
                <p className="font-body text-gray-600 text-sm">
                  Estratégia sólida e controle do tabuleiro
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-purple-600" size={24} />
                </div>
                <h3 className="font-title text-lg font-bold text-gray-900 mb-2">
                  Aberturas Universais
                </h3>
                <p className="font-body text-gray-600 text-sm">
                  Flexíveis para todos os estilos
                </p>
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

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-title text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Processo simples e eficiente para transformar seu jogo em 4 etapas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                1. Análise de Perfil
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Quiz inteligente identifica seu estilo e nível atual de jogo.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                2. Recomendações
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Receba aberturas personalizadas baseadas na sua análise.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-white" size={28} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                3. Prática Guiada
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Lições interativas com explicações detalhadas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-white" size={28} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                4. Maestria
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Domine as aberturas através da prática consistente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-title text-4xl font-bold text-gray-900 mb-4">
              Métodos de Aprendizado
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Diferentes abordagens pedagógicas para maximizar sua compreensão.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Play className="text-blue-600" size={24} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                Lições Interativas
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Pratique movimentos ativamente no tabuleiro com feedback imediato.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-green-600" size={24} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                Demonstrações Visuais
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Observe sequências completas com explicações detalhadas.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h3 className="font-title text-lg font-bold text-gray-900 mb-3">
                Análise de Erros
              </h3>
              <p className="font-body text-gray-600 text-sm">
                Identifique armadilhas comuns e aprenda a evitá-las.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-title text-4xl sm:text-5xl font-bold text-white mb-6">
            Eleve seu Xadrez ao Próximo Nível
          </h2>
          <p className="font-body text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de jogadores que transformaram seu jogo 
            com nossa metodologia comprovada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="flex items-center gap-2 font-interface font-semibold bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg w-full sm:w-auto">
              <Play size={20} />
              Começar Gratuitamente
            </button>
            <Link
              href="/aberturas"
              className="inline-flex items-center justify-center font-interface font-semibold border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors w-full sm:w-auto"
            >
              Explorar Aberturas
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-blue-100">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-current text-yellow-400" />
              ))}
            </div>
            <span className="font-body text-sm">
              4.8/5 - Mais de 10.000 estudantes satisfeitos
            </span>
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
                Plataforma líder em ensino personalizado de aberturas de xadrez, 
                combinando tecnologia e pedagogia.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Check size={16} className="text-green-400" />
                  <span className="font-body text-sm">100% Gratuito para começar</span>
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
                    Quiz de Perfil
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
                    Análise de Progresso
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-interface text-lg font-semibold text-white mb-4">
                Suporte
              </h4>
              <ul className="space-y-2">
                {['Central de Ajuda', 'Documentação', 'Contato', 'Comunidade'].map((item) => (
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
              © 2024 ChessOpenings. Desenvolvido para elevar seu xadrez ao próximo nível.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
