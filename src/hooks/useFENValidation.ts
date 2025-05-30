import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

export interface FENValidationState {
  fen: string;
  isValid: boolean;
  error: string;
  boardPosition: string;
}

export const useFENValidation = (initialFen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') => {
  const [chess] = useState(new Chess());
  const [validationState, setValidationState] = useState<FENValidationState>({
    fen: initialFen,
    isValid: true,
    error: '',
    boardPosition: initialFen
  });

  const validateAndUpdateFEN = useCallback((fen: string): boolean => {
    // FEN vazio - reset para posição inicial
    if (!fen.trim()) {
      chess.reset();
      const resetFen = chess.fen();
      setValidationState({
        fen: resetFen,
        isValid: true,
        error: '',
        boardPosition: resetFen
      });
      return true;
    }

    try {
      // Tentar carregar o FEN no chess.js
      chess.load(fen);
      setValidationState({
        fen,
        isValid: true,
        error: '',
        boardPosition: fen
      });
      return true;
    } catch {
      setValidationState(prev => ({
        ...prev,
        fen,
        isValid: false,
        error: 'FEN inválido - verifique a notação'
      }));
      return false;
    }
  }, [chess]);

  const resetToInitial = useCallback(() => {
    chess.reset();
    const resetFen = chess.fen();
    setValidationState({
      fen: resetFen,
      isValid: true,
      error: '',
      boardPosition: resetFen
    });
  }, [chess]);

  const setFEN = useCallback((newFen: string) => {
    validateAndUpdateFEN(newFen);
  }, [validateAndUpdateFEN]);

  return {
    ...validationState,
    setFEN,
    validateAndUpdateFEN,
    resetToInitial
  };
}; 