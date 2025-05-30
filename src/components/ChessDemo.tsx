'use client';

import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Play, Pause, RotateCcw } from 'lucide-react';

// Sequência da abertura Italiana - movida para fora do componente
const openingMoves = [
  'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'O-O', 'Nf6'
];

const moveDescriptions = [
  "1. e4 - Controle central com peão do rei",
  "1...e5 - Resposta simétrica do preto", 
  "2. Nf3 - Desenvolvimento do cavalo atacando e5",
  "2...Nc6 - Desenvolvimento e defesa do peão e5",
  "3. Bc4 - Bispo italiano, mirando f7",
  "3...Bc5 - Desenvolvimento simétrico do bispo",
  "4. O-O - Roque para segurança do rei",
  "4...Nf6 - Desenvolvimento e contra-ataque"
];

export default function ChessDemo() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [isPlaying, setIsPlaying] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && moveIndex < openingMoves.length) {
      interval = setInterval(() => {
        const newGame = new Chess(game.fen());
        const move = openingMoves[moveIndex];
        
        try {
          newGame.move(move);
          setGame(newGame);
          setPosition(newGame.fen());
          setMoveIndex(prev => prev + 1);
        } catch (error) {
          console.error('Movimento inválido:', error);
          setIsPlaying(false);
        }
      }, 1500);
    } else if (moveIndex >= openingMoves.length) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, moveIndex, game]);

  const resetDemo = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setMoveIndex(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (moveIndex >= openingMoves.length) {
      resetDemo();
      return;
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header da Demo */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <h3 className="font-title text-xl font-bold text-gray-900 mb-2">
            Demonstração: Abertura Italiana
          </h3>
          <p className="font-body text-gray-600 text-sm">
            {moveIndex < moveDescriptions.length 
              ? moveDescriptions[moveIndex] 
              : "Abertura completa! Uma das mais clássicas do xadrez."}
          </p>
        </div>

        {/* Tabuleiro */}
        <div className="p-6">
          <div className="aspect-square w-full max-w-md mx-auto mb-6">
            <Chessboard
              position={position}
              arePiecesDraggable={false}
              boardWidth={400}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          {/* Controles */}
          <div className="flex justify-center gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause size={18} />
                  Pausar
                </>
              ) : (
                <>
                  <Play size={18} />
                  {moveIndex >= openingMoves.length ? 'Reiniciar' : 'Reproduzir'}
                </>
              )}
            </button>
            
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-interface font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm font-body text-gray-500 mb-2">
              <span>Progresso da abertura</span>
              <span>{moveIndex}/{openingMoves.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(moveIndex / openingMoves.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 