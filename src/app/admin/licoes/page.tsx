'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Target,
  Loader2,
  X,
  CheckCircle,
  Crown,
  ArrowLeft,
  GripVertical,
  AlertCircle
} from 'lucide-react';
import { useLicoes, type Licao, type LicaoFormData } from '@/hooks/useLicoes';
import { useAberturas } from '@/hooks/useAberturas';
import LicaoForm from '@/components/LicaoForm';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente para item de lição arrastável
function SortableLicaoItem({ 
  licao, 
  aberturaName, 
  onEdit, 
  onDelete,
  isCurrentAbertura = false 
}: {
  licao: Licao;
  aberturaName: string;
  onEdit: (licao: Licao) => void;
  onDelete: (id: string) => void;
  isCurrentAbertura?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: licao.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border rounded-xl p-4 transition-all duration-200 
        ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : 'shadow-sm hover:shadow-md border-gray-200'}
        ${isCurrentAbertura ? 'ring-1 ring-blue-200 bg-blue-50/30' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </div>

        {/* Ordem */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-sm font-bold">{licao.ordem}</span>
          </div>
        </div>

        {/* Informações da Lição */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-title text-lg font-bold text-gray-900 truncate">
              {licao.titulo}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(licao.status)}`}>
              {licao.status}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Crown size={14} />
              <span className="truncate">{aberturaName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{licao.estimativaTempo}min</span>
            </div>
            <div className="flex items-center gap-1">
              <Target size={14} />
              <span>{licao.pontuacao}pts</span>
            </div>
            <div className={`font-medium ${getDificuldadeColor(licao.dificuldade)}`}>
              {licao.dificuldade}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(licao)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(licao.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminLicoesContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAbertura, setFilterAbertura] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');
  
  // Estados para o formulário
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLicao, setEditingLicao] = useState<Licao | null>(null);
  const [initialFormData, setInitialFormData] = useState<LicaoFormData | undefined>(undefined);

  const {
    licoes,
    loading,
    error,
    createLicao,
    updateLicao,
    deleteLicao,
    clearError,
    reorderLicoes
  } = useLicoes();

  const { aberturas } = useAberturas();

  // Sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      const licaoToEdit = licoes.find(l => l.id === editParam);
      if (licaoToEdit) {
        handleEditLicao(licaoToEdit);
      }
      window.history.replaceState({}, '', '/admin/licoes');
    }
  }, [searchParams, licoes]);

  // Filtrar lições
  const licoesFiltradas = licoes.filter(licao => {
    const matchesSearch = licao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         licao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAbertura = filterAbertura === 'all' || licao.aberturaId === filterAbertura;
    const matchesDificuldade = filterDificuldade === 'all' || licao.dificuldade === filterDificuldade;
    
    return matchesSearch && matchesAbertura && matchesDificuldade;
  });

  // Agrupar por abertura se nenhum filtro específico
  const licoesAgrupadas = filterAbertura === 'all' 
    ? aberturas.map(abertura => ({
        abertura,
        licoes: licoesFiltradas
          .filter(l => l.aberturaId === abertura.id)
          .sort((a, b) => a.ordem - b.ordem)
      })).filter(group => group.licoes.length > 0)
    : [{
        abertura: aberturas.find(a => a.id === filterAbertura),
        licoes: licoesFiltradas.sort((a, b) => a.ordem - b.ordem)
      }].filter(group => group.abertura && group.licoes.length > 0);

  const getAberturaName = (aberturaId: string) => {
    const abertura = aberturas.find(a => a.id === aberturaId);
    return abertura?.nome || 'Abertura não encontrada';
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

  // Handle drag end para reordenar lições
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Encontrar a abertura das lições sendo reordenadas
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeLicao = licoes.find(l => l.id === activeId);
    const overLicao = licoes.find(l => l.id === overId);
    
    if (!activeLicao || !overLicao || activeLicao.aberturaId !== overLicao.aberturaId) {
      return; // Só permite reordenar dentro da mesma abertura
    }

    const aberturaId = activeLicao.aberturaId;
    const licoesAbertura = licoes
      .filter(l => l.aberturaId === aberturaId)
      .sort((a, b) => a.ordem - b.ordem);
    
    const oldIndex = licoesAbertura.findIndex(l => l.id === activeId);
    const newIndex = licoesAbertura.findIndex(l => l.id === overId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedLicoes = arrayMove(licoesAbertura, oldIndex, newIndex);
      
      // Atualizar as ordens
      const updatedLicoes = reorderedLicoes.map((licao, index) => ({
        ...licao,
        ordem: index + 1
      }));
      
      // Chamar função de reordenação
      reorderLicoes(aberturaId, updatedLicoes);
    }
  };

  // Estatísticas
  const totalLicoes = licoes.length;
  const licoesAtivas = licoes.filter(l => l.status === 'Ativo').length;
  const licoesPorDificuldade = {
    iniciante: licoes.filter(l => l.dificuldade === 'Iniciante').length,
    intermediario: licoes.filter(l => l.dificuldade === 'Intermediário').length,
    avancado: licoes.filter(l => l.dificuldade === 'Avançado').length,
  };

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
              Gerenciamento de Lições
            </h1>
            <p className="font-body text-gray-600 mt-1">
              Organize o conteúdo educativo das aberturas em lições estruturadas
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleCreateLicao}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Nova Lição
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total</p>
              <p className="font-title text-2xl font-bold text-blue-600">{totalLicoes}</p>
            </div>
            <BookOpen className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Ativas</p>
              <p className="font-title text-2xl font-bold text-green-600">{licoesAtivas}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Iniciantes</p>
              <p className="font-title text-2xl font-bold text-green-600">{licoesPorDificuldade.iniciante}</p>
            </div>
            <Target className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Avançadas</p>
              <p className="font-title text-2xl font-bold text-red-600">{licoesPorDificuldade.avancado}</p>
            </div>
            <Target className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar lições
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
              onChange={(e) => setFilterAbertura(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Todas as aberturas</option>
              {aberturas.map(abertura => (
                <option key={abertura.id} value={abertura.id}>
                  {abertura.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificuldade
            </label>
            <select
              value={filterDificuldade}
              onChange={(e) => setFilterDificuldade(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Todas as dificuldades</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterAbertura('all');
                setFilterDificuldade('all');
              }}
              className="w-full px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Lições Agrupadas */}
      <div className="space-y-6">
        {licoesAgrupadas.map(({ abertura, licoes: licoesAbertura }) => (
          <div key={abertura?.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header da Abertura */}
            <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Crown className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h2 className="font-title text-xl font-bold text-gray-900">
                      {abertura?.nome}
                    </h2>
                    <p className="font-body text-sm text-gray-600">
                      {licoesAbertura.length} lições • {abertura?.categoria}
                    </p>
                  </div>
                </div>
                
                <Link
                  href={`/admin/licoes?create=true&aberturaId=${abertura?.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Nova Lição
                </Link>
              </div>
            </div>

            {/* Lista de Lições com Drag and Drop */}
            <div className="p-6">
              {licoesAbertura.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={licoesAbertura.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {licoesAbertura.map(licao => (
                        <SortableLicaoItem
                          key={licao.id}
                          licao={licao}
                          aberturaName={getAberturaName(licao.aberturaId)}
                          onEdit={handleEditLicao}
                          onDelete={handleDeleteLicao}
                          isCurrentAbertura={filterAbertura === licao.aberturaId}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4" />
                  <p className="font-body">Nenhuma lição encontrada</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {licoesAgrupadas.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="font-title text-xl font-bold text-gray-900 mb-2">
              Nenhuma lição encontrada
            </h3>
            <p className="font-body text-gray-600 mb-6">
              Ajuste os filtros ou crie uma nova lição para começar.
            </p>
            <button
              onClick={handleCreateLicao}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus size={18} />
              Criar Primeira Lição
            </button>
          </div>
        )}
      </div>

      {/* Modal do Formulário */}
      {isFormOpen && (
        <LicaoForm
          initialData={initialFormData}
          isEditing={!!editingLicao}
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
      <AdminLicoesContent />
    </Suspense>
  )
}
