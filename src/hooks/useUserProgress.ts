import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExercicioProgress } from './useLicaoProgress';
import { type Exercicio } from '@/types/exercicios';

// 🎯 Tipos para o progresso global do usuário
export interface LicaoProgressData {
  licaoId: string;
  isCompleted: boolean;
  exerciciosProgress: ExercicioProgress[];
  totalScore: number;
  totalTime: number;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface AberturaProgressData {
  aberturaId: string;
  currentLicaoIndex: number;
  licoesCompletas: string[];
  totalScore: number;
  totalTime: number;
  isCompleted: boolean;
  lastAccessedAt: string;
}

interface UserProgressState {
  // Estado global
  currentUser: string; // Para futuro suporte multi-usuário
  
  // Progresso por abertura
  aberturaProgress: { [aberturaId: string]: AberturaProgressData };
  
  // Progresso detalhado por lição
  licaoProgress: { [licaoId: string]: LicaoProgressData };
  
  // Ações para aberturas
  initializeAbertura: (aberturaId: string) => void;
  getCurrentLicaoIndex: (aberturaId: string) => number;
  isLicaoUnlocked: (aberturaId: string, licaoIndex: number) => boolean;
  
  // Ações para lições
  initializeLicao: (licaoId: string, exercicios: Exercicio[]) => void;
  updateLicaoProgress: (licaoId: string, exerciciosProgress: ExercicioProgress[], totalScore: number, totalTime: number) => void;
  completeLicao: (licaoId: string, aberturaId: string, licaoIndex: number) => void;
  getLicaoProgress: (licaoId: string) => LicaoProgressData | null;
  
  // Ações utilitárias
  resetProgress: () => void;
  resetAberturaProgress: (aberturaId: string) => void;
  
  // Stats globais
  getTotalStats: () => {
    totalLicoesCompletas: number;
    totalScore: number;
    totalTime: number;
    aberturasCompletas: number;
  };
}

export const useUserProgress = create<UserProgressState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentUser: 'default',
      aberturaProgress: {},
      licaoProgress: {},
      
      // Inicializar progresso de uma abertura
      initializeAbertura: (aberturaId: string) => {
        const state = get();
        if (!state.aberturaProgress[aberturaId]) {
          set(state => ({
            aberturaProgress: {
              ...state.aberturaProgress,
              [aberturaId]: {
                aberturaId,
                currentLicaoIndex: 0,
                licoesCompletas: [],
                totalScore: 0,
                totalTime: 0,
                isCompleted: false,
                lastAccessedAt: new Date().toISOString()
              }
            }
          }));
        }
      },
      
      // Obter índice da lição atual em uma abertura
      getCurrentLicaoIndex: (aberturaId: string) => {
        const abertura = get().aberturaProgress[aberturaId];
        return abertura?.currentLicaoIndex ?? 0;
      },
      
      // Verificar se uma lição está desbloqueada
      isLicaoUnlocked: (aberturaId: string, licaoIndex: number) => {
        const abertura = get().aberturaProgress[aberturaId];
        if (!abertura) return licaoIndex === 0; // Primeira lição sempre desbloqueada
        
        // Lição está desbloqueada se:
        // 1. É a primeira lição (índice 0)
        // 2. É a próxima lição após a atual
        // 3. Já foi completada anteriormente
        return licaoIndex === 0 || 
               licaoIndex <= abertura.currentLicaoIndex ||
               abertura.licoesCompletas.length > licaoIndex;
      },
      
      // Inicializar progresso de uma lição
      initializeLicao: (licaoId: string, exercicios: Exercicio[]) => {
        const state = get();
        if (!state.licaoProgress[licaoId]) {
          const initialProgress: ExercicioProgress[] = exercicios.map(exercicio => ({
            exercicioId: exercicio.id,
            completed: false,
            score: 0,
            attempts: 0,
            timeSpent: 0
          }));
          
          set(state => ({
            licaoProgress: {
              ...state.licaoProgress,
              [licaoId]: {
                licaoId,
                isCompleted: false,
                exerciciosProgress: initialProgress,
                totalScore: 0,
                totalTime: 0,
                lastAccessedAt: new Date().toISOString()
              }
            }
          }));
        }
      },
      
