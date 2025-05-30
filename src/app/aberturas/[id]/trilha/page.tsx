'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Play,
  Lock,
  CheckCircle,
  Star,
  Clock,
  Target,
  Trophy,
  ArrowLeft,
  Crown
} from 'lucide-react';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes, type Licao } from '@/hooks/useLicoes';
import Navbar from '@/components/Navbar';

// Componente para as peças decorativas
const ChessPiece = ({ piece, className = "", size = 24 }: { piece: string; className?: string; size?: number }) => {
  const pieces: { [key: string]: string } = {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  };

  return (
    <span 
      className={`select-none ${className}`} 
      style={{ fontSize: `${size}px`, lineHeight: '1' }}
    >
      {pieces[piece] || '♙'}
    </span>
  );
};

// Componente para o nó da lição (casa do xadrez)
const LicaoNode = ({ 
  licao, 
  position, 
  isUnlocked, 
  isCompleted, 
  isCurrent,
  aberturaId 
}: {
  licao: Licao;
  position: { x: number; y: number };
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  aberturaId: string;
}) => {
  const router = useRouter();
  
  const getNodeStyle = () => {
    if (isCompleted) {
      return 'bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/25';
    }
    if (isCurrent) {
      return 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-500/25 animate-pulse';
    }
    if (isUnlocked) {
      return 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md';
    }
    return 'bg-gray-100 border-gray-200 text-gray-400';
  };

  const getIcon = () => {
    if (isCompleted) return <CheckCircle size={20} />;
    if (!isUnlocked) return <Lock size={20} />;
    // Todas as lições são conceituais, usamos BookOpen como padrão
    return <BookOpen size={20} />;
  };

  const handleClick = () => {
    if (isUnlocked) {
      router.push(`/aberturas/${aberturaId}/licao/${licao.id}`);
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Linha conectora (se não for a primeira lição) */}
      {licao.ordem > 1 && (
        <div 
          className="absolute bottom-full left-1/2 w-1 bg-gray-300 -translate-x-1/2"
          style={{ height: '60px' }}
        />
      )}
      
      {/* Nó da lição */}
      <div 
        onClick={handleClick}
        className={`
          relative w-16 h-16 rounded-xl border-3 transition-all duration-300
          flex items-center justify-center font-bold text-sm
          ${getNodeStyle()}
          ${isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'}
        `}
      >
        {/* Ícone principal */}
        {getIcon()}
        
        {/* Número da lição */}
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600">
          {licao.ordem}
        </span>
        
        {/* Estrelas de progresso */}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 flex">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i} 
                size={8} 
                className="text-yellow-400 fill-current -ml-1" 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Tooltip com informações */}
      {isUnlocked && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap">
            <div className="font-semibold">{licao.titulo}</div>
            <div className="text-gray-300">{licao.estimativaTempo}min • {licao.pontuacao} pts</div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default function TrilhaLicoes() {
  const params = useParams();
  const aberturaId = params.id as string;
  
  const { aberturas } = useAberturas();
  const { licoes } = useLicoes();
  
  const [currentLicao, setCurrentLicao] = useState(1);
  const [completedLicoes, setCompletedLicoes] = useState<number[]>([]);

  const abertura = aberturas.find(a => a.id === aberturaId);
  const licoesAbertura = licoes
    .filter(l => l.aberturaId === aberturaId && l.status === 'Ativo')
    .sort((a, b) => a.ordem - b.ordem);

  // Simular progresso do usuário (em produção, viria de uma API)
  useEffect(() => {
    // Simular algumas lições completas
    setCompletedLicoes([1, 2]);
    setCurrentLicao(3);
  }, []);

  // Gerar posições das lições em zigue-zague
  const getLicaoPositions = () => {
    return licoesAbertura.map((licao, index) => {
      const row = Math.floor(index / 2);
      const isEven = index % 2 === 0;
      
      return {
        x: isEven ? 20 : 80, // Alternar entre esquerda e direita
        y: 150 + (row * 120) // Espaçamento vertical
      };
    });
  };

  const positions = getLicaoPositions();

  const getTotalPontos = () => {
    return completedLicoes.reduce((total, ordem) => {
      const licao = licoesAbertura.find(l => l.ordem === ordem);
      return total + (licao?.pontuacao || 0);
    }, 0);
  };

  const getTotalTempo = () => {
    return completedLicoes.reduce((total, ordem) => {
      const licao = licoesAbertura.find(l => l.ordem === ordem);
      return total + (licao?.estimativaTempo || 0);
    }, 0);
  };

  const router = useRouter();

  if (!abertura) {
    return <div>Abertura não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Link 
                href="/aberturas"
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="font-title text-xl font-bold text-gray-900 truncate">
                  {abertura.nome}
                </h1>
                <p className="font-body text-sm text-gray-600 truncate">
                  {licoesAbertura.length} lições • {abertura.categoria}
                </p>
              </div>
            </div>
            
            {/* Progresso */}
            <div className="flex items-center gap-3 lg:gap-6 flex-wrap lg:flex-nowrap">
              <div className="text-center">
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  <Trophy size={16} />
                  <span className="font-title text-sm font-bold">{getTotalPontos()}</span>
                </div>
                <p className="font-body text-xs text-gray-600">Pontos</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 text-blue-500 mb-1">
                  <Clock size={16} />
                  <span className="font-title text-sm font-bold">{getTotalTempo()}min</span>
                </div>
                <p className="font-body text-xs text-gray-600">Estudado</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 text-green-500 mb-1">
                  <CheckCircle size={16} />
                  <span className="font-title text-sm font-bold">
                    {completedLicoes.length}/{licoesAbertura.length}
                  </span>
                </div>
                <p className="font-body text-xs text-gray-600">Completas</p>
              </div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="mt-4 w-full">
            <div className="bg-gray-200 rounded-full h-2 w-full max-w-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (completedLicoes.length / licoesAbertura.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trilha de Lições */}
      <div className="relative max-w-4xl mx-auto px-4 py-8 overflow-hidden">
        {/* Elementos decorativos de xadrez */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Peças decorativas esquerda */}
          <div className="absolute left-4 top-20 hidden sm:block">
            <ChessPiece piece="king" className="text-gray-200" size={32} />
          </div>
          <div className="absolute left-8 top-80 hidden sm:block">
            <ChessPiece piece="queen" className="text-gray-200" size={28} />
          </div>
          <div className="absolute left-2 top-96 hidden sm:block">
            <ChessPiece piece="rook" className="text-gray-200" size={24} />
          </div>
          
          {/* Peças decorativas direita */}
          <div className="absolute right-4 top-40 hidden sm:block">
            <ChessPiece piece="bishop" className="text-gray-200" size={28} />
          </div>
          <div className="absolute right-8 top-72 hidden sm:block">
            <ChessPiece piece="knight" className="text-gray-200" size={32} />
          </div>
          <div className="absolute right-2 top-[500px] hidden sm:block">
            <ChessPiece piece="pawn" className="text-gray-200" size={20} />
          </div>
          
          {/* Padrão de casas de xadrez sutil */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-5 hidden lg:block">
            <div className="grid grid-cols-8 gap-0">
              {[...Array(64)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-6 h-6 ${
                    (Math.floor(i / 8) + i % 8) % 2 === 0 
                      ? 'bg-gray-900' 
                      : 'bg-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trilha principal */}
        <div className="relative" style={{ minHeight: `${Math.max(600, positions.length * 60 + 200)}px` }}>
          {/* Linha de progresso principal */}
          <div className="absolute left-1/2 top-0 w-1 bg-gray-200 transform -translate-x-1/2"
               style={{ height: '100%' }} />
          
          {/* Início da trilha */}
          <div className="absolute left-1/2 top-8 transform -translate-x-1/2 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Crown size={32} />
            </div>
            <p className="font-title text-sm font-bold text-gray-700 mt-2">INÍCIO</p>
          </div>

          {/* Nós das lições */}
          {licoesAbertura.map((licao, index) => (
            <LicaoNode
              key={licao.id}
              licao={licao}
              position={positions[index]}
              isUnlocked={licao.ordem <= currentLicao}
              isCompleted={completedLicoes.includes(licao.ordem)}
              isCurrent={licao.ordem === currentLicao}
              aberturaId={aberturaId}
            />
          ))}
          
          {/* Final da trilha */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 text-center"
            style={{ top: `${Math.max(positions[positions.length - 1]?.y + 100, 700)}px` }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Trophy size={32} />
            </div>
            <p className="font-title text-sm font-bold text-gray-700 mt-2">MAESTRIA</p>
          </div>
        </div>
      </div>

      {/* Painel de informações da lição atual */}
      {currentLicao <= licoesAbertura.length && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 px-4 w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 mx-auto">
            {(() => {
              const licao = licoesAbertura.find(l => l.ordem === currentLicao);
              if (!licao) return null;
              
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-title text-lg font-bold text-gray-900 truncate">
                        {licao.titulo}
                      </h3>
                      <p className="font-body text-sm text-gray-600 truncate">
                        Lição {licao.ordem} • {licao.estimativaTempo}min
                      </p>
                    </div>
                  </div>
                  
                  <p className="font-body text-sm text-gray-600 mb-4 line-clamp-3">
                    {licao.descricao}
                  </p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => router.push(`/aberturas/${aberturaId}/licao/${licao.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-interface font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 min-w-0 cursor-pointer"
                    >
                      <Play size={16} className="flex-shrink-0" />
                      <span className="truncate">Iniciar Lição</span>
                    </button>
                    <button className="p-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0 cursor-pointer">
                      <Target size={16} />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
} 