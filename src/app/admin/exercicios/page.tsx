'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Target,
  Trophy,
  Zap,
  Brain,
  Crown,
  Loader2,
  X,
  Timer,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useExercicios, type Exercicio } from '@/hooks/useExercicios';
import { useLicoes } from '@/hooks/useLicoes';
import { useAberturas } from '@/hooks/useAberturas';
import ExercicioForm from '@/components/ExercicioForm';
import { type ExercicioFormData } from '@/types/exercicios';
import Link from 'next/link';

function AdminExerciciosContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAbertura, setFilterAbertura] = useState<string>('all');
  const [filterLicao, setFilterLicao] = useState<string>('all');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');

  const {
    exercicios,
    loading,
    error,
    createExercicio,
    updateExercicio,
    deleteExercicio,
    clearError
  } = useExercicios();

  const { licoes } = useLicoes();
  const { aberturas } = useAberturas();

  const [showForm, setShowForm] = useState(false);
  const [editingExercicio, setEditingExercicio] = useState<Exercicio | null>(null);

  // Detectar parâmetros da URL
  useEffect(() => {
    const createParam = searchParams.get('create');
    const licaoIdParam = searchParams.get('licaoId');
    const editParam = searchParams.get('edit');
    
    if (createParam === 'true') {
      if (licaoIdParam) {
        const licao = licoes.find(l => l.id === licaoIdParam);
        if (licao) {
          setFilterAbertura(licao.aberturaId);
          setFilterLicao(licaoIdParam);
        }
      }
      setShowForm(true);
      window.history.replaceState({}, '', '/admin/exercicios');
    }
    
    if (editParam) {
      const exercicioToEdit = exercicios.find(e => e.id === editParam);
      if (exercicioToEdit) {
        handleEditExercicio(exercicioToEdit);
      }
      window.history.replaceState({}, '', '/admin/exercicios');
    }
  }, [searchParams, exercicios, licoes]);

  // Filtrar exercícios
  const exerciciosFiltrados = exercicios.filter(exercicio => {
    const licao = licoes.find(l => l.id === exercicio.licaoId);
    
    const matchesSearch = exercicio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercicio.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAbertura = filterAbertura === 'all' || licao?.aberturaId === filterAbertura;
    const matchesLicao = filterLicao === 'all' || exercicio.licaoId === filterLicao;
    const matchesTipo = filterTipo === 'all' || exercicio.tipo === filterTipo;
    const matchesDificuldade = filterDificuldade === 'all' || exercicio.dificuldade === filterDificuldade;
    
    return matchesSearch && matchesAbertura && matchesLicao && matchesTipo && matchesDificuldade;
  });

  // Agrupar exercícios por abertura e lição
  const exerciciosAgrupados = aberturas.map(abertura => {
    const licoesAbertura = licoes.filter(l => l.aberturaId === abertura.id);
    const licoesComExercicios = licoesAbertura.map(licao => {
      const exerciciosLicao = exerciciosFiltrados
        .filter(e => e.licaoId === licao.id)
        .sort((a, b) => a.ordem - b.ordem);
      
      return {
        licao,
        exercicios: exerciciosLicao
      };
    }).filter(grupo => grupo.exercicios.length > 0);

    return {
      abertura,
      licoes: licoesComExercicios
    };
  }).filter(grupo => grupo.licoes.length > 0);

  // Filtrar por abertura específica se selecionada
  const exerciciosExibir = filterAbertura === 'all' 
    ? exerciciosAgrupados 
    : exerciciosAgrupados.filter(grupo => grupo.abertura.id === filterAbertura);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Passivo': return 'bg-yellow-100 text-yellow-700';
      case 'Interativo': return 'bg-blue-100 text-blue-700';
      case 'Prático': return 'bg-green-100 text-green-700';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-700';
      case 'Arquivado': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTempo = (segundos?: number) => {
    if (!segundos) return '∞';
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

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

  // Estatísticas
  const totalExercicios = exercicios.length;
  const exerciciosAtivos = exercicios.filter(e => e.status === 'Ativo').length;
  const exerciciosPorTipo = {
    passivo: exercicios.filter(e => e.tipo === 'Passivo').length,
    interativo: exercicios.filter(e => e.tipo === 'Interativo').length,
    quiz: exercicios.filter(e => e.tipo === 'Quiz').length,
  };

  // Lições filtradas para o select
  const licoesParaFiltro = filterAbertura === 'all' 
    ? licoes 
    : licoes.filter(l => l.aberturaId === filterAbertura);

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700 font-body">{error}</p>
            </div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-title text-2xl sm:text-3xl font-bold text-gray-900">
              Gerenciamento de Exercícios
            </h1>
            <p className="font-body text-gray-600 mt-1">
              Crie exercícios práticos para reforçar o aprendizado das lições
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleCreateExercicio}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Novo Exercício
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total</p>
              <p className="font-title text-2xl font-bold text-blue-600">{totalExercicios}</p>
            </div>
            <Target className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Ativos</p>
              <p className="font-title text-2xl font-bold text-green-600">{exerciciosAtivos}</p>
            </div>
            <Zap className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Interativos</p>
              <p className="font-title text-2xl font-bold text-blue-600">{exerciciosPorTipo.interativo}</p>
            </div>
            <Brain className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Quizzes</p>
              <p className="font-title text-2xl font-bold text-purple-600">{exerciciosPorTipo.quiz}</p>
            </div>
            <Target className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar exercícios
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o título ou descrição..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Abertura
            </label>
            <select
              value={filterAbertura}
              onChange={(e) => {
                setFilterAbertura(e.target.value);
                setFilterLicao('all'); // Reset lição quando muda abertura
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Todas</option>
              {aberturas.map(abertura => (
                <option key={abertura.id} value={abertura.id}>
                  {abertura.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lição
            </label>
            <select
              value={filterLicao}
              onChange={(e) => setFilterLicao(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Todas</option>
              {licoesParaFiltro.map(licao => (
                <option key={licao.id} value={licao.id}>
                  {licao.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="Passivo">Passivo</option>
              <option value="Interativo">Interativo</option>
              <option value="Prático">Prático</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterAbertura('all');
                setFilterLicao('all');
                setFilterTipo('all');
                setFilterDificuldade('all');
              }}
              className="w-full px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Exercícios Agrupados */}
      <div className="space-y-6">
        {exerciciosExibir.map(({ abertura, licoes: licoesComExercicios }) => (
          <div key={abertura.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header da Abertura */}
            <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Crown className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h2 className="font-title text-xl font-bold text-gray-900">
                      {abertura.nome}
                    </h2>
                    <p className="font-body text-sm text-gray-600">
                      {licoesComExercicios.reduce((total, l) => total + l.exercicios.length, 0)} exercícios • {abertura.categoria}
                    </p>
                  </div>
                </div>
                
                <Link
                  href={`/admin/exercicios?create=true`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Novo Exercício
                </Link>
              </div>
            </div>

            {/* Lista de Lições com Exercícios */}
            <div className="p-6 space-y-6">
              {licoesComExercicios.map(({ licao, exercicios: exerciciosLicao }) => (
                <div key={licao.id} className="border border-gray-100 rounded-lg">
                  {/* Header da Lição */}
                  <div className="p-4 bg-gray-25 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-sm font-bold">{licao.ordem}</span>
                        </div>
                        <div>
                          <h3 className="font-title text-lg font-semibold text-gray-900">
                            {licao.titulo}
                          </h3>
                          <p className="font-body text-sm text-gray-600">
                            {exerciciosLicao.length} exercícios
                          </p>
                        </div>
                      </div>
                      
                      <Link
                        href={`/admin/exercicios?create=true&licaoId=${licao.id}`}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        <Plus size={16} />
                        Novo Exercício
                      </Link>
                    </div>
                  </div>

                  {/* Lista de Exercícios */}
                  <div className="p-4 space-y-3">
                    {exerciciosLicao.map(exercicio => (
                      <div 
                        key={exercicio.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-purple-600 text-sm font-bold">{exercicio.ordem}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-body text-md font-semibold text-gray-900 truncate">
                                {exercicio.titulo}
                              </h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoColor(exercicio.tipo)}`}>
                                {exercicio.tipo}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(exercicio.status)}`}>
                                {exercicio.status}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Timer size={14} />
                                <span>{formatTempo(exercicio.tempoLimite)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy size={14} />
                                <span>{exercicio.pontuacao}pts</span>
                              </div>
                              <div className={`font-medium ${getDificuldadeColor(exercicio.dificuldade)}`}>
                                {exercicio.dificuldade}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditExercicio(exercicio)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteExercicio(exercicio.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {exerciciosExibir.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <Target size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="font-title text-xl font-bold text-gray-900 mb-2">
              Nenhum exercício encontrado
            </h3>
            <p className="font-body text-gray-600 mb-6">
              Ajuste os filtros ou crie um novo exercício para começar.
            </p>
            <button
              onClick={handleCreateExercicio}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus size={18} />
              Criar Primeiro Exercício
            </button>
          </div>
        )}
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <ExercicioForm
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
          } : {
            licaoId: filterLicao !== 'all' ? filterLicao : ''
          }}
          isEditing={!!editingExercicio}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Carregando...</div>}>
      <AdminExerciciosContent />
    </Suspense>
  )
}
