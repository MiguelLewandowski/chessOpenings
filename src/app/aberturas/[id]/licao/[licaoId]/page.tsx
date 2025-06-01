'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy, Loader2 } from 'lucide-react';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes } from '@/hooks/useLicoes';
import { useExercicios } from '@/hooks/useExercicios';
import { useLicaoProgress } from '@/hooks/useLicaoProgress';
import { useUserProgress } from '@/hooks/useUserProgress';
import ExercicioPassivoPlayer from '@/components/licao/ExercicioPassivoPlayer';
import ExercicioInterativoPlayer from '@/components/licao/ExercicioInterativoPlayer';
import ExercicioQuizPlayer from '@/components/licao/ExercicioQuizPlayer';

export default function LicaoPage() {
  const params = useParams();
  const router = useRouter();
  const aberturaId = params.id as string;
  const licaoId = params.licaoId as string;

  const { aberturas, loading: aberturasLoading } = useAberturas();
  const { licoes, loading: licoesLoading } = useLicoes();
  const { exercicios, loading: exerciciosLoading } = useExercicios();

  const {
    initializeLicao,
    updateLicaoProgress,
    completeLicao
  } = useUserProgress();

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExercicioCompleted, setShowExercicioCompleted] = useState(false);
  
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    if (!aberturasLoading && !licoesLoading && !exerciciosLoading) {
      setHasAttemptedLoad(true);
    }
  }, [aberturasLoading, licoesLoading, exerciciosLoading]);

  const abertura = aberturas.find(a => a.id === aberturaId);
  const licao = licoes.find(l => l.id === licaoId);
  const exerciciosLicao = exercicios
    .filter(e => e.licaoId === licaoId && e.status === 'Ativo')
    .sort((a, b) => a.ordem - b.ordem);

  const licoesAbertura = licoes
    .filter(l => l.aberturaId === aberturaId && l.status === 'Ativo')
    .sort((a, b) => a.ordem - b.ordem);

  const licaoAtualIndex = licoesAbertura.findIndex(l => l.id === licaoId);
  const proximaLicao = licaoAtualIndex < licoesAbertura.length - 1 
    ? licoesAbertura[licaoAtualIndex + 1] 
    : null;

  useEffect(() => {
    if (licaoId && exerciciosLicao.length > 0) {
      initializeLicao(licaoId, exerciciosLicao);
    }
  }, [licaoId, exerciciosLicao, initializeLicao]);

  const progressHook = useLicaoProgress(exerciciosLicao);
  
  const {
    currentExercicioIndex,
    getCurrentExercicio,
    completeCurrentExercicio: completeLocalExercicio,
    nextExercicio,
    prevExercicio,
    goToExercicio,
    canGoNext,
    getProgressPercentage,
    isCompleted: isLocalCompleted,
    hasNext,
    hasPrev,
    totalScore: localTotalScore,
    totalTime: localTotalTime,
    exerciciosProgress: localExerciciosProgress
  } = progressHook;

  const currentExercicio = getCurrentExercicio();

  useEffect(() => {
    if (licaoId && localExerciciosProgress.length > 0) {
      updateLicaoProgress(licaoId, localExerciciosProgress, localTotalScore, localTotalTime);
    }
  }, [licaoId, localExerciciosProgress, localTotalScore, localTotalTime, updateLicaoProgress]);

  useEffect(() => {
    if (isLocalCompleted && licaoId && aberturaId) {
      completeLicao(licaoId, aberturaId, licaoAtualIndex);
      setShowCompletionModal(true);
    }
  }, [isLocalCompleted, licaoId, aberturaId, licaoAtualIndex, completeLicao]);

  const handleExercicioComplete = (score: number, timeSpent: number) => {
    completeLocalExercicio(score, timeSpent);
    
    setShowExercicioCompleted(true);
    setTimeout(() => setShowExercicioCompleted(false), 2000);
  };

  const handleBackToTrilha = () => {
    router.push(`/aberturas/${aberturaId}/trilha`);
  };

  const handleProximaLicao = () => {
    if (proximaLicao) {
      router.push(`/aberturas/${aberturaId}/licao/${proximaLicao.id}`);
    }
  };

  const isLoading = aberturasLoading || licoesLoading || exerciciosLoading || !hasAttemptedLoad;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Carregando lição...
          </h2>
          <p className="text-gray-600">
            Preparando os exercícios para você
          </p>
        </div>
      </div>
    );
  }

  if (!abertura || !licao || !currentExercicio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Lição não encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            A lição que você está procurando não existe ou foi removida.
          </p>
          <button 
            onClick={handleBackToTrilha}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Voltar à trilha
          </button>
        </div>
      </div>
    );
  }

  const renderExercicio = () => {
    switch (currentExercicio.tipo) {
      case 'Passivo':
        return (
          <ExercicioPassivoPlayer
            exercicio={currentExercicio}
            onComplete={handleExercicioComplete}
          />
        );
      case 'Interativo':
        return (
          <ExercicioInterativoPlayer
            exercicio={currentExercicio}
            onComplete={handleExercicioComplete}
          />
        );
      case 'Quiz':
        return (
          <ExercicioQuizPlayer
            exercicio={currentExercicio}
            onComplete={handleExercicioComplete}
          />
        );
      default:
        return <div>Tipo de exercício não suportado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToTrilha}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="text-sm">
                <h1 className="font-bold text-gray-900">
                  {licao.titulo}
                </h1>
                <p className="text-gray-600">
                  {abertura.nome} • Exercício {currentExercicioIndex + 1} de {exerciciosLicao.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right text-sm">
                <div className="font-bold text-gray-900">
                  {Math.round(getProgressPercentage())}%
                </div>
                <div className="text-gray-600">
                  Progresso
                </div>
              </div>
              
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentExercicio.titulo}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {currentExercicio.descricao}
          </p>
        </div>

        <div className="mb-8">
          {renderExercicio()}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-2xl mx-auto">
          <div className="text-center mb-3">
            <p className="text-sm text-gray-600 font-medium">
              Navegação da Lição
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={prevExercicio}
              disabled={!hasPrev}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
              <span>Anterior</span>
            </button>

            <div className="flex items-center gap-3">
              {exerciciosLicao.map((exercicio, index) => {
                const isCompleted = progressHook.exerciciosProgress[index]?.completed;
                const isCurrent = index === currentExercicioIndex;
                const isAccessible = index <= currentExercicioIndex || isCompleted;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => {
                        if (isAccessible) {
                          goToExercicio(index);
                        }
                      }}
                      disabled={!isAccessible}
                      className={`w-4 h-4 rounded-full transition-all duration-200 ${
                        isCurrent
                          ? 'bg-blue-500 ring-2 ring-blue-200'
                          : isCompleted
                          ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                          : isAccessible
                          ? 'bg-gray-400 hover:bg-gray-500 cursor-pointer'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      title={
                        isCurrent 
                          ? `Exercício atual: ${exercicio.titulo}`
                          : isCompleted
                          ? `Completado: ${exercicio.titulo} - Clique para revisar`
                          : isAccessible
                          ? `Disponível: ${exercicio.titulo}`
                          : `Bloqueado: Complete o exercício atual primeiro`
                      }
                    />
                    <span className={`text-xs ${
                      isCurrent ? 'text-blue-600 font-medium' 
                      : isCompleted ? 'text-green-600' 
                      : 'text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={nextExercicio}
              disabled={!canGoNext() || !hasNext}
              className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 rounded-lg ${
                canGoNext() && hasNext
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title={
                !canGoNext() 
                  ? 'Complete este exercício primeiro'
                  : !hasNext
                  ? 'Último exercício da lição'
                  : 'Avançar para o próximo exercício'
              }
            >
              <span>Próximo</span>
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              {getProgressPercentage() === 100 
                ? 'Todos os exercícios completados!'
                : `${Math.round(getProgressPercentage())}% concluído • ${progressHook.exerciciosProgress.filter(p => p.completed).length} de ${exerciciosLicao.length} exercícios`
              }
            </p>
          </div>
        </div>
      </div>

      {showExercicioCompleted && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40 animate-bounce">
          <p className="text-sm font-medium">
            ✅ Exercício concluído! Use a navegação para continuar.
          </p>
        </div>
      )}

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-green-600" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Parabéns!
            </h2>
            
            {proximaLicao ? (
              <>
                <p className="text-gray-600 mb-6">
                  Você completou a lição &quot;{licao.titulo}&quot; com sucesso! A próxima lição já foi desbloqueada.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-bold text-gray-900">{localTotalScore}</div>
                      <div className="text-gray-600">Pontos</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{Math.floor(localTotalTime / 60)}m {localTotalTime % 60}s</div>
                      <div className="text-gray-600">Tempo</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleProximaLicao}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Próxima Lição: {proximaLicao.titulo}
                  </button>
                  
                  <button
                    onClick={handleBackToTrilha}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Voltar para a Trilha
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Você finalizou todas as lições da abertura <strong>{abertura.nome}</strong>!
                </p>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="text-yellow-600" size={20} />
                    <span className="font-bold text-yellow-800">Abertura Dominada!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-bold text-gray-900">{localTotalScore}</div>
                      <div className="text-gray-600">Pontos Finais</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{Math.floor(localTotalTime / 60)}m {localTotalTime % 60}s</div>
                      <div className="text-gray-600">Tempo Total</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBackToTrilha}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Ver Trilha Completa
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 