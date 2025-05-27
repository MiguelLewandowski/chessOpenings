'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Save,
  Loader2,
  Plus,
  Trash2,
  Play,
  BookOpen,
  Info,
  Lightbulb,
  Target
} from 'lucide-react';
import { type LicaoFormData, type Licao } from '@/types/licoes';
import { useAberturas } from '@/hooks/useAberturas';

interface LicaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LicaoFormData) => Promise<void>;
  initialData?: LicaoFormData;
  loading?: boolean;
}

type TabType = 'basico' | 'conteudo' | 'movimentos' | 'configuracoes';

export default function LicaoForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false
}: LicaoFormProps) {
  const { aberturas } = useAberturas();
  
  const [formData, setFormData] = useState<LicaoFormData>({
    titulo: '',
    descricao: '',
    aberturaId: '',
    ordem: 1,
    tipo: 'Visualização',
    dificuldade: 'Iniciante',
    status: 'Rascunho',
    conteudo: {
      introducao: '',
      explicacao: '',
      movimentos: [],
      dicas: [],
      conclusao: ''
    },
    exercicios: [],
    estimativaTempo: 15,
    pontuacao: 100,
    prerequisitos: []
  });

  const [activeTab, setActiveTab] = useState<TabType>('basico');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form quando não há dados iniciais
      setFormData({
        titulo: '',
        descricao: '',
        aberturaId: '',
        ordem: 1,
        tipo: 'Visualização',
        dificuldade: 'Iniciante',
        status: 'Rascunho',
        conteudo: {
          introducao: '',
          explicacao: '',
          movimentos: [],
          dicas: [],
          conclusao: ''
        },
        exercicios: [],
        estimativaTempo: 15,
        pontuacao: 100,
        prerequisitos: []
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addDica = () => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        dicas: [...prev.conteudo.dicas, '']
      }
    }));
  };

  const updateDica = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        dicas: prev.conteudo.dicas.map((dica, i) => i === index ? value : dica)
      }
    }));
  };

  const removeDica = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        dicas: prev.conteudo.dicas.filter((_, i) => i !== index)
      }
    }));
  };

  const addMovimento = () => {
    const novoMovimento = {
      id: Math.random().toString(36).substr(2, 9),
      movimento: '',
      posicaoFEN: '',
      explicacao: ''
    };
    
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        movimentos: [...prev.conteudo.movimentos, novoMovimento]
      }
    }));
  };

  const updateMovimento = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        movimentos: prev.conteudo.movimentos.map((mov, i) => 
          i === index ? { ...mov, [field]: value } : mov
        )
      }
    }));
  };

  const removeMovimento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        movimentos: prev.conteudo.movimentos.filter((_, i) => i !== index)
      }
    }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basico' as TabType, label: 'Dados Básicos', icon: Info },
    { id: 'conteudo' as TabType, label: 'Conteúdo', icon: BookOpen },
    { id: 'movimentos' as TabType, label: 'Movimentos', icon: Play },
    { id: 'configuracoes' as TabType, label: 'Configurações', icon: Target }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="font-title text-xl font-bold text-gray-900">
              {initialData ? 'Editar Lição' : 'Nova Lição'}
            </h2>
            <p className="font-body text-sm text-gray-600 mt-1">
              {initialData ? 'Modifique os dados da lição' : 'Crie uma nova lição interativa'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 font-interface font-semibold text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Tab: Dados Básicos */}
              {activeTab === 'basico' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Título da Lição *
                      </label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Introdução à Abertura Italiana"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Abertura *
                      </label>
                      <select
                        value={formData.aberturaId}
                        onChange={(e) => setFormData(prev => ({ ...prev, aberturaId: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecione uma abertura</option>
                        {aberturas.map(abertura => (
                          <option key={abertura.id} value={abertura.id}>
                            {abertura.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva brevemente o que será abordado nesta lição..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as Licao['tipo'] }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Visualização">Visualização</option>
                        <option value="Interativo">Interativo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Dificuldade
                      </label>
                      <select
                        value={formData.dificuldade}
                        onChange={(e) => setFormData(prev => ({ ...prev, dificuldade: e.target.value as Licao['dificuldade'] }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Iniciante">Iniciante</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Licao['status'] }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Rascunho">Rascunho</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Arquivado">Arquivado</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Conteúdo */}
              {activeTab === 'conteudo' && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Introdução
                    </label>
                    <textarea
                      value={formData.conteudo.introducao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conteudo: { ...prev.conteudo, introducao: e.target.value }
                      }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Introduza o tópico da lição..."
                    />
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Explicação
                    </label>
                    <textarea
                      value={formData.conteudo.explicacao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conteudo: { ...prev.conteudo, explicacao: e.target.value }
                      }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Explique detalhadamente o conteúdo..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block font-interface font-semibold text-gray-700">
                        Dicas
                      </label>
                      <button
                        type="button"
                        onClick={addDica}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-interface font-semibold text-sm"
                      >
                        <Plus size={16} />
                        Adicionar Dica
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.conteudo.dicas.map((dica, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mt-2">
                            <Lightbulb size={16} />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={dica}
                              onChange={(e) => updateDica(index, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                              placeholder="Digite uma dica útil..."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDica(index)}
                            className="flex-shrink-0 text-red-400 hover:text-red-600 mt-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Conclusão
                    </label>
                    <textarea
                      value={formData.conteudo.conclusao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conteudo: { ...prev.conteudo, conclusao: e.target.value }
                      }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Resuma os pontos principais da lição..."
                    />
                  </div>
                </div>
              )}

              {/* Tab: Movimentos */}
              {activeTab === 'movimentos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-interface font-semibold text-gray-700">
                        Sequência de Movimentos
                      </h3>
                      <p className="font-body text-sm text-gray-500 mt-1">
                        Defina os movimentos que serão demonstrados na lição
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addMovimento}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} />
                      Adicionar Movimento
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.conteudo.movimentos.map((movimento, index) => (
                      <div key={movimento.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-blue-100 text-blue-700 text-sm font-interface font-semibold px-3 py-1 rounded">
                            Movimento {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMovimento(index)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-interface font-semibold text-gray-700 mb-2 text-sm">
                              Movimento
                            </label>
                            <input
                              type="text"
                              value={movimento.movimento}
                              onChange={(e) => updateMovimento(index, 'movimento', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: e4, Nf3, Bc4..."
                            />
                          </div>
                          
                          <div>
                            <label className="block font-interface font-semibold text-gray-700 mb-2 text-sm">
                              Posição FEN
                            </label>
                            <input
                              type="text"
                              value={movimento.posicaoFEN}
                              onChange={(e) => updateMovimento(index, 'posicaoFEN', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                              placeholder="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR..."
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block font-interface font-semibold text-gray-700 mb-2 text-sm">
                            Explicação
                          </label>
                          <textarea
                            value={movimento.explicacao}
                            onChange={(e) => updateMovimento(index, 'explicacao', e.target.value)}
                            rows={2}
                            className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                            placeholder="Explique a ideia por trás deste movimento..."
                          />
                        </div>
                      </div>
                    ))}
                    
                    {formData.conteudo.movimentos.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Play className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="font-interface font-semibold text-gray-600">
                          Nenhum movimento adicionado
                        </p>
                        <p className="font-body text-sm text-gray-500 mt-1">
                          Clique em &ldquo;Adicionar Movimento&rdquo; para começar
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Configurações */}
              {activeTab === 'configuracoes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Ordem na Abertura
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.ordem}
                        onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Estimativa de Tempo (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.estimativaTempo}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimativaTempo: parseInt(e.target.value) || 15 }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Pontuação
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.pontuacao}
                        onChange={(e) => setFormData(prev => ({ ...prev, pontuacao: parseInt(e.target.value) || 100 }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 font-interface font-semibold hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.titulo || !formData.aberturaId}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-interface font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {initialData ? 'Atualizar' : 'Criar'} Lição
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 