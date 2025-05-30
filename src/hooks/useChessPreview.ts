import { useState, useCallback } from 'react';

export interface ChessPreviewState {
  showPreview: boolean;
  isLoading: boolean;
}

export const useChessPreview = (initialVisible: boolean = true) => {
  const [previewState, setPreviewState] = useState<ChessPreviewState>({
    showPreview: initialVisible,
    isLoading: false
  });

  const togglePreview = useCallback(() => {
    setPreviewState(prev => ({
      ...prev,
      showPreview: !prev.showPreview
    }));
  }, []);

  const showPreview = useCallback(() => {
    setPreviewState(prev => ({
      ...prev,
      showPreview: true
    }));
  }, []);

  const hidePreview = useCallback(() => {
    setPreviewState(prev => ({
      ...prev,
      showPreview: false
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setPreviewState(prev => ({
      ...prev,
      isLoading: loading
    }));
  }, []);

  return {
    ...previewState,
    togglePreview,
    showPreview,
    hidePreview,
    setLoading
  };
}; 