'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Target,
  MoreVertical,
  Loader2,
  X,
  CheckCircle,
  Info
} from 'lucide-react';
import { useLicoes, type Licao, type LicaoFormData } from '@/hooks/useLicoes';
import { useAberturas } from '@/hooks/useAberturas';
import LicaoForm from '@/components/LicaoForm';

export default function GerenciamentoLicoes() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAbertura, setFilterAbertura] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');
  
  // Estados para o formulário
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLicao, setEditingLicao] = useState<Licao | null>(null);
  const [initialFormData, setInitialFormData] = useState<LicaoFormData | undefined>(undefined);

  const {
    loading,
    error,
    createLicao,
    updateLicao,
    deleteLicao,
    filterLicoes,
    getStats,
    clearError
  } = useLicoes();

  const { aberturas } = useAberturas();

  // Detectar parâmetros da URL para abrir formulário automaticamente
  useEffect(() => {
    const createParam = searchParams.get('create');
    const aberturaIdParam = searchParams.get('aberturaId');
    const editParam = searchParams.get('edit');
    
    if (createParam === 'true') {
      const formData: LicaoFormData = {
        titulo: '',
        descricao: '',
        aberturaId: aberturaIdParam || '',
        ordem: 1,
        dificuldade: 'Iniciante',
        status: 'Ativo',
        exercicios: [],
        estimativaTempo: 15,
        pontuacao: 100,
        prerequisitos: []
      };
      
      setInitialFormData(formData);
      setEditingLicao(null);
      setIsFormOpen(true);
      
      // Pre-selecionar a abertura no filtro se especificada
      if (aberturaIdParam) {
        setFilterAbertura(aberturaIdParam);
      }
      
      // Limpar URL
      window.history.replaceState({}, '', '/admin/licoes');
    }
    
    if (editParam) {
      // TODO: Implementar edição quando necessário
      window.history.replaceState({}, '', '/admin/licoes');
    }
  }, [searchParams]);

  // Dados filtrados usando o hook
  const licoesFiltradas = filterLicoes(searchTerm, filterAbertura, filterDificuldade);
  const stats = getStats();

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

  const getAberturaName = (aberturaId: string) => {
    const abertura = aberturas.find(a => a.id === aberturaId);
    return abertura?.nome || 'Abertura não encontrada';
  };

  const formatTempo = (minutos: number) => {
    if (minutos < 60) return `${minutos}min`;
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h ${minutosRestantes}min`;
  };

  // Funções do formulário
  const handleCreateLicao = () => {
    setInitialFormData(undefined);
    setEditingLicao(null);
    setIsFormOpen(true);
  };

  const handleEditLicao = (licao: Licao) => {
    const formData: LicaoFormData = {
      titulo: licao.titulo,
      descricao: licao.descricao,
      aberturaId: licao.aberturaId,
      ordem: licao.ordem,
      dificuldade: licao.dificuldade,
      status: licao.status,
      exercicios: licao.exercicios,
      estimativaTempo: licao.estimativaTempo,
      pontuacao: licao.pontuacao,
      prerequisitos: licao.prerequisitos
    };
    
    setInitialFormData(formData);
    setEditingLicao(licao);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLicao(null);
    setInitialFormData(undefined);
  };

  const handleSubmitForm = async (data: LicaoFormData) => {
    try {
      if (editingLicao) {
        await updateLicao(editingLicao.id, data);
      } else {
        await createLicao(data);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Erro ao salvar lição:', err);
    }
  };

  const handleDeleteLicao = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta lição?')) {
      try {
        await deleteLicao(id);
      } catch (err) {
        console.error('Erro ao deletar lição:', err);
      }
    }
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
            Gerenciamento de Lições
          </h1>
          <p className="font-body text-gray-600 mt-2">
            Organize o conteúdo educativo das aberturas em lições estruturadas
          </p>
        </div>
        <button 
          onClick={handleCreateLicao}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Nova Lição
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Tempo Total</p>
              <p className="font-title text-2xl font-bold text-purple-600">
                {formatTempo(stats.tempoTotal)}
              </p>
            </div>
            <Clock className="text-purple-500" size={24} />
          </div>
        </div>
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
                placeholder="Buscar lições..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <select
              value={filterAbertura}
              onChange={(e) => setFilterAbertura(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as aberturas</option>
              {aberturas.map(abertura => (
                <option key={abertura.id} value={abertura.id}>
                  {abertura.nome}
                </option>
              ))}
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

      {/* Lista de Lições */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Lição</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Abertura</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Dificuldade</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Tempo</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Exercícios</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Status</th>
                <th className="text-right p-4 font-interface font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {licoesFiltradas.map((licao) => (
                <tr key={licao.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <h3 className="font-interface font-semibold text-gray-900">{licao.titulo}</h3>
                      <p className="font-body text-sm text-gray-600 mt-1">
                        {licao.descricao}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-interface font-semibold px-2 py-1 rounded">
                          Ordem: {licao.ordem}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {licao.pontuacao} pontos
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-gray-700">
                      {getAberturaName(licao.aberturaId)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`font-body text-sm font-semibold ${getDificuldadeColor(licao.dificuldade)}`}>
                      {licao.dificuldade}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-purple-600">
                      <Clock size={14} />
                      <span className="font-body text-sm">{licao.estimativaTempo}min</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Target size={14} />
                      <span className="font-body text-sm font-semibold">{licao.exercicios.length}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-interface font-semibold ${getStatusColor(licao.status)}`}>
                      {licao.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <Info size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditLicao(licao)}
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteLicao(licao.id)}
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
        {licoesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="font-interface font-semibold text-gray-700 mb-2">
              Nenhuma lição encontrada
            </h3>
            <p className="font-body text-gray-500 mb-6">
              Tente ajustar os filtros ou criar uma nova lição
            </p>
            <button 
              onClick={handleCreateLicao}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus size={18} />
              Nova Lição
            </button>
          </div>
        )}
      </div>

      {/* Modal do Formulário */}
      <LicaoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={initialFormData}
        loading={loading}
      />
    </div>
  );
} 