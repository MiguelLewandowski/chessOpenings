'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Trophy,
  ArrowLeft,
  Crown,
  Target,
  Zap,
  Lock
} from 'lucide-react';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes, type Licao } from '@/hooks/useLicoes';
import { useExercicios } from '@/hooks/useExercicios';
import Navbar from '@/components/Navbar';

// Componente para peça de xadrez animada
const AnimatedChessPiece = ({ 
  piece = 'pawn', 
  size = 32,
  className = "",
  isAnimating = false 
}: { 
  piece?: string; 
  size?: number;
  className?: string;
  isAnimating?: boolean;
}) => {
  const pieces: { [key: string]: string } = {
    king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙'
  };

  return (
    <div className={`
      select-none transition-all duration-700 ${isAnimating ? 'animate-bounce' : ''}
      ${className}
    `}>
      <span 
        className="block text-blue-600 drop-shadow-sm"
        style={{ 
          fontSize: `${size}px`, 
          lineHeight: '1',
          filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
        }}
      >
        {pieces[piece] || pieces.pawn}
      </span>
    </div>
  );
};

// Componente para casa da trilha (lição)
const TrilhaLicao = ({ 
  licao, 
  index,
  isUnlocked, 
  isCompleted, 
  isCurrent,
  isPlayerHere,
  exerciciosCount,
  completedExercicios,
  aberturaId 
}: {
  licao: Licao;
  index: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  isPlayerHere: boolean;
  exerciciosCount: number;
  completedExercicios: number;
  aberturaId: string;
}) => {
  
  const getCardStyle = () => {
    const baseStyle = `
      relative w-full p-6 border-2 rounded-xl transition-all duration-300
      bg-white shadow-sm hover:shadow-md
    `;
    
    if (isCompleted) {
      return baseStyle + ' border-green-500 bg-green-50';
    }
    
    if (isCurrent) {
      return baseStyle + ' border-blue-500 bg-blue-50 ring-2 ring-blue-200';
    }
    
    if (isUnlocked) {
      return baseStyle + ' border-gray-200 hover:border-blue-300 cursor-pointer';
    }
    
    return baseStyle + ' border-gray-200 bg-gray-50 opacity-60';
  };

  const getIcon = () => {
    if (isCompleted) return <CheckCircle size={24} className="text-green-600" />;
    if (isCurrent) return <Target size={24} className="text-blue-600" />;
    if (isUnlocked) return <BookOpen size={24} className="text-gray-600" />;
    return <Lock size={24} className="text-gray-400" />;
  };

  const progressPercentage = exerciciosCount > 0 ? (completedExercicios / exerciciosCount) * 100 : 0;

  const handleClick = () => {
    if (isUnlocked) {
      window.location.href = `/aberturas/${aberturaId}/licao/${licao.id}`;
    }
  };

  return (
    <div className="relative">
      {/* Linha conectora vertical */}
      {index > 0 && (
        <div className="absolute top-0 left-8 w-0.5 h-6 bg-gray-300 transform -translate-y-6 z-10" />
      )}
      
      {/* Card da lição */}
      <div 
        onClick={handleClick}
        className={getCardStyle()}
      >
        <div className="flex items-center gap-4">
          {/* Ícone e número */}
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center">
              {getIcon()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white border-2 border-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">
                {licao.ordem}
              </span>
            </div>
          </div>

          {/* Informações da lição */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {licao.titulo}
            </h3>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{licao.estimativaTempo}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy size={16} />
                <span>{licao.pontuacao}pts</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={16} />
                <span>{exerciciosCount} exercícios</span>
              </div>
            </div>
          </div>

          {/* Status e progresso */}
          <div className="flex-shrink-0 text-right">
            {/* Barra de progresso */}
            {exerciciosCount > 0 && (
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}
            
            {/* Status text */}
            {isCompleted && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <CheckCircle size={16} />
                <span>Completa</span>
              </div>
            )}
            
            {isCurrent && (
              <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                <Target size={16} />
                <span>Atual</span>
              </div>
            )}

            {!isUnlocked && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Lock size={16} />
                <span>Bloqueada</span>
              </div>
            )}
          </div>
        </div>

        {/* Peão do jogador */}
        {isPlayerHere && (
          <div className="absolute -top-4 left-8 transform -translate-x-1/2 z-20">
            <AnimatedChessPiece 
              piece="pawn" 
              size={40} 
              isAnimating={true}
              className="relative z-10"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function TrilhaLicoes() {
  const params = useParams();
  const aberturaId = params.id as string;
  
  const { aberturas } = useAberturas();
  const { licoes } = useLicoes();
  const { exercicios } = useExercicios();
  
  const [userProgress, setUserProgress] = useState<{
    completedLicoes: string[];
    exerciciosProgress: { [licaoId: string]: number };
    currentLicaoIndex: number;
  }>({
    completedLicoes: [],
    exerciciosProgress: {},
    currentLicaoIndex: 0
  });

  const [playerPosition, setPlayerPosition] = useState(0);

  const abertura = aberturas.find(a => a.id === aberturaId);
  
  // Corrigir ordenação das lições
  const licoesAbertura = licoes
    .filter(l => l.aberturaId === aberturaId && l.status === 'Ativo')
    .sort((a, b) => a.ordem - b.ordem); // Ordenação correta por número da ordem

  // Simular carregamento do progresso do usuário
  useEffect(() => {
    // Em produção, isso viria de uma API
    const mockProgress = {
      completedLicoes: [], // Nenhuma lição completada inicialmente
      exerciciosProgress: {}, // Nenhum exercício completado inicialmente
      currentLicaoIndex: 0
    };
    setUserProgress(mockProgress);
    setPlayerPosition(0);
  }, []);

  // Simular progresso quando uma lição é completada
  const handleLicaoComplete = (licaoIndex: number) => {
    const nextIndex = Math.min(licaoIndex + 1, licoesAbertura.length - 1);
    setUserProgress(prev => ({
      ...prev,
      currentLicaoIndex: nextIndex,
      completedLicoes: [...prev.completedLicoes, licoesAbertura[licaoIndex].id]
    }));
    setPlayerPosition(nextIndex);
  };

  // Calcular lição atual (primeira não completada)
  const getCurrentLicaoIndex = () => {
    const nextLicaoIndex = licoesAbertura.findIndex(licao => 
      !userProgress.completedLicoes.includes(licao.id)
    );
    return nextLicaoIndex >= 0 ? nextLicaoIndex : licoesAbertura.length;
  };

  const currentLicaoIndex = getCurrentLicaoIndex();

  const getTotalPontos = () => {
    return userProgress.completedLicoes.reduce((total, licaoId) => {
      const licao = licoesAbertura.find(l => l.id === licaoId);
      return total + (licao?.pontuacao || 0);
    }, 0);
  };

  const getTotalTempo = () => {
    return userProgress.completedLicoes.reduce((total, licaoId) => {
      const licao = licoesAbertura.find(l => l.id === licaoId);
      return total + (licao?.estimativaTempo || 0);
    }, 0);
  };

  if (!abertura) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Abertura não encontrada</h2>
          <Link href="/aberturas" className="text-blue-600 hover:text-blue-800">
            Voltar para Aberturas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header limpo */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/aberturas"
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="font-title text-2xl font-bold text-gray-900">
                    {abertura.nome}
                  </h1>
                  <p className="font-body text-gray-600">
                    {licoesAbertura.length} lições • {abertura.categoria}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Estatísticas limpas */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-blue-600 mb-1">
                  <Trophy size={18} />
                  <span className="font-title text-lg font-bold">{getTotalPontos()}</span>
                </div>
                <p className="font-body text-xs text-gray-600">Pontos</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <Clock size={18} />
                  <span className="font-title text-lg font-bold">{getTotalTempo()}min</span>
                </div>
                <p className="font-body text-xs text-gray-600">Estudado</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 text-green-600 mb-1">
                  <CheckCircle size={18} />
                  <span className="font-title text-lg font-bold">
                    {userProgress.completedLicoes.length}/{licoesAbertura.length}
                  </span>
                </div>
                <p className="font-body text-xs text-gray-600">Completas</p>
              </div>
            </div>
          </div>
          
          {/* Barra de progresso simples */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso da Trilha</span>
              <span className="text-sm text-gray-600">
                {Math.round((userProgress.completedLicoes.length / licoesAbertura.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${(userProgress.completedLicoes.length / licoesAbertura.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trilha vertical simples */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="font-title text-xl font-bold text-gray-900 mb-2">
            Trilha de Lições
          </h2>
          <p className="font-body text-gray-600">
            Complete as lições em sequência para dominar a {abertura.nome}
          </p>
        </div>

        {/* Lista de lições */}
        <div className="space-y-4">
          {licoesAbertura.map((licao, index) => {
            const licaoExercicios = exercicios.filter(e => e.licaoId === licao.id && e.status === 'Ativo');
            const completedExercicios = userProgress.exerciciosProgress[licao.id] || 0;
            
            return (
              <TrilhaLicao
                key={licao.id}
                licao={licao}
                index={index}
                isUnlocked={index <= currentLicaoIndex}
                isCompleted={userProgress.completedLicoes.includes(licao.id)}
                isCurrent={index === currentLicaoIndex}
                isPlayerHere={index === playerPosition}
                exerciciosCount={licaoExercicios.length}
                completedExercicios={completedExercicios}
                aberturaId={aberturaId}
              />
            );
          })}
        </div>

        {/* Finish line simples */}
        {userProgress.completedLicoes.length === licoesAbertura.length && (
          <div className="mt-8 text-center p-6 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-white" />
            </div>
            <h3 className="font-title text-lg font-bold text-gray-900 mb-2">
              Parabéns! Trilha Completa
            </h3>
            <p className="font-body text-gray-600">
              Você dominou a {abertura.nome}!
            </p>
          </div>
        )}

        {/* Controles de teste (remover em produção) */}
        <div className="mt-8 text-center bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Controles de teste:</p>
          <button 
            onClick={() => {
              if (currentLicaoIndex < licoesAbertura.length) {
                handleLicaoComplete(currentLicaoIndex);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-3 text-sm"
            disabled={currentLicaoIndex >= licoesAbertura.length}
          >
            Completar Lição Atual
          </button>
          <button 
            onClick={() => {
              setUserProgress({
                completedLicoes: [],
                exerciciosProgress: {},
                currentLicaoIndex: 0
              });
              setPlayerPosition(0);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Reset Progresso
          </button>
        </div>
      </div>
    </div>
  );
} 