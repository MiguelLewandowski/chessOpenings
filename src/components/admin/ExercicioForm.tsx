'use client';

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Exercicio, ExercicioFormData, Lance, OpcaoQuiz } from '@/types/exercicios';
import { Licao } from '@/types/licoes';

interface ExercicioFormProps {
  exercicio?: Exercicio;
  licoes: Licao[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExercicioFormData) => void;
  licaoIdPreSelected?: string;
}

export default function ExercicioForm({ 
  exercicio, 
  licoes, 
  isOpen, 
  onClose, 
  onSave, 
  licaoIdPreSelected 
}: ExercicioFormProps) {
  const [formData, setFormData] = useState<ExercicioFormData>({
    titulo: '',
    descricao: '',
    licaoId: licaoIdPreSelected || '',
    ordem: 1,
    tipo: 'Passivo',
    status: 'Ativo',
    conteudo: {
      contexto: '',
      explicacaoFinal: ''
    },
    pontuacao: 10
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (exercicio) {
      setFormData({
        titulo: exercicio.titulo,
        descricao: exercicio.descricao,
        licaoId: exercicio.licaoId,
        ordem: exercicio.ordem,
        tipo: exercicio.tipo,
        status: exercicio.status,
        conteudo: exercicio.conteudo,
        pontuacao: exercicio.pontuacao
      });
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        licaoId: licaoIdPreSelected || '',
        ordem: 1,
        tipo: 'Passivo',
        status: 'Ativo',
        conteudo: {
          contexto: '',
          explicacaoFinal: ''
        },
        pontuacao: 10
      });
    }
    setErrors({});
  }, [exercicio, isOpen, licaoIdPreSelected]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.licaoId) {
      newErrors.licaoId = 'Lição é obrigatória';
    }

    if (!formData.conteudo.contexto.trim()) {
      newErrors.contexto = 'Contexto é obrigatório';
    }

    if (!formData.conteudo.explicacaoFinal.trim()) {
      newErrors.explicacaoFinal = 'Explicação final é obrigatória';
    }

    if (formData.tipo === 'Quiz') {
      if (!formData.conteudo.pergunta?.trim()) {
        newErrors.pergunta = 'Pergunta é obrigatória para exercícios Quiz';
      }
      if (!formData.conteudo.opcoes || formData.conteudo.opcoes.length < 2) {
        newErrors.opcoes = 'Quiz deve ter pelo menos 2 opções';
      }
      if (formData.conteudo.opcoes && !formData.conteudo.opcoes.some(o => o.correta)) {
        newErrors.opcoes = 'Quiz deve ter pelo menos uma opção correta';
      }
    }

    if ((formData.tipo === 'Passivo' || formData.tipo === 'Interativo') && 
        (!formData.conteudo.lances || formData.conteudo.lances.length === 0)) {
      newErrors.lances = 'Exercícios Passivos e Interativos devem ter pelo menos um lance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
  };

  const adicionarLance = () => {
    const novosLances = [...(formData.conteudo.lances || [])];
    novosLances.push({
      id: Date.now().toString(),
      movimento: '',
      posicaoResultante: '',
      explicacao: '',
      ordem: novosLances.length + 1
    });
    
    setFormData({
      ...formData,
      conteudo: {
        ...formData.conteudo,
        lances: novosLances
      }
    });
  };

  const removerLance = (index: number) => {
    const novosLances = [...(formData.conteudo.lances || [])];
    novosLances.splice(index, 1);
    // Reordenar
    novosLances.forEach((lance, i) => {
      lance.ordem = i + 1;
    });
    
    setFormData({
      ...formData,
      conteudo: {
        ...formData.conteudo,
        lances: novosLances
      }
    });
  };

  const atualizarLance = (index: number, lance: Partial<Lance>) => {
    const novosLances = [...(formData.conteudo.lances || [])];
    novosLances[index] = { ...novosLances[index], ...lance };
    
    setFormData({
      ...formData,
      conteudo: {
        ...formData.conteudo,
        lances: novosLances
      }
    });
  };

  const adicionarOpcao = () => {
    const novasOpcoes = [...(formData.conteudo.opcoes || [])];
    novasOpcoes.push({
      id: Date.now().toString(),
      texto: '',
      correta: false,
      explicacao: ''
    });
    
    setFormData({
      ...formData,
      conteudo: {
        ...formData.conteudo,
        opcoes: novasOpcoes
      }
    });
  };

  const removerOpcao = (index: number) => {
    const novasOpcoes = [...(formData.conteudo.opcoes || [])];
    novasOpcoes.splice(index, 1);
    
    setFormData({
      ...formData,
      conteudo: {
        ...formData.conteudo,
        opcoes: novasOpcoes
      }
    });
  };

  const atualizarOpcao = (index: number, opcao: Partial<OpcaoQuiz>) => {
    const novasOpcoes = [...(formData.conteudo.opcoes || [])];
    novasOpcoes[index] = { ...novasOpcoes[index], ...opcao };
    
    setFormData({
      ...formData,
      conteudo: {
        ...formData.conteudo,
        opcoes: novasOpcoes
      }
    });
  };

  if (!isOpen) return null;

  const licaoSelected = licoes.find(l => l.id === formData.licaoId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {exercicio ? 'Editar Exercício' : 'Novo Exercício'}
          </h2>
          <button
            onClick={onClose}
            className="admin-button p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna Esquerda - Informações Básicas */}
            <div className="space-y-6">
              {/* Lição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lição *
                </label>
                <select
                  value={formData.licaoId}
                  onChange={(e) => setFormData({ ...formData, licaoId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-interactive ${
                    errors.licaoId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!!licaoIdPreSelected}
                >
                  <option value="">Selecione uma lição</option>
                  {licoes.map((licao) => (
                    <option key={licao.id} value={licao.id}>
                      {licao.titulo}
                    </option>
                  ))}
                </select>
                {licaoSelected && (
                  <p className="mt-1 text-sm text-gray-500">
                    Ordem: {licaoSelected.ordem}
                  </p>
                )}
                {errors.licaoId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.licaoId}
                  </p>
                )}
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Exercício *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.titulo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Desenvolvimento das Peças"
                />
                {errors.titulo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.titulo}
                  </p>
                )}
              </div>

              {/* Tipo e Ordem */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Exercício
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tipo: e.target.value as 'Passivo' | 'Quiz' | 'Interativo',
                      conteudo: {
                        contexto: formData.conteudo.contexto,
                        explicacaoFinal: formData.conteudo.explicacaoFinal
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-interactive"
                  >
                    <option value="Passivo">Passivo (Demonstração)</option>
                    <option value="Quiz">Quiz (Múltipla Escolha)</option>
                    <option value="Interativo">Interativo (Movimento)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Descrição opcional do exercício..."
                />
              </div>

              {/* Contexto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contexto *
                </label>
                <textarea
                  value={formData.conteudo.contexto}
                  onChange={(e) => setFormData({
                    ...formData,
                    conteudo: { ...formData.conteudo, contexto: e.target.value }
                  })}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.contexto ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva o contexto e situação do exercício..."
                />
                {errors.contexto && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.contexto}
                  </p>
                )}
              </div>

              {/* Pontuação e Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pontuação
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.pontuacao}
                    onChange={(e) => setFormData({ ...formData, pontuacao: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Rascunho' | 'Arquivado' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-interactive"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Rascunho">Rascunho</option>
                    <option value="Arquivado">Arquivado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Conteúdo Específico do Tipo */}
            <div className="space-y-6">
              {/* Conteúdo baseado no tipo */}
              {formData.tipo === 'Quiz' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Quiz - Múltipla Escolha</h3>
                  </div>

                  {/* Pergunta */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pergunta *
                    </label>
                    <textarea
                      value={formData.conteudo.pergunta || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        conteudo: { ...formData.conteudo, pergunta: e.target.value }
                      })}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                        errors.pergunta ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Qual é a pergunta do quiz?"
                    />
                    {errors.pergunta && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.pergunta}
                      </p>
                    )}
                  </div>

                  {/* Opções */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Opções de Resposta
                      </label>
                      <button
                        type="button"
                        onClick={adicionarOpcao}
                        className="admin-button text-blue-600 hover:text-blue-700 text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Opção
                      </button>
                    </div>
                    
                    {(formData.conteudo.opcoes || []).map((opcao, index) => (
                      <div key={opcao.id} className="border rounded-md p-3 mb-3 bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={opcao.correta}
                            onChange={(e) => atualizarOpcao(index, { correta: e.target.checked })}
                            className="mt-1 cursor-interactive"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={opcao.texto}
                              onChange={(e) => atualizarOpcao(index, { texto: e.target.value })}
                              placeholder="Texto da opção"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={opcao.explicacao}
                              onChange={(e) => atualizarOpcao(index, { explicacao: e.target.value })}
                              placeholder="Explicação da opção"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removerOpcao(index)}
                            className="admin-button text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {errors.opcoes && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.opcoes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {(formData.tipo === 'Passivo' || formData.tipo === 'Interativo') && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {formData.tipo === 'Passivo' ? 'Demonstração' : 'Exercício Interativo'}
                    </h3>
                  </div>

                  {/* Posição FEN */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posição Inicial (FEN)
                    </label>
                    <input
                      type="text"
                      value={formData.conteudo.posicaoFEN || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        conteudo: { ...formData.conteudo, posicaoFEN: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                    />
                  </div>

                  {/* Lances */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Sequência de Lances
                      </label>
                      <button
                        type="button"
                        onClick={adicionarLance}
                        className="admin-button text-blue-600 hover:text-blue-700 text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Lance
                      </button>
                    </div>
                    
                    {(formData.conteudo.lances || []).map((lance, index) => (
                      <div key={lance.id} className="border rounded-md p-3 mb-3 bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <span className="text-sm font-medium text-gray-500 mt-2">#{lance.ordem}</span>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={lance.movimento}
                              onChange={(e) => atualizarLance(index, { movimento: e.target.value })}
                              placeholder="Ex: e4, Nf3, Bc4..."
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={lance.posicaoResultante}
                              onChange={(e) => atualizarLance(index, { posicaoResultante: e.target.value })}
                              placeholder="FEN da posição após o movimento (opcional)"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <textarea
                              value={lance.explicacao}
                              onChange={(e) => atualizarLance(index, { explicacao: e.target.value })}
                              placeholder="Explicação do movimento..."
                              rows={2}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removerLance(index)}
                            className="admin-button text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {errors.lances && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lances}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Explicação Final */}
          <div className="mt-6 pt-6 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explicação Final *
            </label>
            <textarea
              value={formData.conteudo.explicacaoFinal}
              onChange={(e) => setFormData({
                ...formData,
                conteudo: { ...formData.conteudo, explicacaoFinal: e.target.value }
              })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.explicacaoFinal ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Explicação conclusiva que será mostrada ao final do exercício..."
            />
            {errors.explicacaoFinal && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.explicacaoFinal}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="admin-button px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Exercício
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 