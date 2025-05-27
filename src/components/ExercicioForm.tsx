'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Save,
  Loader2,
  Plus,
  Trash2,
  Target,
  BookOpen,
  Info,
  Trophy,
  Timer,
  CheckSquare
} from 'lucide-react';
import { type ExercicioFormData } from '@/types/exercicios';
import { useLicoes } from '@/hooks/useLicoes';

interface ExercicioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExercicioFormData) => Promise<void>;
  initialData?: ExercicioFormData;
  loading?: boolean;
}

type TabType = 'basico' | 'conteudo' | 'opcoes' | 'configuracoes';

export default function ExercicioForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false
}: ExercicioFormProps) {
  const { licoes } = useLicoes();
  
  const [formData, setFormData] = useState<ExercicioFormData>({
    titulo: '',
    descricao: '',
    licaoId: '',
    ordem: 1,
    tipo: 'Tático',
    dificuldade: 'Iniciante',
    status: 'Rascunho',
    conteudo: {
      posicaoInicial: '',
      contexto: '',
      pergunta: '',
      opcoes: [],
      explicacao: '',
      dicas: [],
      feedbackCorreto: '',
      feedbackIncorreto: ''
    },
    pontuacao: 50,
    tentativasMaximas: 3
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
        licaoId: '',
        ordem: 1,
        tipo: 'Tático',
        dificuldade: 'Iniciante',
        status: 'Rascunho',
        conteudo: {
          posicaoInicial: '',
          contexto: '',
          pergunta: '',
          opcoes: [],
          explicacao: '',
          dicas: [],
          feedbackCorreto: '',
          feedbackIncorreto: ''
        },
        pontuacao: 50,
        tentativasMaximas: 3
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

  const addOpcao = () => {
    const novaOpcao = {
      id: Math.random().toString(36).substr(2, 9),
      texto: '',
      correta: false
    };
    
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        opcoes: [...(prev.conteudo.opcoes || []), novaOpcao]
      }
    }));
  };

  const updateOpcao = (index: number, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        opcoes: (prev.conteudo.opcoes || []).map((opcao, i) => 
          i === index ? { ...opcao, [field]: value } : opcao
        )
      }
    }));
  };

  const removeOpcao = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        opcoes: (prev.conteudo.opcoes || []).filter((_, i) => i !== index)
      }
    }));
  };



  if (!isOpen) return null;

  const tabs = [
    { id: 'basico' as TabType, label: 'Dados Básicos', icon: Info },
    { id: 'conteudo' as TabType, label: 'Conteúdo', icon: BookOpen },
    { id: 'opcoes' as TabType, label: 'Opções', icon: CheckSquare },
    { id: 'configuracoes' as TabType, label: 'Configurações', icon: Target }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="font-title text-xl font-bold text-gray-900">
              {initialData ? 'Editar Exercício' : 'Novo Exercício'}
            </h2>
            <p className="font-body text-sm text-gray-600 mt-1">
              {initialData ? 'Modifique os dados do exercício' : 'Crie um novo exercício prático'}
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
                        Título do Exercício *
                      </label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Mate em 2 - Abertura Italiana"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Lição *
                      </label>
                      <select
                        value={formData.licaoId}
                        onChange={(e) => setFormData(prev => ({ ...prev, licaoId: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecione uma lição</option>
                        {licoes.map(licao => (
                          <option key={licao.id} value={licao.id}>
                            {licao.titulo}
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
                      placeholder="Descreva o objetivo do exercício..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Tipo
                      </label>
                                             <select
                         value={formData.tipo}
                         onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'Tático' | 'Estratégico' | 'Técnico' | 'Final' }))}
                         className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                       >
                        <option value="Tático">Tático</option>
                        <option value="Estratégico">Estratégico</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Final">Final</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Dificuldade
                      </label>
                      <select
                        value={formData.dificuldade}
                        onChange={(e) => setFormData(prev => ({ ...prev, dificuldade: e.target.value as 'Iniciante' | 'Intermediário' | 'Avançado' }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Ativo' | 'Rascunho' | 'Arquivado' }))}
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
                      Posição Inicial (FEN)
                    </label>
                    <input
                      type="text"
                      value={formData.conteudo.posicaoInicial}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conteudo: { ...prev.conteudo, posicaoInicial: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                    />
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Contexto
                    </label>
                    <textarea
                      value={formData.conteudo.contexto}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conteudo: { ...prev.conteudo, contexto: e.target.value }
                      }))}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contextualize a posição para o estudante..."
                    />
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Pergunta *
                    </label>
                    <textarea
                      value={formData.conteudo.pergunta}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conteudo: { ...prev.conteudo, pergunta: e.target.value }
                      }))}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Qual é a pergunta que o estudante deve responder?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Explicação da Resposta
                    </label>
                    <textarea
                      value={formData.conteudo.explicacao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conteudo: { ...prev.conteudo, explicacao: e.target.value }
                      }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Explique por que esta é a resposta correta..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Feedback - Resposta Correta
                      </label>
                      <textarea
                        value={formData.conteudo.feedbackCorreto}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          conteudo: { ...prev.conteudo, feedbackCorreto: e.target.value }
                        }))}
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mensagem para resposta correta..."
                      />
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Feedback - Resposta Incorreta
                      </label>
                      <textarea
                        value={formData.conteudo.feedbackIncorreto}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          conteudo: { ...prev.conteudo, feedbackIncorreto: e.target.value }
                        }))}
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mensagem para resposta incorreta..."
                      />
                    </div>
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
                </div>
              )}

              {/* Tab: Opções */}
              {activeTab === 'opcoes' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-interface font-semibold text-gray-700">
                        Opções de Resposta
                      </h3>
                      <p className="font-body text-sm text-gray-500 mt-1">
                        Configure as opções de múltipla escolha para o exercício
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addOpcao}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} />
                      Adicionar Opção
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(formData.conteudo.opcoes || []).map((opcao, index) => (
                      <div key={opcao.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-blue-100 text-blue-700 text-sm font-interface font-semibold px-3 py-1 rounded">
                            Opção {index + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 font-interface font-semibold text-sm">
                              <input
                                type="checkbox"
                                checked={opcao.correta}
                                onChange={(e) => updateOpcao(index, 'correta', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              Resposta Correta
                            </label>
                            <button
                              type="button"
                              onClick={() => removeOpcao(index)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block font-interface font-semibold text-gray-700 mb-2 text-sm">
                              Texto da Opção
                            </label>
                            <input
                              type="text"
                              value={opcao.texto}
                              onChange={(e) => updateOpcao(index, 'texto', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: Ng5, Qf3, d4..."
                            />
                          </div>
                          
                          {opcao.movimento && (
                            <div>
                              <label className="block font-interface font-semibold text-gray-700 mb-2 text-sm">
                                Movimento (notação)
                              </label>
                              <input
                                type="text"
                                value={opcao.movimento}
                                onChange={(e) => updateOpcao(index, 'movimento', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Ng5"
                              />
                            </div>
                          )}
                          
                          {opcao.explicacao && (
                            <div>
                              <label className="block font-interface font-semibold text-gray-700 mb-2 text-sm">
                                Explicação da Opção
                              </label>
                              <textarea
                                value={opcao.explicacao}
                                onChange={(e) => updateOpcao(index, 'explicacao', e.target.value)}
                                rows={2}
                                className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                                placeholder="Por que esta opção está certa ou errada..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {(!formData.conteudo.opcoes || formData.conteudo.opcoes.length === 0) && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <CheckSquare className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="font-interface font-semibold text-gray-600">
                          Nenhuma opção adicionada
                        </p>
                        <p className="font-body text-sm text-gray-500 mt-1">
                          Clique em &ldquo;Adicionar Opção&rdquo; para começar
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
                        Ordem na Lição
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
                        Pontuação
                      </label>
                      <div className="relative">
                        <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          min="0"
                          value={formData.pontuacao}
                          onChange={(e) => setFormData(prev => ({ ...prev, pontuacao: parseInt(e.target.value) || 50 }))}
                          className="w-full pl-10 pr-4 p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-interface font-semibold text-gray-700 mb-2">
                        Tentativas Máximas
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.tentativasMaximas}
                        onChange={(e) => setFormData(prev => ({ ...prev, tentativasMaximas: parseInt(e.target.value) || 3 }))}
                        className="w-full p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Tempo Limite (segundos)
                    </label>
                    <div className="relative">
                      <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        min="0"
                        value={formData.tempoLimite || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          tempoLimite: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="w-full pl-10 pr-4 p-3 border border-gray-300 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
                        placeholder="Deixe vazio para sem limite"
                      />
                    </div>
                    <p className="font-body text-xs text-gray-500 mt-1">
                      Deixe vazio para exercícios sem limite de tempo
                    </p>
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
              disabled={loading || !formData.titulo || !formData.licaoId || !formData.conteudo.pergunta}
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
                  {initialData ? 'Atualizar' : 'Criar'} Exercício
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 