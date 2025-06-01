'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Lock, 
  Trophy, 
  ChevronRight,
  RotateCcw,
  Flame,
  Zap
} from 'lucide-react';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes, type Licao } from '@/hooks/useLicoes';
import { useExercicios } from '@/hooks/useExercicios';
import Navbar from '@/components/Navbar';
import { useUserProgress } from '@/hooks/useUserProgress';

// Componente para casa da trilha (lição)
const TrilhaLicao = ({ 
  licao, 
  index,
  isUnlocked, 
  isCompleted, 
  isCurrent,
  exerciciosCount,
  completedExercicios,
  aberturaId,
  isStreak = false,
  isChapterStart = false
}: {
  licao: Licao;
  index: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  exerciciosCount: number;
  completedExercicios: number;
  aberturaId: string;
  isStreak?: boolean;
  isChapterStart?: boolean;
}) => {
  
  const getCardStyle = () => {
    if (isCompleted) {
      return "block w-full p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 cursor-pointer";
    }
    
    if (isCurrent) {
      return "block w-full p-6 bg-blue-50 border-2 border-blue-400 rounded-xl hover:bg-blue-100 cursor-pointer ring-2 ring-blue-200";
    }
    
    if (isUnlocked) {
      return "block w-full p-6 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer";
    }
    
    return "block w-full p-6 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-60";
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Completa
        </div>
      );
    }
    
    if (isCurrent) {
      return (
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Atual
        </div>
      );
    }
    
    if (isUnlocked) {
      return (
        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-300">
          Disponível
        </div>
      );
    }
    
    return (
      <div className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
        Bloqueada
      </div>
    );
  };

  const getProgressText = () => {
    if (completedExercicios > 0 && !isCompleted) {
      return (
        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
          {completedExercicios}/{exerciciosCount} exercícios
        </span>
      );
    }
    return null;
  };

  const getActionText = () => {
    if (!isUnlocked) return "Complete a lição anterior";
    if (isCompleted) return "Clique para revisar";
    if (isCurrent) return "Clique para continuar";
    return "Clique para começar";
  };

  return (
    <div className="w-full">
      {/* Marco de Capítulo */}
      {isChapterStart && index > 0 && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Capítulo {Math.floor(index / 3) + 1}</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      )}

      <Link 
        href={isUnlocked ? `/aberturas/${aberturaId}/licao/${licao.id}` : '#'}
        className={getCardStyle()}
        title={isUnlocked ? `${licao.titulo} - ${getActionText()}` : 'Lição bloqueada'}
      >
        <div className="flex items-center gap-4">
          {/* Círculo com número */}
          <div className="flex-shrink-0 relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
              isCompleted 
                ? 'bg-green-500 text-white' 
                : isCurrent 
                ? 'bg-blue-500 text-white' 
                : isUnlocked
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gray-300 text-gray-500'
            }`}>
              {isCompleted ? (
                <CheckCircle size={24} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Indicador de Streak */}
            {isStreak && isCompleted && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                <Zap size={12} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Conteúdo principal */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-xl font-bold ${
                isCompleted 
                  ? 'text-green-800' 
                  : isCurrent 
                  ? 'text-blue-800' 
                  : isUnlocked
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}>
                {licao.titulo}
              </h3>
              
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                {getProgressText()}
              </div>
            </div>
            
            <p className="text-gray-600 mb-3">
              {licao.descricao}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{exerciciosCount} exercícios</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{licao.estimativaTempo}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy size={16} />
                <span>{licao.pontuacao} pts</span>
              </div>
            </div>
            
            <div className={`text-sm font-medium ${
              isCompleted 
                ? 'text-green-600'
                : isCurrent 
                ? 'text-blue-600'
                : isUnlocked
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}>
              {getActionText()}
            </div>
          </div>

          {/* Seta de navegação */}
          <div className="flex-shrink-0">
            {isUnlocked ? (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-100 text-green-600'
                  : isCurrent 
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <ChevronRight size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-300">
                <Lock size={20} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function TrilhaLicoes() {
  const params = useParams();
  const aberturaId = params.id as string;
  
  const { aberturas } = useAberturas();
  const { licoes } = useLicoes();
  const { exercicios } = useExercicios();
  
  const {
    initializeAbertura,
    getCurrentLicaoIndex,
    isLicaoUnlocked,
    getLicaoProgress,
    aberturaProgress,
    resetProgress,
    resetAberturaProgress,
    getTotalStats
  } = useUserProgress();

  const abertura = aberturas.find(a => a.id === aberturaId);
  
  // Corrigir ordenação das lições
  const licoesAbertura = licoes
    .filter(l => l.aberturaId === aberturaId && l.status === 'Ativo')
    .sort((a, b) => a.ordem - b.ordem);

  // Inicializar progresso da abertura
  useEffect(() => {
    if (aberturaId) {
      initializeAbertura(aberturaId);
    }
  }, [aberturaId, initializeAbertura]);

  // Obter progresso real da abertura
  const aberturaProgressData = aberturaProgress[aberturaId];
  const currentLicaoIndex = getCurrentLicaoIndex(aberturaId);

  // Detectar streaks (lições consecutivas completadas)
  const getStreakInfo = () => {
    const completedLicoes = aberturaProgressData?.licoesCompletas || [];
    let streakCount = 0;
    
    for (let i = 0; i < licoesAbertura.length; i++) {
      if (completedLicoes.includes(licoesAbertura[i].id)) {
        streakCount++;
      } else {
        break;
      }
    }
    
    return { count: streakCount, hasStreak: streakCount >= 2 };
  };

  const streakInfo = getStreakInfo();

  const getTotalPontos = () => {
    return aberturaProgressData?.totalScore || 0;
  };

  const getTotalTempo = () => {
    return aberturaProgressData?.totalTime || 0;
  };

  const getCompletedLicoesCount = () => {
    return aberturaProgressData?.licoesCompletas.length || 0;
  };

  if (!abertura) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Abertura não encontrada</h2>
          <Link href="/aberturas" className="text-blue-600 hover:text-blue-800">
            Voltar para Aberturas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Estilos CSS customizados para animações */}
      <style jsx global>{`
        @keyframes celebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .celebrate { animation: celebrate 0.6s ease-in-out; }
        .sparkle { animation: sparkle 2s infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navbar />
        
        {/* Header da trilha - Corrigido para não cortar o scroll */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link 
                    href="/aberturas"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Voltar para Aberturas
                  </Link>
                </div>
                <h1 className="font-title text-xl md:text-2xl font-bold text-gray-900">
                  {abertura.nome}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-body text-gray-600">
                    {abertura.categoria} • {abertura.dificuldade}
                  </p>
                  {streakInfo.hasStreak && (
                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Flame size={12} />
                      <span>{streakInfo.count} em sequência</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats da abertura - melhorada para mobile */}
              <div className="grid grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-blue-600 mb-1">
                    <Trophy size={16} className="md:w-5 md:h-5" />
                    <span className="font-title text-lg md:text-xl font-bold">{getTotalPontos()}</span>
                  </div>
                  <p className="font-body text-xs text-gray-600">Pontos</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-gray-600 mb-1">
                    <Clock size={16} className="md:w-5 md:h-5" />
                    <span className="font-title text-lg md:text-xl font-bold">{Math.floor(getTotalTempo() / 60)}min</span>
                  </div>
                  <p className="font-body text-xs text-gray-600">Estudado</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-green-600 mb-1">
                    <CheckCircle size={16} className="md:w-5 md:h-5" />
                    <span className="font-title text-lg md:text-xl font-bold">
                      {getCompletedLicoesCount()}/{licoesAbertura.length}
                    </span>
                  </div>
                  <p className="font-body text-xs text-gray-600">Completas</p>
                </div>
              </div>
            </div>
            
            {/* Barra de progresso da abertura */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso da Trilha</span>
                <span className="text-sm text-gray-600">
                  {Math.round((getCompletedLicoesCount() / licoesAbertura.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${(getCompletedLicoesCount() / licoesAbertura.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trilha de lições */}
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h2 className="font-title text-xl font-bold text-gray-900 mb-2">
              Trilha de Lições
            </h2>
            <p className="font-body text-gray-600">
              Complete as lições em sequência para dominar a {abertura.nome}
            </p>
            {streakInfo.hasStreak && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-full border border-orange-200">
                <Flame size={16} className="text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  Incrível! Você tem {streakInfo.count} lições em sequência!
                </span>
              </div>
            )}
          </div>

          {/* Lista de lições - Layout limpo */}
          <div className="flex flex-col gap-6">
            {licoesAbertura.map((licao, index) => {
              const licaoExercicios = exercicios.filter(e => e.licaoId === licao.id && e.status === 'Ativo');
              
              // Usar progresso real da lição
              const licaoProgressData = getLicaoProgress(licao.id);
              const completedExercicios = licaoProgressData?.exerciciosProgress.filter(e => e.completed).length || 0;
              const isCompleted = licaoProgressData?.isCompleted || false;
              
              // Determinar se é início de capítulo (a cada 4 lições)
              const isChapterStart = index % 4 === 0 && index > 0;
              
              // Verificar se faz parte do streak atual
              const isInStreak = index < streakInfo.count && isCompleted;
              
              return (
                <TrilhaLicao
                  key={licao.id}
                  licao={licao}
                  index={index}
                  isUnlocked={isLicaoUnlocked(aberturaId, index)}
                  isCompleted={isCompleted}
                  isCurrent={index === currentLicaoIndex}
                  exerciciosCount={licaoExercicios.length}
                  completedExercicios={completedExercicios}
                  aberturaId={aberturaId}
                  isStreak={isInStreak}
                  isChapterStart={isChapterStart}
                />
              );
            })}
          </div>

          {/* Finish line com celebração melhorada */}
          {getCompletedLicoesCount() === licoesAbertura.length && (
            <div className="mt-12 text-center p-6 md:p-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 rounded-xl celebrate">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sparkle">
                <Trophy size={40} className="text-white" />
              </div>
              <h3 className="font-title text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Parabéns! Trilha Completa!
              </h3>
              <p className="font-body text-gray-600 mb-4">
                Você dominou completamente a {abertura.nome}!
              </p>
              <div className="flex justify-center gap-4 text-sm flex-wrap">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {getTotalPontos()} pontos totais
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {Math.floor(getTotalTempo() / 60)} minutos estudados
                </span>
              </div>
            </div>
          )}

          {/* Controles de progresso */}
          <div className="mt-8 text-center bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Controles de progresso:</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button 
                onClick={() => resetAberturaProgress(aberturaId)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset Abertura
              </button>
              <button 
                onClick={resetProgress}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset Global
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>Stats globais: {getTotalStats().totalLicoesCompletas} lições completas</p>
              {streakInfo.hasStreak && (
                <p className="text-orange-600 font-medium flex items-center justify-center gap-1">
                  <Flame size={12} />
                  Maior sequência: {streakInfo.count} lições consecutivas!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 