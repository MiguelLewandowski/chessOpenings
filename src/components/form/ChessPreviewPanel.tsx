'use client';

import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Chessboard } from 'react-chessboard';

interface ChessPreviewPanelProps {
  fen: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onFenChange: (fen: string) => void;
  error?: string;
  loading?: boolean;
}

export default function ChessPreviewPanel({
  fen,
  isVisible,
  onToggleVisibility,
  onFenChange,
  error,
  loading = false
}: ChessPreviewPanelProps) {

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Posição Inicial (FEN) *
        </label>
        <button
          type="button"
          onClick={onToggleVisibility}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
          disabled={loading}
        >
          {isVisible ? (
            <>
              <EyeOff size={16} />
              Ocultar Preview
            </>
          ) : (
            <>
              <Eye size={16} />
              Mostrar Preview
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={fen}
            onChange={(e) => onFenChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            disabled={loading}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Posição inicial do exercício em notação FEN
          </p>
        </div>

        {isVisible && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Preview da Posição
            </h4>
            <div className="max-w-sm mx-auto">
              {!error && fen ? (
                <Chessboard
                  position={fen}
                  boardWidth={300}
                  arePiecesDraggable={false}
                  customBoardStyle={{
                    borderRadius: '4px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
                  }}
                />
              ) : (
                <div className="h-[300px] bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500 text-sm">
                      {error ? 'FEN inválido' : 'Insira um FEN válido'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 