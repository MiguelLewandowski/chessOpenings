import { useState, useCallback, useEffect, useMemo } from 'react';
import { type Exercicio } from '@/types/exercicios';

export interface ExercicioProgress {
  exercicioId: string;
  completed: boolean;
  score: number;
  attempts: number;
  timeSpent: number;
}

export interface LicaoProgressState {
  currentExercicioIndex: number;
  exerciciosProgress: ExercicioProgress[];
  isCompleted: boolean;
  totalScore: number;
  totalTime: number;
}

export const useLicaoProgress = (exercicios: Exercicio[]) => {
  const [progressState, setProgressState] = useState<LicaoProgressState>({
    currentExercicioIndex: 0,
    exerciciosProgress: [],
    isCompleted: false,
    totalScore: 0,
    totalTime: 0
  });

  // Usar useMemo para estabilizar a lista de IDs dos exercícios
  const exercicioIds = useMemo(() => 
    exercicios.map(e => e.id).join(','), 
    [exercicios]
  );

  // Inicializar progresso dos exercícios apenas quando a lista de exercícios mudar
  useEffect(() => {
    if (exercicios.length > 0) {
      const initialProgress = exercicios.map(exercicio => ({
        exercicioId: exercicio.id,
        completed: false,
        score: 0,
        attempts: 0,
        timeSpent: 0
      }));

      setProgressState(prev => ({
        ...prev,
        exerciciosProgress: initialProgress
      }));
    }
  }, [exercicios, exercicioIds]);

  const getCurrentExercicio = useCallback(() => {
    return exercicios[progressState.currentExercicioIndex] || null;
  }, [exercicios, progressState.currentExercicioIndex]);

  const completeCurrentExercicio = useCallback((score: number, timeSpent: number) => {
    setProgressState(prev => {
      const newProgress = [...prev.exerciciosProgress];
      const currentIndex = prev.currentExercicioIndex;
      
      if (newProgress[currentIndex]) {
        newProgress[currentIndex] = {
          ...newProgress[currentIndex],
          completed: true,
          score,
          timeSpent,
          attempts: newProgress[currentIndex].attempts + 1
        };
      }

      const newTotalScore = newProgress.reduce((sum, p) => sum + p.score, 0);
      const newTotalTime = newProgress.reduce((sum, p) => sum + p.timeSpent, 0);
      
      // 🎯 CORREÇÃO MELHORADA: Verificar se é realmente o último exercício
      const isLastExercicio = currentIndex === exercicios.length - 1;
      const exercicioJustCompleted = newProgress[currentIndex]?.completed;
      const isLicaoCompleted = isLastExercicio && exercicioJustCompleted;
      
      console.log('🎯 Debug conclusão lição - CORRIGIDO:', {
        currentIndex,
        exerciciosLength: exercicios.length,
        isLastExercicio,
        exercicioJustCompleted,
        isLicaoCompleted,
        previousIsCompleted: prev.isCompleted
      });
      
      return {
        ...prev,
        exerciciosProgress: newProgress,
        totalScore: newTotalScore,
        totalTime: newTotalTime,
        isCompleted: isLicaoCompleted || prev.isCompleted
      };
    });
  }, [exercicios.length]);

  // Memoizar o comprimento dos exercícios para evitar dependência instável
  const exerciciosLength = useMemo(() => exercicios.length, [exercicios.length]);

  const nextExercicio = useCallback(() => {
    setProgressState(prev => {
      const nextIndex = prev.currentExercicioIndex + 1;
      
      // 🎯 CORREÇÃO: Não modificar isCompleted aqui!
      // A conclusão da lição deve ser determinada apenas quando 
      // o último exercício for realmente completado
      return {
        ...prev,
        currentExercicioIndex: nextIndex
        // ❌ Removido: isCompleted: isLastExercicio
      };
    });
  }, []);

  const prevExercicio = useCallback(() => {
    setProgressState(prev => ({
      ...prev,
      currentExercicioIndex: Math.max(0, prev.currentExercicioIndex - 1)
    }));
  }, []);

  const canGoNext = useCallback(() => {
    const currentProgress = progressState.exerciciosProgress[progressState.currentExercicioIndex];
    return currentProgress?.completed || false;
  }, [progressState.exerciciosProgress, progressState.currentExercicioIndex]);

  const getProgressPercentage = useCallback(() => {
    const completedCount = progressState.exerciciosProgress.filter(p => p.completed).length;
    return exerciciosLength > 0 ? (completedCount / exerciciosLength) * 100 : 0;
  }, [progressState.exerciciosProgress, exerciciosLength]);

  const addAttempt = useCallback(() => {
    setProgressState(prev => {
      const newProgress = [...prev.exerciciosProgress];
      const currentIndex = prev.currentExercicioIndex;
      
      if (newProgress[currentIndex]) {
        newProgress[currentIndex] = {
          ...newProgress[currentIndex],
          attempts: newProgress[currentIndex].attempts + 1
        };
      }

      return {
        ...prev,
        exerciciosProgress: newProgress
      };
    });
  }, []);

  const goToExercicio = useCallback((targetIndex: number) => {
    setProgressState(prev => {
      // Verificar se pode navegar para o exercício alvo
      const targetProgress = prev.exerciciosProgress[targetIndex];
      const isAccessible = targetIndex <= prev.currentExercicioIndex || targetProgress?.completed;
      
      if (!isAccessible || targetIndex < 0 || targetIndex >= exerciciosLength) {
        return prev;
      }

      return {
        ...prev,
        currentExercicioIndex: targetIndex
      };
    });
  }, [exerciciosLength]);

  // Memoizar valores derivados para evitar recriação desnecessária
  const hasNext = useMemo(() => 
    progressState.currentExercicioIndex < exerciciosLength - 1, 
    [progressState.currentExercicioIndex, exerciciosLength]
  );

  const hasPrev = useMemo(() => 
    progressState.currentExercicioIndex > 0, 
    [progressState.currentExercicioIndex]
  );

  return {
    ...progressState,
    getCurrentExercicio,
    completeCurrentExercicio,
    nextExercicio,
    prevExercicio,
    goToExercicio,
    canGoNext,
    getProgressPercentage,
    addAttempt,
    hasNext,
    hasPrev
  };
};