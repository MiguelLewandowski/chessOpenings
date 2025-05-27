'use client';

import React from 'react';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Play,
  Clock,
  Target,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { type Abertura } from '@/types/aberturas';
import { useLicoes } from '@/hooks/useLicoes';
import { useExercicios } from '@/hooks/useExercicios';

interface AberturaLicoesModalProps {
  isOpen: boolean;
  onClose: () => void;
  abertura: Abertura | null;
}

export default function AberturaLicoesModal({
  isOpen,
  onClose,
  abertura
}: AberturaLicoesModalProps) {
  const { licoes, loading: licoesLoading } = useLicoes();
  const { exercicios } = useExercicios();

  if (!isOpen || !abertura) return null;

  // Filtrar lições desta abertura
  const licoesAbertura = licoes.filter(licao => licao.aberturaId === abertura.id);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Visualização': return <Eye className="text-blue-500" size={16} />;
      case 'Interativo': return <Play className="text-green-500" size={16} />;
      default: return <BookOpen className="text-gray-500" size={16} />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Visualização': return 'bg-blue-100 text-blue-700';
      case 'Interativo': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-700';
      case 'Arquivado': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'Iniciante': return 'text-green-600';
      case 'Intermediário': return 'text-yellow-600';
      case 'Avançado': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getExerciciosCount = (licaoId: string) => {
    return exercicios.filter(ex => ex.licaoId === licaoId).length;
  };

  const handleCreateLicao = () => {
    // Redirecionar para página de lições com parâmetro para criar nova lição
    window.location.href = `/admin/licoes?create=true&aberturaId=${abertura.id}`;
  };

  const handleEditLicao = (licaoId: string) => {
    // Por enquanto, redireciona para página de lições
    window.location.href = `/admin/licoes?edit=${licaoId}`;
  };

  const handleViewLicao = (licaoId: string) => {
    // Por enquanto, redireciona para página de lições
    window.location.href = `/admin/licoes?view=${licaoId}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h2 className="font-title text-xl font-bold text-gray-900">
                {abertura.nome}
              </h2>
              <p className="font-body text-sm text-gray-600 mt-1">
                {abertura.movimentos.join(' ')} • {abertura.categoria}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Estatísticas da Abertura */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-blue-600">Lições</p>
                  <p className="font-title text-2xl font-bold text-blue-900">
                    {licoesAbertura.length}
                  </p>
                </div>
                <BookOpen className="text-blue-500" size={24} />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-green-600">Exercícios Total</p>
                  <p className="font-title text-2xl font-bold text-green-900">
                    {licoesAbertura.reduce((total, licao) => total + getExerciciosCount(licao.id), 0)}
                  </p>
                </div>
                <Target className="text-green-500" size={24} />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-purple-600">Tempo Total</p>
                  <p className="font-title text-2xl font-bold text-purple-900">
                    {licoesAbertura.reduce((total, licao) => total + licao.estimativaTempo, 0)}min
                  </p>
                </div>
                <Clock className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          {/* Header das Lições */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-title text-lg font-bold text-gray-900">
              Lições da Abertura
            </h3>
            <button
              onClick={handleCreateLicao}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Nova Lição
            </button>
          </div>

          {/* Lista de Lições */}
          <div className="max-h-96 overflow-y-auto">
            {licoesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-blue-500" />
                <span className="ml-3 font-body text-gray-600">Carregando lições...</span>
              </div>
            ) : licoesAbertura.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="font-interface font-semibold text-gray-700 mb-2">
                  Nenhuma lição criada
                </h4>
                <p className="font-body text-gray-500 mb-4">
                  Crie a primeira lição para esta abertura
                </p>
                <button
                  onClick={handleCreateLicao}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  Criar Primeira Lição
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {licoesAbertura
                  .sort((a, b) => a.ordem - b.ordem)
                  .map((licao) => (
                    <div
                      key={licao.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-700 text-xs font-interface font-semibold px-2 py-1 rounded">
                              #{licao.ordem}
                            </span>
                            <h4 className="font-interface font-semibold text-gray-900">
                              {licao.titulo}
                            </h4>
                            <div className="flex items-center gap-2">
                              {getTipoIcon(licao.tipo)}
                              <span className={`px-2 py-1 rounded-full text-xs font-interface font-semibold ${getTipoColor(licao.tipo)}`}>
                                {licao.tipo}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-interface font-semibold ${getStatusColor(licao.status)}`}>
                              {licao.status}
                            </span>
                          </div>
                          
                          <p className="font-body text-sm text-gray-600 mb-3">
                            {licao.descricao}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`font-body font-semibold ${getDificuldadeColor(licao.dificuldade)}`}>
                              {licao.dificuldade}
                            </span>
                            <span className="flex items-center gap-1 text-purple-600">
                              <Clock size={14} />
                              {licao.estimativaTempo}min
                            </span>
                            <span className="flex items-center gap-1 text-green-600">
                              <Target size={14} />
                              {getExerciciosCount(licao.id)} exercícios
                            </span>
                            <span className="text-gray-500">
                              {licao.pontuacao} pontos
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleViewLicao(licao.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Visualizar lição"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditLicao(licao.id)}
                            className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            title="Editar lição"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                          <button
                            onClick={() => handleViewLicao(licao.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p className="font-body">
              {licoesAbertura.length} {licoesAbertura.length === 1 ? 'lição' : 'lições'} • 
              {licoesAbertura.reduce((total, licao) => total + getExerciciosCount(licao.id), 0)} exercícios total
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-interface font-semibold hover:text-gray-900 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleCreateLicao}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Nova Lição
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 