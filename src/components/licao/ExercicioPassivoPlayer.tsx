'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Chessboard } from 'react-chessboard';
import { type Exercicio } from '@/types/exercicios';

interface ExercicioPassivoPlayerProps {
  exercicio: Exercicio;
  onComplete: (score: number, timeSpent: number) => void;
}

export default function ExercicioPassivoPlayer({
  exercicio,
  onComplete
}: ExercicioPassivoPlayerProps) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [boardPosition, setBoardPosition] = useState(exercicio.conteudo.posicaoInicial);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const movimentos = exercicio.conteudo.sequenciaMovimentos || [];

  // CORREÇÃO: Reset completo quando o exercício muda
  useEffect(() => {
    console.log('🔄 Exercício mudou - resetando ExercicioPassivoPlayer:', exercicio.id);
    
    // Resetar todos os estados para novo exercício
    setCurrentMoveIndex(-1);
    setBoardPosition(exercicio.conteudo.posicaoInicial);
    setIsPlaying(false);
    setIsCompleted(false);
    setStartTime(Date.now());
    
    console.log('✅ Estados resetados para novo exercício passivo');
  }, [exercicio.id, exercicio.conteudo.posicaoInicial]);

  const resetToInitial = useCallback(() => {
    setCurrentMoveIndex(-1);
    setBoardPosition(exercicio.conteudo.posicaoInicial);
    setIsPlaying(false);
    setIsCompleted(false);
  }, [exercicio.conteudo.posicaoInicial]);

  const goToNextMove = useCallback(() => {
    if (currentMoveIndex < movimentos.length - 1) {
      const nextIndex = currentMoveIndex + 1;
      setCurrentMoveIndex(nextIndex);
      setBoardPosition(movimentos[nextIndex].posicaoFEN);
      
      // Se chegou no último movimento, marcar como concluído
      if (nextIndex === movimentos.length - 1) {
        setIsPlaying(false);
        setIsCompleted(true);
      }
    }
  }, [currentMoveIndex, movimentos]);

  const goToPrevMove = useCallback(() => {
    if (currentMoveIndex > 0) {
      const prevIndex = currentMoveIndex - 1;
      setCurrentMoveIndex(prevIndex);
      setBoardPosition(movimentos[prevIndex].posicaoFEN);
    } else if (currentMoveIndex === 0) {
      setCurrentMoveIndex(-1);
      setBoardPosition(exercicio.conteudo.posicaoInicial);
    }
  }, [currentMoveIndex, movimentos, exercicio.conteudo.posicaoInicial]);

  const togglePlay = () => {
    if (isCompleted) return;
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete(exercicio.pontuacao, timeSpent);
  };

  // Auto-play quando estiver reproduzindo
  useEffect(() => {
    if (isPlaying && !isCompleted) {
      const timer = setTimeout(() => {
        goToNextMove();
      }, 1200); // REDUZIDO: de 2000ms para 1200ms para reprodução mais fluida

      return () => clearTimeout(timer);
    }
  }, [isPlaying, isCompleted, currentMoveIndex, movimentos, goToNextMove]);

  // Suporte ao teclado - funciona sempre, mesmo após completar
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          if (currentMoveIndex < movimentos.length - 1) {
            goToNextMove();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevMove();
          break;
        case ' ': // Espaço para play/pause
          event.preventDefault();
          if (!isCompleted) {
            togglePlay();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNextMove, goToPrevMove, togglePlay, isCompleted, currentMoveIndex, movimentos.length]);

  const getCurrentMove = () => {
    return currentMoveIndex >= 0 ? movimentos[currentMoveIndex] : null;
  };

  const getProgress = () => {
    return Math.max(0, currentMoveIndex + 1);
  };

  const canGoNext = () => currentMoveIndex < movimentos.length - 1;
  const canGoPrev = () => currentMoveIndex >= 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Layout responsivo: duas colunas no desktop com tabuleiro maior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Coluna do Tabuleiro - 2/3 do espaço */}
        <div className="lg:col-span-2 flex flex-col items-center space-y-4">
          <div className="w-full max-w-2xl flex justify-center">
            <Chessboard
              position={boardPosition}
              boardWidth={600}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>

          {/* Progresso */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Movimento {getProgress()}/{movimentos.length}
              </span>
              <span className="text-sm text-gray-500">
                {isCompleted ? 'Completo!' : isPlaying ? 'Reproduzindo...' : 'Pausado'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getProgress() / movimentos.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Controles Integrados */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-center gap-3">
              {/* Reset */}
              <button
                onClick={resetToInitial}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-sm"
                disabled={currentMoveIndex === -1}
                title="Resetar"
              >
                <RotateCcw size={20} className="text-gray-600" />
              </button>
              
              {/* Botão Anterior */}
              <button
                onClick={goToPrevMove}
                disabled={!canGoPrev()}
                className="p-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 rounded-full transition-colors shadow-sm"
                title="Movimento Anterior (←)"
              >
                <ChevronLeft size={24} />
              </button>
              
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 shadow-lg"
                disabled={isCompleted}
                title={isPlaying ? "Pausar (Espaço)" : "Auto Play (Espaço)"}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              
              {/* Próximo */}
              <button
                onClick={goToNextMove}
                disabled={!canGoNext()}
                className="p-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 rounded-full transition-colors shadow-sm"
                title="Próximo Movimento (→)"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            {/* Dicas de teclado discretas */}
            <div className="text-center mt-3">
              <p className="text-xs text-gray-400">
                Use ← → para navegar {!isCompleted && "• Espaço para play/pause"}
              </p>
            </div>
          </div>
        </div>

        {/* Coluna das Explicações - 1/3 do espaço */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          {/* Título e Contexto do Exercício */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {exercicio.titulo}
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              {exercicio.descricao}
            </p>
            
            <div className="border-t border-gray-200 pt-3">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Sequência:</h3>
              <p className="text-gray-700 text-sm">
                Acompanhe os movimentos da abertura passo a passo
              </p>
            </div>
          </div>

          {/* Explicação do movimento atual */}
          <div className="min-h-[200px]">
            {getCurrentMove() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-blue-800">
                    {currentMoveIndex + 1}. {getCurrentMove()?.movimento}
                  </span>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {getCurrentMove()?.explicacao}
                </p>
              </div>
            )}
            
            {currentMoveIndex === -1 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center min-h-[200px] flex items-center justify-center">
                <div>
                  <div className="text-3xl mb-3">▶️</div>
                  <p className="text-gray-600 mb-2">
                    Use <strong>Play</strong> para reprodução automática
                  </p>
                  <p className="text-gray-500 text-sm">
                    ou navegue com as setas ← →
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botão de completar - quando necessário */}
          {isCompleted && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  Demonstração Concluída!
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  {exercicio.conteudo.feedbackCorreto || 'Você assistiu toda a sequência de movimentos.'}
                </p>
                
                {exercicio.conteudo.explicacao && (
                  <div className="bg-white border border-green-200 rounded-lg p-3 text-left mb-3">
                    <h4 className="font-semibold text-green-800 mb-1 text-sm">Explicação Final:</h4>
                    <p className="text-green-700 text-sm">
                      {exercicio.conteudo.explicacao}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                  <p className="text-blue-700 text-xs">
                    💡 <strong>Dica:</strong> Use as setas ← → para revisar os movimentos
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleComplete}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                ✅ Marcar como Concluído
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 