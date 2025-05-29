'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Target,
  Zap,
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
    // Mostrar diálogo de confirmação mais informativo
    const abertura = aberturasFiltradas.find(a => a.id === id);
    if (!abertura) return;

    const confirmMessage = `⚠️ ATENÇÃO: Exclusão em Cascata

Tem certeza que deseja excluir a abertura "${abertura.nome}"?

Esta ação irá remover permanentemente:
• A abertura selecionada
• Todas as lições relacionadas a esta abertura
• Todos os exercícios das lições relacionadas

Esta operação NÃO PODE ser desfeita.

Confirmar exclusão?`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteAbertura(id);
        
        // Feedback de sucesso (opcional - pode ser substituído por toast/notification)
        alert('✅ Abertura e todos os dados relacionados foram excluídos com sucesso!');
      } catch (err) {
        console.error('Erro ao deletar abertura:', err);
        alert('❌ Erro ao excluir abertura. Tente novamente.');
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={18} />
            </div>
            <h1 className="font-title text-3xl sm:text-4xl font-bold text-gray-900">
              Gerenciamento de Aberturas
            </h1>
          </div>
          <p className="font-body text-lg text-gray-600">
            Crie, edite e organize as aberturas de xadrez da plataforma
          </p>
        </div>
        <button 
          onClick={handleCreateAbertura}
          disabled={loading}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-interface font-bold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          Nova Abertura
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar aberturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl font-body focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Todas as categorias</option>
              <option value="Tática">Tática</option>
              <option value="Posicional">Posicional</option>
              <option value="Universal">Universal</option>
            </select>

            <select
              value={filterDificuldade}
              onChange={(e) => setFilterDificuldade(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl font-body focus:ring-2 focus:ring-blue-500 bg-white"
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-6 font-interface font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-gray-600" />
                    Abertura
                  </div>
                </th>
                <th className="text-left p-6 font-interface font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-gray-600" />
                    Categoria
                  </div>
                </th>
                <th className="text-left p-6 font-interface font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-gray-600" />
                    Dificuldade
                  </div>
                </th>
                <th className="text-left p-6 font-interface font-bold text-gray-800">Descrição</th>
                <th className="text-left p-6 font-interface font-bold text-gray-800">Status</th>
                <th className="text-left p-6 font-interface font-bold text-gray-800">Atualizado</th>
                <th className="text-right p-6 font-interface font-bold text-gray-800">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aberturasFiltradas.map((abertura) => (
                <tr key={abertura.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <div>
                      <h3 className="font-interface font-bold text-lg text-gray-900 mb-2">{abertura.nome}</h3>
                      <p className="font-mono text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                        {abertura.movimentos.join(' ')}
                      </p>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {getCategoriaIcon(abertura.categoria)}
                      </div>
                      <span className="font-body font-medium text-gray-700">{abertura.categoria}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`font-body font-semibold px-3 py-1 rounded-full text-sm ${
                      abertura.dificuldade === 'Iniciante' ? 'bg-green-100 text-green-700' :
                      abertura.dificuldade === 'Intermediário' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {abertura.dificuldade}
                    </span>
                  </td>
                  <td className="p-6 max-w-md">
                    <p className="font-body text-gray-600 leading-relaxed">
                      {abertura.descricao}
                    </p>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-interface font-bold ${getStatusColor(abertura.status)}`}>
                      {abertura.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="font-body text-sm text-gray-600">
                      {new Date(abertura.atualizadoEm).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewLicoes(abertura)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver lições"
                      >
                        <PlayCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleEditAbertura(abertura)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteAbertura(abertura.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {aberturasFiltradas.length === 0 && (
          <div className="text-center py-16 bg-gray-50">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-gray-400" size={40} />
            </div>
            <h3 className="font-interface font-bold text-xl text-gray-700 mb-3">
              Nenhuma abertura encontrada
            </h3>
            <p className="font-body text-gray-500 mb-8 text-lg">
              Tente ajustar os filtros ou criar uma nova abertura
            </p>
            <button 
              onClick={handleCreateAbertura}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-interface font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
            >
              <Plus size={20} />
              Nova Abertura
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm font-medium text-gray-600 uppercase tracking-wide">Total</p>
              <p className="font-title text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm font-medium text-gray-600 uppercase tracking-wide">Ativas</p>
              <p className="font-title text-3xl font-bold text-green-600 mt-2">
                {stats.ativas}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="text-white" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm font-medium text-gray-600 uppercase tracking-wide">Rascunhos</p>
              <p className="font-title text-3xl font-bold text-yellow-600 mt-2">
                {stats.rascunhos}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Edit className="text-white" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm font-medium text-gray-600 uppercase tracking-wide">Arquivadas</p>
              <p className="font-title text-3xl font-bold text-gray-600 mt-2">
                {stats.arquivadas}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="text-white" size={24} />
            </div>
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