'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Target,
  Trophy,
  Zap,
  Brain,
  Crown,
  MoreVertical,
  Loader2,
  X,
  Timer
} from 'lucide-react';
import { useExercicios, type Exercicio } from '@/hooks/useExercicios';
import { useLicoes } from '@/hooks/useLicoes';
import ExercicioForm from '@/components/ExercicioForm';
import { type ExercicioFormData } from '@/types/exercicios';

export default function GerenciamentoExercicios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLicao, setFilterLicao] = useState<string>('all');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');

  const {
    loading,
    error,
    createExercicio,
    updateExercicio,
    deleteExercicio,
    filterExercicios,
    getStats,
    clearError
  } = useExercicios();

  const { licoes } = useLicoes();

  // Dados filtrados usando o hook
  const exerciciosFiltrados = filterExercicios(searchTerm, filterLicao, filterTipo, filterDificuldade);
  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-700';
      case 'Arquivado': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Tático': return <Zap className="text-yellow-500" size={16} />;
      case 'Estratégico': return <Brain className="text-blue-500" size={16} />;
      case 'Técnico': return <Target className="text-green-500" size={16} />;
      case 'Final': return <Crown className="text-purple-500" size={16} />;
      default: return <Target className="text-gray-500" size={16} />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Tático': return 'bg-yellow-100 text-yellow-700';
      case 'Estratégico': return 'bg-blue-100 text-blue-700';
      case 'Técnico': return 'bg-green-100 text-green-700';
      case 'Final': return 'bg-purple-100 text-purple-700';
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

  const getLicaoName = (licaoId: string) => {
    const licao = licoes.find(l => l.id === licaoId);
    return licao?.titulo || 'Lição não encontrada';
  };

  const formatTempo = (segundos?: number) => {
    if (!segundos) return '∞';
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  const [showForm, setShowForm] = useState(false);
  const [editingExercicio, setEditingExercicio] = useState<Exercicio | null>(null);

  const handleCreateExercicio = () => {
    setEditingExercicio(null);
    setShowForm(true);
  };

  const handleEditExercicio = (exercicio: Exercicio) => {
    setEditingExercicio(exercicio);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExercicio(null);
  };

  const handleSubmitForm = async (data: ExercicioFormData) => {
    try {
      if (editingExercicio) {
        await updateExercicio(editingExercicio.id, data);
      } else {
        await createExercicio(data);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Erro ao salvar exercício:', err);
    }
  };

  const handleDeleteExercicio = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este exercício?')) {
      try {
        await deleteExercicio(id);
      } catch (err) {
        console.error('Erro ao deletar exercício:', err);
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
            Gerenciamento de Exercícios
          </h1>
          <p className="font-body text-gray-600 mt-2">
            Crie exercícios práticos para reforçar o aprendizado das lições
          </p>
        </div>
        <button 
          onClick={handleCreateExercicio}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Novo Exercício
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total</p>
              <p className="font-title text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Target className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Passivos</p>
              <p className="font-title text-2xl font-bold text-yellow-600">
                {stats.passivos}
              </p>
            </div>
            <Zap className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Interativos</p>
              <p className="font-title text-2xl font-bold text-blue-600">
                {stats.interativos}
              </p>
            </div>
            <Brain className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Quiz</p>
              <p className="font-title text-2xl font-bold text-purple-600">
                {stats.quiz}
              </p>
            </div>
            <Crown className="text-purple-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Pontuação</p>
              <p className="font-title text-2xl font-bold text-orange-600">
                {stats.pontuacaoTotal}
              </p>
            </div>
            <Trophy className="text-orange-500" size={24} />
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
                placeholder="Buscar exercícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <select
              value={filterLicao}
              onChange={(e) => setFilterLicao(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as lições</option>
              {licoes.map(licao => (
                <option key={licao.id} value={licao.id}>
                  {licao.titulo}
                </option>
              ))}
            </select>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="Tático">Tático</option>
              <option value="Estratégico">Estratégico</option>
              <option value="Técnico">Técnico</option>
              <option value="Final">Final</option>
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

      {/* Lista de Exercícios */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Exercício</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Lição</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Tipo</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Dificuldade</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Pontuação</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Tempo</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Status</th>
                <th className="text-right p-4 font-interface font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exerciciosFiltrados.map((exercicio) => (
                <tr key={exercicio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <h3 className="font-interface font-semibold text-gray-900">{exercicio.titulo}</h3>
                      <p className="font-body text-sm text-gray-600 mt-1">
                        {exercicio.descricao}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-interface font-semibold px-2 py-1 rounded">
                          Ordem: {exercicio.ordem}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Máx: {exercicio.tentativasMaximas} tentativas
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-gray-700">
                      {getLicaoName(exercicio.licaoId)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(exercicio.tipo)}
                      <span className={`px-2 py-1 rounded-full text-xs font-interface font-semibold ${getTipoColor(exercicio.tipo)}`}>
                        {exercicio.tipo}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-body text-sm font-semibold ${getDificuldadeColor(exercicio.dificuldade)}`}>
                      {exercicio.dificuldade}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-orange-600">
                      <Trophy size={14} />
                      <span className="font-body text-sm font-semibold">{exercicio.pontuacao}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Timer size={14} />
                      <span className="font-body text-sm">{formatTempo(exercicio.tempoLimite)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-interface font-semibold ${getStatusColor(exercicio.status)}`}>
                      {exercicio.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditExercicio(exercicio)}
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteExercicio(exercicio.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
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
        {exerciciosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="font-interface font-semibold text-gray-700 mb-2">
              Nenhum exercício encontrado
            </h3>
            <p className="font-body text-gray-500 mb-6">
              Tente ajustar os filtros ou criar um novo exercício
            </p>
            <button 
              onClick={handleCreateExercicio}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus size={18} />
              Novo Exercício
            </button>
          </div>
        )}
      </div>

      {/* Modal do Formulário */}
      <ExercicioForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={editingExercicio ? {
          titulo: editingExercicio.titulo,
          descricao: editingExercicio.descricao,
          licaoId: editingExercicio.licaoId,
          ordem: editingExercicio.ordem,
          tipo: editingExercicio.tipo,
          dificuldade: editingExercicio.dificuldade,
          status: editingExercicio.status,
          conteudo: editingExercicio.conteudo,
          pontuacao: editingExercicio.pontuacao,
          tentativasMaximas: editingExercicio.tentativasMaximas,
          tempoLimite: editingExercicio.tempoLimite
        } : undefined}
        loading={loading}
      />
    </div>
  );
} 