      // Atualizar progresso de uma lição
      updateLicaoProgress: (licaoId: string, exerciciosProgress: ExercicioProgress[], totalScore: number, totalTime: number) => {
        set(state => ({
          licaoProgress: {
            ...state.licaoProgress,
            [licaoId]: {
              ...state.licaoProgress[licaoId],
              exerciciosProgress,
              totalScore,
              totalTime,
              lastAccessedAt: new Date().toISOString()
            }
          }
        }));
      },
      
      // Completar uma lição
      completeLicao: (licaoId: string, aberturaId: string, licaoIndex: number) => {
        set(state => {
          const licao = state.licaoProgress[licaoId];
          const abertura = state.aberturaProgress[aberturaId] || {
            aberturaId,
            currentLicaoIndex: 0,
            licoesCompletas: [],
            totalScore: 0,
            totalTime: 0,
            isCompleted: false,
            lastAccessedAt: new Date().toISOString()
          };
          
          const now = new Date().toISOString();
          
          // Atualizar lição como completada
          const updatedLicao: LicaoProgressData = {
            ...licao,
            isCompleted: true,
            completedAt: now,
            lastAccessedAt: now
          };
          
          // Atualizar progresso da abertura
          const novasLicoesCompletas = abertura.licoesCompletas.includes(licaoId) 
            ? abertura.licoesCompletas 
            : [...abertura.licoesCompletas, licaoId];
          
          const novoCurrentIndex = Math.max(abertura.currentLicaoIndex, licaoIndex + 1);
          
          const updatedAbertura: AberturaProgressData = {
            ...abertura,
            currentLicaoIndex: novoCurrentIndex,
            licoesCompletas: novasLicoesCompletas,
            totalScore: abertura.totalScore + (licao?.totalScore || 0),
            totalTime: abertura.totalTime + (licao?.totalTime || 0),
            lastAccessedAt: now
          };
          
          return {
            licaoProgress: {
              ...state.licaoProgress,
              [licaoId]: updatedLicao
            },
            aberturaProgress: {
              ...state.aberturaProgress,
              [aberturaId]: updatedAbertura
            }
          };
        });
      },
      
      // Obter progresso de uma lição
      getLicaoProgress: (licaoId: string) => {
        return get().licaoProgress[licaoId] || null;
      },
      
      // Reset completo do progresso
      resetProgress: () => {
        set({
          aberturaProgress: {},
          licaoProgress: {}
        });
      },
      
      // Reset progresso de uma abertura específica
      resetAberturaProgress: (aberturaId: string) => {
        set(state => {
          const newAberturaProgress = { ...state.aberturaProgress };
          delete newAberturaProgress[aberturaId];
          
          // Também remover progresso das lições desta abertura
          const newLicaoProgress = { ...state.licaoProgress };
          Object.keys(newLicaoProgress).forEach(() => {
            // TODO: Precisaríamos de uma forma de identificar lições por abertura
            // Por ora, mantemos todas as lições
          });
          
          return {
            aberturaProgress: newAberturaProgress,
            licaoProgress: newLicaoProgress
          };
        });
      },
      
      // Estatísticas globais
      getTotalStats: () => {
        const state = get();
        const licoesCompletas = Object.values(state.licaoProgress).filter(l => l.isCompleted);
        const aberturasCompletas = Object.values(state.aberturaProgress).filter(a => a.isCompleted);
        
        return {
          totalLicoesCompletas: licoesCompletas.length,
          totalScore: licoesCompletas.reduce((sum, l) => sum + l.totalScore, 0),
          totalTime: licoesCompletas.reduce((sum, l) => sum + l.totalTime, 0),
          aberturasCompletas: aberturasCompletas.length
        };
      }
    }),
    {
      name: 'user-progress', // LocalStorage key
      version: 1, // Para futuras migrações
    }
  )
); 