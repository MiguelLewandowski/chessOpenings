'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Target,
  Zap,
  MoreVertical,
  Loader2,
  X,
  PlayCircle
} from 'lucide-react';
import AberturaForm from '@/components/admin/AberturaForm';
import AberturaLicoesModal from '@/components/admin/AberturaLicoesModal';
import { useAberturas, type Abertura, type AberturaFormData } from '@/hooks/useAberturas';

export default function GerenciamentoAberturas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAbertura, setEditingAbertura] = useState<Abertura | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isLicoesModalOpen, setIsLicoesModalOpen] = useState(false);
  const [selectedAbertura, setSelectedAbertura] = useState<Abertura | null>(null);
  
  const {
    loading,
    error,
    createAbertura,
    updateAbertura,
    deleteAbertura,
    filterAberturas,
    getStats,
    clearError
  } = useAberturas();

  // Dados filtrados usando o hook
  const aberturasFiltradas = filterAberturas(searchTerm, filterCategoria, filterDificuldade);
  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-700';
      case 'Arquivado': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Tática': return <Zap className="text-red-500" size={16} />;
      case 'Posicional': return <Target className="text-blue-500" size={16} />;
      case 'Universal': return <BookOpen className="text-purple-500" size={16} />;
      default: return <BookOpen className="text-gray-500" size={16} />;
    }
  };

  const handleCreateAbertura = () => {
    setFormMode('create');
    setEditingAbertura(null);
    setIsFormOpen(true);
  };

  const handleEditAbertura = (abertura: Abertura) => {
    setFormMode('edit');
    setEditingAbertura(abertura);
    setIsFormOpen(true);
  };

  const handleSaveAbertura = async (data: AberturaFormData) => {
    try {
      if (formMode === 'create') {
        await createAbertura(data);
      } else if (editingAbertura) {
        await updateAbertura(editingAbertura.id, data);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error('Erro ao salvar abertura:', err);
    }
  };

  const handleDeleteAbertura = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta abertura?')) {
      try {
        await deleteAbertura(id);
      } catch (err) {
        console.error('Erro ao deletar abertura:', err);
      }
    }
  };

  const handleViewLicoes = (abertura: Abertura) => {
    setSelectedAbertura(abertura);
    setIsLicoesModalOpen(true);
  };

  const handleCloseLicoesModal = () => {
    setIsLicoesModalOpen(false);
    setSelectedAbertura(null);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 font-body">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-gray-900">
            Gerenciamento de Aberturas
          </h1>
          <p className="font-body text-gray-600 mt-2">
            Crie, edite e organize as aberturas de xadrez da plataforma
          </p>
        </div>
        <button 
          onClick={handleCreateAbertura}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Nova Abertura
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar aberturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as categorias</option>
              <option value="Tática">Tática</option>
              <option value="Posicional">Posicional</option>
              <option value="Universal">Universal</option>
            </select>

            <select
              value={filterDificuldade}
              onChange={(e) => setFilterDificuldade(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as dificuldades</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Aberturas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Abertura</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Categoria</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Dificuldade</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Descrição</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Atualizado</th>
                <th className="text-right p-4 font-interface font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aberturasFiltradas.map((abertura) => (
                <tr key={abertura.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <h3 className="font-interface font-semibold text-gray-900">{abertura.nome}</h3>
                      <p className="font-body text-sm text-gray-600 mt-1">
                        {abertura.movimentos.join(' ')}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getCategoriaIcon(abertura.categoria)}
                      <span className="font-body text-sm text-gray-700">{abertura.categoria}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-gray-700">{abertura.dificuldade}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-body text-sm text-gray-600">
                      {abertura.descricao}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-interface font-semibold ${getStatusColor(abertura.status)}`}>
                      {abertura.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-gray-600">
                      {new Date(abertura.atualizadoEm).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewLicoes(abertura)}
                        className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                        title="Ver Lições"
                      >
                        <PlayCircle size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditAbertura(abertura)}
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteAbertura(abertura.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Estado vazio */}
        {aberturasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="font-interface font-semibold text-gray-700 mb-2">
              Nenhuma abertura encontrada
            </h3>
            <p className="font-body text-gray-500 mb-6">
              Tente ajustar os filtros ou criar uma nova abertura
            </p>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors mx-auto">
              <Plus size={18} />
              Nova Abertura
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total</p>
              <p className="font-title text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BookOpen className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Ativas</p>
              <p className="font-title text-2xl font-bold text-green-600">
                {stats.ativas}
              </p>
            </div>
            <Target className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Rascunhos</p>
              <p className="font-title text-2xl font-bold text-yellow-600">
                {stats.rascunhos}
              </p>
            </div>
            <Edit className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Arquivadas</p>
              <p className="font-title text-2xl font-bold text-gray-600">
                {stats.arquivadas}
              </p>
            </div>
            <Zap className="text-gray-500" size={24} />
          </div>
        </div>
      </div>

      {/* Formulário Modal */}
      <AberturaForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAbertura}
        initialData={editingAbertura}
        mode={formMode}
      />

      {/* Modal de Lições */}
      <AberturaLicoesModal
        isOpen={isLicoesModalOpen}
        onClose={handleCloseLicoesModal}
        abertura={selectedAbertura}
      />
    </div>
  );
} 