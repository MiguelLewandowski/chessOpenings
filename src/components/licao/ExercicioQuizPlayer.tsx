'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { type Exercicio, type OpcaoQuiz } from '@/types/exercicios';

interface ExercicioQuizPlayerProps {
  exercicio: Exercicio;
  onComplete: (score: number, timeSpent: number) => void;
}

export default function ExercicioQuizPlayer({
  exercicio,
  onComplete
}: ExercicioQuizPlayerProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercicio.tempoLimite || 0);
  const [startTime, setStartTime] = useState(Date.now());
  const [previewPosition, setPreviewPosition] = useState(exercicio.conteudo.posicaoInicial);

  const opcoes = exercicio.conteudo.opcoes || [];
  const opcaoCorreta = opcoes.find(op => op.correta);

  // CORREÇÃO: Reset completo quando o exercício muda
  useEffect(() => {
    console.log('🔄 Exercício mudou - resetando ExercicioQuizPlayer:', exercicio.id);
    
    // Resetar todos os estados para novo exercício
    setSelectedOption(null);
    setIsCompleted(false);
    setShowResults(false);
    setTimeLeft(exercicio.tempoLimite || 0);
    setStartTime(Date.now());
    setPreviewPosition(exercicio.conteudo.posicaoInicial);
    
    console.log('✅ Estados resetados para novo exercício quiz');
  }, [exercicio.id, exercicio.conteudo.posicaoInicial, exercicio.tempoLimite]);

  // Timer para exercícios com tempo limite
  useEffect(() => {
    if (exercicio.tempoLimite && timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tempo esgotado - lógica inline para evitar dependência circular
            setIsCompleted(true);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isCompleted, exercicio.tempoLimite]);

  const handleOptionSelect = (opcaoId: string) => {
    if (isCompleted || showResults) return;
    
    setSelectedOption(opcaoId);
    
    // Preview do movimento no tabuleiro
    const opcao = opcoes.find(op => op.id === opcaoId);
    if (opcao) {
      try {
        const game = new Chess(exercicio.conteudo.posicaoInicial);
        const move = game.move(opcao.movimento);
        if (move) {
          setPreviewPosition(game.fen());
        }
      } catch {
        // Se o movimento for inválido, manter posição original
        setPreviewPosition(exercicio.conteudo.posicaoInicial);
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setIsCompleted(true);
    setShowResults(true);
    
    const isCorrect = selectedOption === opcaoCorreta?.id;
    const finalScore = isCorrect ? exercicio.pontuacao : 0;
    
    setTimeout(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete(finalScore, timeSpent);
    }, 800); // REDUZIDO: de 3000ms para 800ms para transição mais rápida
  };

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

  const getOptionStyle = (opcao: OpcaoQuiz) => {
    if (!showResults) {
      return selectedOption === opcao.id
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
    }

    // Mostrar resultados
    if (opcao.correta) {
      return 'border-green-500 bg-green-50';
    }
    
    if (selectedOption === opcao.id && !opcao.correta) {
      return 'border-red-500 bg-red-50';
    }
    
    return 'border-gray-200 bg-gray-50';
  };

  const getOptionIcon = (opcao: OpcaoQuiz) => {
    if (!showResults) return null;
    
    if (opcao.correta) {
      return <CheckCircle className="text-green-600" size={20} />;
    }
    
    if (selectedOption === opcao.id && !opcao.correta) {
      return <XCircle className="text-red-600" size={20} />;
    }
    
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Layout em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tabuleiro - 2/3 do espaço */}
        <div className="lg:col-span-2 flex flex-col items-center space-y-4">
          <div className="w-full max-w-2xl flex justify-center">
            <Chessboard
              position={previewPosition}
              boardWidth={600}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>
          
          {/* Instrução visual */}
          {!selectedOption && (
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                💡 Selecione uma opção para ver o movimento no tabuleiro
              </p>
            </div>
          )}
        </div>

        {/* Opções e Informações - 1/3 do espaço */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          {/* Título e Contexto do Exercício */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {exercicio.titulo}
              </h2>
              {exercicio.tempoLimite && (
                <div className={`flex items-center gap-1 ${getTimerColor()}`}>
                  <Clock size={16} />
                  <span className="font-mono text-sm font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-3">
              {exercicio.descricao}
            </p>
            
            <div className="border-t border-gray-200 pt-3">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Situação:</h3>
              <p className="text-gray-700 text-sm">
                {exercicio.conteudo.contexto}
              </p>
            </div>
          </div>

          {/* Pergunta */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              Qual é o melhor movimento?
            </h4>
          </div>
          
          {/* Opções */}
          <div className="space-y-2">
            {opcoes.map((opcao, index) => (
              <button
                key={opcao.id}
                onClick={() => handleOptionSelect(opcao.id)}
                disabled={isCompleted || showResults}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${getOptionStyle(opcao)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1 text-sm">
                        {opcao.movimento}
                      </div>
                      <div className="text-xs text-gray-600">
                        {opcao.texto}
                      </div>
                    </div>
                  </div>
                  <div className="ml-2">
                    {getOptionIcon(opcao)}
                  </div>
                </div>
                
                {/* Explicação (apenas quando mostrando resultados) */}
                {showResults && opcao.explicacao && (selectedOption === opcao.id || opcao.correta) && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-700">
                      {opcao.explicacao}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Botão de confirmar */}
          {!showResults && !isCompleted && (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              Confirmar Resposta
            </button>
          )}

          {/* Resultado final */}
          {showResults && (
            <div className={`rounded-lg p-4 border text-center ${
              selectedOption === opcaoCorreta?.id
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-3">
                {selectedOption === opcaoCorreta?.id ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <XCircle className="text-red-600" size={24} />
                )}
                <h3 className={`text-lg font-bold ${
                  selectedOption === opcaoCorreta?.id ? 'text-green-800' : 'text-red-800'
                }`}>
                  {selectedOption === opcaoCorreta?.id ? 'Correto!' : 'Incorreto'}
                </h3>
              </div>
              
              <p className={`text-sm mb-3 ${
                selectedOption === opcaoCorreta?.id ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedOption === opcaoCorreta?.id 
                  ? exercicio.conteudo.feedbackCorreto 
                  : exercicio.conteudo.feedbackIncorreto}
              </p>

              {exercicio.conteudo.explicacao && (
                <div className="bg-white rounded-lg p-3 text-left">
                  <h4 className="font-semibold mb-2 text-sm">Explicação:</h4>
                  <p className="text-sm text-gray-700">
                    {exercicio.conteudo.explicacao}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 