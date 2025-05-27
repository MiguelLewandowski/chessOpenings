'use client';

import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface ChessPreviewProps {
  moves: string[];
  size?: number;
}

export default function ChessPreview({ 
  moves, 
  size = 280
}: ChessPreviewProps) {
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());

  useEffect(() => {
    // Reset game
    game.reset();
    
    // Aplicar os movimentos da abertura
    try {
      moves.forEach(move => {
        game.move(move);
      });
      setPosition(game.fen());
    } catch (error) {
      console.warn('Erro ao aplicar movimentos:', error);
      // Se houver erro, mostrar posição inicial
      game.reset();
      setPosition(game.fen());
    }
  }, [moves, game]);

  return (
    <div 
      className="mx-auto rounded-lg overflow-hidden shadow-sm"
      style={{ width: size, height: size }}
    >
      <Chessboard
        position={position}
        boardWidth={size}
        arePiecesDraggable={false}
        boardOrientation="white"
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
        customDarkSquareStyle={{
          backgroundColor: '#B7C0D8'
        }}
        customLightSquareStyle={{
          backgroundColor: '#E8EDF4'
        }}
      />
    </div>
  );
} 