'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Clock, Trophy } from 'lucide-react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { type Exercicio } from '@/types/exercicios';

interface ExercicioInterativoPlayerProps {
  exercicio: Exercicio;
  onComplete: (score: number, timeSpent: number) => void;
}

export default function ExercicioInterativoPlayer({
  exercicio,
  onComplete
}: ExercicioInterativoPlayerProps) {
  const dicas = Array.isArray(exercicio.conteudo.dicas) ? exercicio.conteudo.dicas : [];
  const [game, setGame] = useState(new Chess(exercicio.conteudo.posicaoInicial));
  const [isCompleted, setIsCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercicio.tempoLimite || 0);
  const [startTime, setStartTime] = useState(Date.now());
  const [wrongMoveSan, setWrongMoveSan] = useState<string | null>(null);
  const [compareCorrectFen, setCompareCorrectFen] = useState<string | null>(null);
  const [compareWrongFen, setCompareWrongFen] = useState<string | null>(null);

  const maxAttempts = exercicio.tentativasMaximas || 3;
  const movimentoCorreto = exercicio.conteudo.movimentoCorreto;

  // CORREÇÃO: Reset completo quando o exercício muda
  useEffect(() => {
    console.log('🔄 Exercício mudou - resetando ExercicioInterativoPlayer:', exercicio.id);
    
    // Resetar o jogo chess.js com a nova posição inicial
    const newGame = new Chess(exercicio.conteudo.posicaoInicial);
    setGame(newGame);
    
    // Resetar todos os estados
    setIsCompleted(false);
    setAttempts(0);
    setFeedback(null);
    setFeedbackType(null);
    setShowHint(false);
    setTimeLeft(exercicio.tempoLimite || 0);
    setStartTime(Date.now());
    setWrongMoveSan(null);
    setCompareCorrectFen(null);
    setCompareWrongFen(null);
    
    console.log('✅ Estados resetados para novo exercício');
  }, [exercicio.id, exercicio.conteudo.posicaoInicial, exercicio.tempoLimite]);

  // Timer para exercícios com tempo limite
  useEffect(() => {
    if (exercicio.tempoLimite && timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tempo esgotado - lógica inline para evitar dependência circular
            setFeedback('Tempo esgotado! ' + (exercicio.conteudo.feedbackIncorreto || 'Tente novamente.'));
            setFeedbackType('error');
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isCompleted, exercicio.tempoLimite, exercicio.conteudo.feedbackIncorreto]);

  const resetBoard = useCallback(() => {
    setGame(new Chess(exercicio.conteudo.posicaoInicial));
    setFeedback(null);
    setFeedbackType(null);
    setShowHint(false);
    setIsCompleted(false);
  }, [exercicio.conteudo.posicaoInicial]);

  // Debug effect
  useEffect(() => {
    console.log('Estados atuais:', { isCompleted, feedbackType, feedback });
  }, [isCompleted, feedbackType, feedback]);

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    if (isCompleted) return false;

    const newGame = new Chess(game.fen());
    
    try {
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Sempre promover para rainha por simplicidade
      });

      if (!move) return false;

      const moveNotation = move.san;
      setAttempts(prev => prev + 1);

      // Verificar se o movimento está correto
      if (moveNotation === movimentoCorreto || move.lan === movimentoCorreto) {
        // Movimento correto!
        console.log('Movimento correto detectado!');
        setGame(newGame);
        setFeedback(exercicio.conteudo.feedbackCorreto || 'Perfeito! Movimento correto.');
        setFeedbackType('success');
        setIsCompleted(true);
        console.log('Estados definidos: isCompleted=true, feedbackType=success');
        
        // Calcular pontuação e chamar onComplete após tempo reduzido
        const scoreMultiplier = Math.max(0.3, 1 - (attempts * 0.2));
        const finalScore = Math.floor(exercicio.pontuacao * scoreMultiplier);
        
        setTimeout(() => {
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          onComplete(finalScore, timeSpent);
        }, 800);
      } else {
        // Movimento incorreto
        if (attempts >= maxAttempts - 1) {
          setFeedback(exercicio.conteudo.feedbackIncorreto || 'Tentativas esgotadas!');
          setFeedbackType('error');
          setIsCompleted(true);
        } else {
          setFeedback(`Movimento incorreto. Você tem ${maxAttempts - attempts - 1} tentativas restantes.`);
          setFeedbackType('error');
        }
        setWrongMoveSan(moveNotation);
        try {
          const gWrong = new Chess(exercicio.conteudo.posicaoInicial);
          const gCorrect = new Chess(exercicio.conteudo.posicaoInicial);
          gWrong.move(moveNotation);
          gCorrect.move(movimentoCorreto || '');
          setCompareWrongFen(gWrong.fen());
          setCompareCorrectFen(gCorrect.fen());
        } catch {}
      }

      return true;
    } catch {
      return false;
    }
  }, [game, isCompleted, attempts, movimentoCorreto, maxAttempts, exercicio, onComplete, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-500';
    if (timeLeft <= 30) return 'text-yellow-500';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Layout responsivo: duas colunas no desktop com tabuleiro maior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Coluna do Tabuleiro - 2/3 do espaço */}
        <div className="lg:col-span-2 flex flex-col items-center space-y-4">
          {/* Tabuleiro maior */}
          <div className="w-full max-w-2xl flex justify-center">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={600}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>

          {/* Controles */}
          {!isCompleted && (
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={resetBoard}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <RotateCcw size={16} />
                  <span>Resetar</span>
                </button>
                
                {dicas.length > 0 && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
                  >
                    <Lightbulb size={16} />
                    <span>{showHint ? 'Ocultar' : 'Dica'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coluna das Informações e Feedback - 1/3 do espaço */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          {/* Título e Contexto do Exercício */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {exercicio.titulo}
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              {exercicio.descricao}
            </p>
            
            {/* Status e Timer */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Tentativas: {attempts}/{maxAttempts}
                </span>
              </div>
              {exercicio.tempoLimite && (
                <div className={`flex items-center gap-1 ${getTimerColor()}`}>
                  <Clock size={16} />
                  <span className="font-mono text-sm font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Objetivo:</h3>
              <p className="text-gray-700 text-sm">
                {exercicio.conteudo.contexto}
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div className="min-h-[200px]">
            {feedback ? (
              <div className={`rounded-lg p-4 border ${
                feedbackType === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {feedbackType === 'success' ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <XCircle size={20} className="text-red-600" />
                  )}
                  <span className="font-semibold">
                    {feedbackType === 'success' ? 'Correto!' : 'Incorreto'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-3">{feedback}</p>
                
                {feedbackType === 'success' && exercicio.conteudo.explicacao && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <h4 className="font-semibold mb-1 text-sm">Explicação:</h4>
                    <p className="text-sm">{exercicio.conteudo.explicacao}</p>
                  </div>
                )}

                {feedbackType === 'success' && isCompleted && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-600">
                      ✅ Exercício concluído! Use os controles de navegação para continuar.
                    </p>
                  </div>
                )}

                {feedbackType === 'error' && isCompleted && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    {exercicio.conteudo.explicacao && (
                      <div className="mb-3">
                        <h4 className="font-semibold mb-1 text-sm">Solução:</h4>
                        <p className="text-sm mb-2">
                          O movimento correto era: <strong>{movimentoCorreto}</strong>
                        </p>
                        <p className="text-sm">{exercicio.conteudo.explicacao}</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                        onComplete(0, timeSpent);
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      Continuar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center min-h-[200px] flex items-center justify-center">
                <div>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-blue-700 font-medium mb-1 text-sm">
                    Encontre o melhor movimento!
                  </p>
                  <p className="text-blue-600 text-xs">
                    Arraste uma peça para fazer seu lance
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dicas */}
          {!isCompleted && showHint && dicas.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2 text-sm">
                <Lightbulb size={16} />
                Dica:
              </h4>
              <p className="text-yellow-700 text-sm">
                {dicas[Math.min(attempts, dicas.length - 1)]}
              </p>
            </div>
          )}
          {feedbackType === 'error' && wrongMoveSan && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Explicar meu lance</h4>
              <p className="text-xs text-gray-600 mb-3">Comparação entre seu lance (<strong>{wrongMoveSan}</strong>) e o lance correto (<strong>{movimentoCorreto}</strong>).</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold text-red-600 mb-1">Seu lance</div>
                  <div className="flex justify-center">
                    <Chessboard position={compareWrongFen || exercicio.conteudo.posicaoInicial} boardWidth={260} arePiecesDraggable={false} />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-green-600 mb-1">Lance correto</div>
                  <div className="flex justify-center">
                    <Chessboard position={compareCorrectFen || exercicio.conteudo.posicaoInicial} boardWidth={260} arePiecesDraggable={false} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
