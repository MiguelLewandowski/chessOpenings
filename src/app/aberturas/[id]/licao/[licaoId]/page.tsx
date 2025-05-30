'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes } from '@/hooks/useLicoes';
import { useExercicios } from '@/hooks/useExercicios';
import { useLicaoProgress } from '@/hooks/useLicaoProgress';
import ExercicioPassivoPlayer from '@/components/licao/ExercicioPassivoPlayer';
import ExercicioInterativoPlayer from '@/components/licao/ExercicioInterativoPlayer';
import ExercicioQuizPlayer from '@/components/licao/ExercicioQuizPlayer';

export default function LicaoPage() {
  const params = useParams();
  const router = useRouter();
  const aberturaId = params.id as string;
  const licaoId = params.licaoId as string;

  const { aberturas } = useAberturas();
  const { licoes } = useLicoes();
  const { exercicios } = useExercicios();

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Buscar dados
  const abertura = aberturas.find(a => a.id === aberturaId);
  const licao = licoes.find(l => l.id === licaoId);
  const exerciciosLicao = exercicios
    .filter(e => e.licaoId === licaoId && e.status === 'Ativo')
    .sort((a, b) => a.ordem - b.ordem);

  // Hook de progresso
  const progressHook = useLicaoProgress(exerciciosLicao);
  
  const {
    currentExercicioIndex,
    getCurrentExercicio,
    completeCurrentExercicio,
    nextExercicio,
    prevExercicio,
    canGoNext,
    getProgressPercentage,
    isCompleted,
    hasNext,
    hasPrev,
    totalScore,
    totalTime
  } = progressHook;

  const currentExercicio = getCurrentExercicio();

  // Verificar se a lição foi completada
  useEffect(() => {
    if (isCompleted) {
      setShowCompletionModal(true);
    }
  }, [isCompleted]);

  const handleExercicioComplete = (score: number, timeSpent: number) => {
    completeCurrentExercicio(score, timeSpent);
    
    if (hasNext) {
      setTimeout(() => {
        nextExercicio();
      }, 1000);
    }
  };

  const handleBackToTrilha = () => {
    router.push(`/aberturas/${aberturaId}/trilha`);
  };

  if (!abertura || !licao || !currentExercicio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Lição não encontrada
          </h2>
          <button 
            onClick={handleBackToTrilha}
            className="text-blue-600 hover:text-blue-800"
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
      {/* Header minimalista */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Navegação */}
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

            {/* Progresso */}
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

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Título do exercício */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentExercicio.titulo}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {currentExercicio.descricao}
          </p>
        </div>

        {/* Exercício */}
        <div className="mb-8">
          {renderExercicio()}
        </div>

        {/* Navegação entre exercícios */}
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={prevExercicio}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            {exerciciosLicao.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentExercicioIndex
                    ? 'bg-blue-500'
                    : index < currentExercicioIndex
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextExercicio}
            disabled={!canGoNext() || !hasNext}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Próximo</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Modal de conclusão */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-green-600" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Parabéns! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6">
              Você completou a lição &quot;{licao.titulo}&quot; com sucesso!
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold text-gray-900">{totalScore}</div>
                  <div className="text-gray-600">Pontos</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{Math.floor(totalTime / 60)}m {totalTime % 60}s</div>
                  <div className="text-gray-600">Tempo</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleBackToTrilha}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Voltar às Lições
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 