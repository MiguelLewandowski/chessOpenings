'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  BookOpen,
  Target,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useAberturas, type Abertura } from '@/hooks/useAberturas';
import { useLicoes, type Licao } from '@/hooks/useLicoes';
import { useExercicios, type Exercicio } from '@/hooks/useExercicios';

export default function AdminDashboard() {
  const [selectedAbertura, setSelectedAbertura] = useState<string>('all');
  
  const { aberturas } = useAberturas();
  const { licoes } = useLicoes();
  const { exercicios } = useExercicios();

  // Estatísticas gerais
  const totalAberturas = aberturas.length;
  const totalLicoes = licoes.length;
  const totalExercicios = exercicios.length;

  // Estatísticas por abertura
  const getAberturaStats = (aberturaId: string) => {
    const licoesAbertura = licoes.filter(l => l.aberturaId === aberturaId);
    const exerciciosAbertura = exercicios.filter(e => 
      licoesAbertura.some(l => l.id === e.licaoId)
    );
    
    return {
      licoes: licoesAbertura.length,
      exercicios: exerciciosAbertura.length
    };
  };

  // Aberturas filtradas
  const aberturasComEstatisticas = aberturas.map(abertura => ({
    ...abertura,
    stats: getAberturaStats(abertura.id)
  }));

  const aberturasFiltradas = selectedAbertura === 'all' 
    ? aberturasComEstatisticas 
    : aberturasComEstatisticas.filter(a => a.id === selectedAbertura);

  return (
    <div className="space-y-8">
      {/* Header do Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-title text-3xl font-bold text-gray-900">
            Dashboard Administrativo
          </h1>
          <p className="font-body text-gray-600 mt-2">
            Visão geral e navegação hierárquica do conteúdo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin/aberturas?create=true"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Nova Abertura
          </Link>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total de Aberturas</p>
              <p className="font-title text-3xl font-bold text-blue-600">{totalAberturas}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Crown className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/admin/aberturas"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <Eye size={16} />
              Gerenciar Aberturas
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total de Lições</p>
              <p className="font-title text-3xl font-bold text-green-600">{totalLicoes}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOpen className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/admin/licoes"
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
            >
              <Eye size={16} />
              Gerenciar Lições
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total de Exercícios</p>
              <p className="font-title text-3xl font-bold text-purple-600">{totalExercicios}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/admin/exercicios"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
            >
              <Eye size={16} />
              Gerenciar Exercícios
            </Link>
          </div>
        </div>
      </div>

      {/* Filtro por Abertura */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-title text-xl font-bold text-gray-900">
            Navegação Hierárquica
          </h2>
          <div className="flex items-center gap-3">
            <label className="font-body text-sm text-gray-700">Filtrar por abertura:</label>
            <select
              value={selectedAbertura}
              onChange={(e) => setSelectedAbertura(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Todas as aberturas</option>
              {aberturas.map(abertura => (
                <option key={abertura.id} value={abertura.id}>
                  {abertura.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {aberturasFiltradas.map(abertura => (
            <AberturaCard 
              key={abertura.id} 
              abertura={abertura}
              licoes={licoes.filter(l => l.aberturaId === abertura.id)}
              exercicios={exercicios}
            />
          ))}
          
          {aberturasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <Crown size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-body">Nenhuma abertura encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para card expandível de abertura
function AberturaCard({ 
  abertura, 
  licoes, 
  exercicios 
}: { 
  abertura: Abertura & { stats: { licoes: number; exercicios: number } }; 
  licoes: Licao[]; 
  exercicios: Exercicio[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const licoesOrdenadas = licoes.sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header da Abertura */}
      <div 
        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Crown className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-title text-lg font-bold text-gray-900">
                {abertura.nome}
              </h3>
              <p className="font-body text-sm text-gray-600">
                {abertura.categoria} • {abertura.dificuldade}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-title text-lg font-bold text-green-600">
                {abertura.stats.licoes}
              </p>
              <p className="font-body text-xs text-gray-500">Lições</p>
            </div>
            <div className="text-center">
              <p className="font-title text-lg font-bold text-purple-600">
                {abertura.stats.exercicios}
              </p>
              <p className="font-body text-xs text-gray-500">Exercícios</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/aberturas?edit=${abertura.id}`}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit size={16} />
              </Link>
              <div className="text-gray-400">
                {isExpanded ? '−' : '+'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Lições Expandida */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-title text-md font-semibold text-gray-800">
                Lições ({licoesOrdenadas.length})
              </h4>
              <Link
                href={`/admin/licoes?create=true&aberturaId=${abertura.id}`}
                className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
              >
                <Plus size={16} />
                Nova Lição
              </Link>
            </div>
            
            {licoesOrdenadas.length > 0 ? (
              <div className="space-y-2">
                {licoesOrdenadas.map(licao => (
                  <LicaoItem 
                    key={licao.id} 
                    licao={licao} 
                    exercicios={exercicios.filter(e => e.licaoId === licao.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={32} className="mx-auto mb-2" />
                <p className="font-body text-sm">Nenhuma lição criada ainda</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para item de lição
function LicaoItem({ licao, exercicios }: { licao: Licao; exercicios: Exercicio[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const exerciciosOrdenados = exercicios.sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="border border-gray-100 rounded-lg">
      {/* Header da Lição */}
      <div 
        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <span className="text-green-600 text-xs font-bold">{licao.ordem}</span>
            </div>
            <div className="flex-1">
              <h5 className="font-body text-sm font-semibold text-gray-800">
                {licao.titulo}
              </h5>
              <p className="font-body text-xs text-gray-500">
                {licao.estimativaTempo}min • {exerciciosOrdenados.length} exercícios
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              licao.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {licao.status}
            </span>
            <Link
              href={`/admin/licoes?edit=${licao.id}`}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={14} />
            </Link>
            <div className="text-gray-400 text-xs">
              {isExpanded ? '−' : '+'}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Exercícios Expandida */}
      {isExpanded && exerciciosOrdenados.length > 0 && (
        <div className="border-t border-gray-100 p-3 bg-gray-25">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-xs font-medium text-gray-600">
              Exercícios ({exerciciosOrdenados.length})
            </span>
            <Link
              href={`/admin/exercicios?create=true&licaoId=${licao.id}`}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-xs font-medium"
            >
              <Plus size={12} />
              Novo
            </Link>
          </div>
          <div className="space-y-1">
            {exerciciosOrdenados.map(exercicio => (
              <div 
                key={exercicio.id}
                className="flex items-center justify-between p-2 bg-white rounded border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-purple-600 text-xs font-bold">{exercicio.ordem}</span>
                  </div>
                  <span className="font-body text-xs text-gray-700">{exercicio.titulo}</span>
                  <span className={`px-1 py-0.5 rounded text-xs ${
                    exercicio.tipo === 'Passivo' ? 'bg-yellow-100 text-yellow-700' :
                    exercicio.tipo === 'Interativo' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {exercicio.tipo}
                  </span>
                </div>
                <Link
                  href={`/admin/exercicios?edit=${exercicio.id}`}
                  className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <Edit size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 