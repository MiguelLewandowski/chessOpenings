'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { X, Save, AlertCircle, Plus, Trash2, Play, HelpCircle, Zap, Loader2, Eye, EyeOff } from 'lucide-react';
import { type ExercicioFormData } from '@/types/exercicios';
import { useLicoes } from '@/hooks/useLicoes';

interface ExercicioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExercicioFormData) => Promise<void>;
  initialData?: ExercicioFormData;
  loading?: boolean;
}

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
    tipo: 'Passivo',
    dificuldade: 'Iniciante',
    status: 'Ativo',
    conteudo: {
      posicaoInicial: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      contexto: '',
      sequenciaMovimentos: [],
      movimentoCorreto: '',
      opcoes: [],
      explicacao: '',
      dicas: [],
      feedbackCorreto: '',
      feedbackIncorreto: ''
    },
    pontuacao: 100,
    tempoLimite: 300,
    tentativasMaximas: 3
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [chess] = useState(new Chess());
  const [boardPosition, setBoardPosition] = useState(chess.fen());
  const [showPreview, setShowPreview] = useState(true);
  const [fenError, setFenError] = useState<string>('');

  const validateAndUpdateFEN = useCallback((fen: string) => {
    if (!fen.trim()) {
      chess.reset();
      setBoardPosition(chess.fen());
      setFenError('');
      return;
    }

    try {
      chess.load(fen);
      setBoardPosition(fen);
      setFenError('');
    } catch {
      setFenError('FEN inválido - verifique a notação');
    }
  }, [chess]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Validar e atualizar FEN inicial
      validateAndUpdateFEN(initialData.conteudo.posicaoInicial);
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        licaoId: '',
        ordem: 1,
        tipo: 'Passivo',
        dificuldade: 'Iniciante',
        status: 'Ativo',
        conteudo: {
          posicaoInicial: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          contexto: '',
          sequenciaMovimentos: [],
          movimentoCorreto: '',
          opcoes: [],
          explicacao: '',
          dicas: [],
          feedbackCorreto: '',
          feedbackIncorreto: ''
        },
        pontuacao: 100,
        tempoLimite: 300,
        tentativasMaximas: 3
      });
      // Resetar tabuleiro para posição inicial
      chess.reset();
      setBoardPosition(chess.fen());
      setFenError('');
    }
    setErrors({});
  }, [initialData, isOpen, validateAndUpdateFEN, chess]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.licaoId) {
      newErrors.licaoId = 'Lição é obrigatória';
    }

    if (formData.ordem < 1) {
      newErrors.ordem = 'Ordem deve ser maior que 0';
    }

    // Validações específicas por tipo
    if (formData.tipo === 'Passivo') {
      if (!formData.conteudo.sequenciaMovimentos || formData.conteudo.sequenciaMovimentos.length === 0) {
        newErrors.sequenciaMovimentos = 'Exercícios passivos devem ter pelo menos um movimento';
      }
    } else if (formData.tipo === 'Interativo') {
      if (!formData.conteudo.movimentoCorreto?.trim()) {
        newErrors.movimentoCorreto = 'Movimento correto é obrigatório para exercícios interativos';
      }
    } else if (formData.tipo === 'Quiz') {
      if (!formData.conteudo.opcoes || formData.conteudo.opcoes.length < 2) {
        newErrors.opcoes = 'Quiz deve ter pelo menos 2 opções';
      }
      const temOpcaoCorreta = formData.conteudo.opcoes?.some(opcao => opcao.correta);
      if (!temOpcaoCorreta) {
        newErrors.opcoes = 'Quiz deve ter pelo menos uma opção correta';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await onSubmit(formData);
  };

  // Funções para manipular sequência de movimentos (Passivo)
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
        sequenciaMovimentos: [...(prev.conteudo.sequenciaMovimentos || []), novoMovimento]
      }
    }));
  };

  const updateMovimento = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      conteudo: {
        ...prev.conteudo,
        sequenciaMovimentos: (prev.conteudo.sequenciaMovimentos || []).map((mov, i) => 
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
        sequenciaMovimentos: (prev.conteudo.sequenciaMovimentos || []).filter((_, i) => i !== index)
      }
    }));
  };

  // Funções para manipular opções (Quiz)
  const addOpcao = () => {
    const novaOpcao = {
      id: Math.random().toString(36).substr(2, 9),
      movimento: '',
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

  // Funções para manipular dicas
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

  // Função para atualizar FEN no formulário
  const handleFenChange = (fen: string) => {
    setFormData(prev => ({
      ...prev,
      conteudo: { ...prev.conteudo, posicaoInicial: fen }
    }));
    validateAndUpdateFEN(fen);
  };

  // Função para obter ícone do tipo
  const getTipoIcon = () => {
    switch (formData.tipo) {
      case 'Passivo': return <Play className="text-blue-500" size={20} />;
      case 'Interativo': return <Zap className="text-green-500" size={20} />;
      case 'Quiz': return <HelpCircle className="text-purple-500" size={20} />;
    }
  };

  // Função para obter descrição do tipo
  const getTipoDescricao = () => {
    switch (formData.tipo) {
      case 'Passivo': return 'Demonstração sequencial - usuário acompanha movimentos e explicações';
      case 'Interativo': return 'Encontrar lance - usuário precisa descobrir o movimento correto';
      case 'Quiz': return 'Múltipla escolha - usuário escolhe entre opções de movimento';
    }
  };

  if (!isOpen) return null;

  const licaoSelected = licoes.find(l => l.id === formData.licaoId);
  const isPassivo = formData.tipo === 'Passivo';
  const isInterativo = formData.tipo === 'Interativo';
  const isQuiz = formData.tipo === 'Quiz';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            {getTipoIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Editar Exercício' : 'Novo Exercício'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {getTipoDescricao()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Dados Básicos */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados Básicos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lição *
                </label>
                <select
                  value={formData.licaoId}
                  onChange={(e) => setFormData({ ...formData, licaoId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.licaoId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
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
                    Ordem: {licaoSelected.ordem} • {licaoSelected.dificuldade}
                  </p>
                )}
                {errors.licaoId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.licaoId}
                  </p>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Exercício *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'Passivo' | 'Interativo' | 'Quiz' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="Passivo">Passivo (Demonstração)</option>
                  <option value="Interativo">Interativo (Encontrar Lance)</option>
                  <option value="Quiz">Quiz (Múltipla Escolha)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {getTipoDescricao()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dificuldade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificuldade
                </label>
                <select
                  value={formData.dificuldade}
                  onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value as 'Iniciante' | 'Intermediário' | 'Avançado' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Rascunho' | 'Arquivado' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Rascunho">Rascunho</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </div>

              {/* Ordem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordem na Lição
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.ordem}
                  onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ordem ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.ordem && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.ordem}
                  </p>
                )}
              </div>
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
                placeholder={
                  isPassivo ? "Ex: Sequência da Abertura Italiana" :
                  isInterativo ? "Ex: Encontre o melhor movimento" :
                  "Ex: Qual o melhor lance aqui?"
                }
                disabled={loading}
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.titulo}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.descricao ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={
                  isPassivo ? "Descreva a sequência que será demonstrada..." :
                  isInterativo ? "Descreva o que o usuário deve encontrar..." :
                  "Descreva a pergunta que será feita..."
                }
                disabled={loading}
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.descricao}
                </p>
              )}
            </div>
          </div>

          {/* Conteúdo do Exercício */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Conteúdo do Exercício ({formData.tipo})
            </h3>

            {/* Posição Inicial */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Posição Inicial (FEN)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  {showPreview ? (
                    <>
                      <EyeOff size={16} />
                      Ocultar Preview
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Mostrar Preview
                    </>
                  )}
                </button>
              </div>

              <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <div>
                  <input
                    type="text"
                    value={formData.conteudo.posicaoInicial}
                    onChange={(e) => handleFenChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                      fenError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Notação FEN da posição inicial do tabuleiro
                  </p>
                  {fenError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {fenError}
                    </p>
                  )}
                </div>

                {showPreview && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Preview do Tabuleiro</h4>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <Chessboard 
                        position={boardPosition}
                        arePiecesDraggable={false}
                        boardWidth={280}
                        customBoardStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        customDarkSquareStyle={{
                          backgroundColor: '#B7C0D8'
                        }}
                        customLightSquareStyle={{
                          backgroundColor: '#E8EDF4'
                        }}
                      />
                    </div>
                    {!fenError && formData.conteudo.posicaoInicial !== 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' && (
                      <p className="mt-2 text-xs text-green-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Posição válida carregada
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contexto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexto
              </label>
              <textarea
                value={formData.conteudo.contexto}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  conteudo: { ...prev.conteudo, contexto: e.target.value }
                }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Explique a situação ou contexto da posição..."
                disabled={loading}
              />
            </div>

            {/* Conteúdo específico por tipo */}
            {isPassivo && (
              /* Modo Passivo - Sequência de Movimentos */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sequência de Movimentos *
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Defina a sequência de movimentos que será demonstrada
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addMovimento}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    disabled={loading}
                  >
                    <Plus size={16} />
                    Adicionar Movimento
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData.conteudo.sequenciaMovimentos || []).map((movimento, index) => (
                    <div key={movimento.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded">
                          Movimento {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMovimento(index)}
                          className="text-red-400 hover:text-red-600"
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Movimento
                          </label>
                          <input
                            type="text"
                            value={movimento.movimento}
                            onChange={(e) => updateMovimento(index, 'movimento', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: e4, Nf3, Bc4..."
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Posição Resultante (FEN)
                          </label>
                          <input
                            type="text"
                            value={movimento.posicaoFEN}
                            onChange={(e) => updateMovimento(index, 'posicaoFEN', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="Posição após o movimento..."
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explicação do Movimento
                        </label>
                        <textarea
                          value={movimento.explicacao}
                          onChange={(e) => updateMovimento(index, 'explicacao', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Explique a ideia por trás deste movimento..."
                          disabled={loading}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.conteudo.sequenciaMovimentos || formData.conteudo.sequenciaMovimentos.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Play className="mx-auto text-gray-400 mb-3" size={48} />
                      <p className="text-gray-600 font-semibold">
                        Nenhum movimento adicionado
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Clique em &quot;Adicionar Movimento&quot; para começar a sequência
                      </p>
                    </div>
                  )}
                </div>

                {errors.sequenciaMovimentos && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sequenciaMovimentos}
                  </p>
                )}
              </div>
            )}

            {isInterativo && (
              /* Modo Interativo - Movimento Correto */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movimento Correto *
                </label>
                <input
                  type="text"
                  value={formData.conteudo.movimentoCorreto || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conteudo: { ...prev.conteudo, movimentoCorreto: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.movimentoCorreto ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Nf3, e4, Bc4..."
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lance em notação algébrica que o usuário deve encontrar
                </p>
                {errors.movimentoCorreto && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.movimentoCorreto}
                  </p>
                )}
              </div>
            )}

            {isQuiz && (
              /* Modo Quiz - Opções Múltiplas */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Opções do Quiz *
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Defina as opções de movimento que o usuário pode escolher
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addOpcao}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    disabled={loading}
                  >
                    <Plus size={16} />
                    Adicionar Opção
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(formData.conteudo.opcoes || []).map((opcao, index) => (
                    <div key={opcao.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded">
                          Opção {index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={opcao.correta}
                              onChange={(e) => updateOpcao(index, 'correta', e.target.checked)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              disabled={loading}
                            />
                            <span className="text-green-600 font-medium">Correta</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeOpcao(index)}
                            className="text-red-400 hover:text-red-600"
                            disabled={loading}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Movimento
                          </label>
                          <input
                            type="text"
                            value={opcao.movimento}
                            onChange={(e) => updateOpcao(index, 'movimento', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: e4, Nf3, Bc4..."
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição da Opção
                          </label>
                          <input
                            type="text"
                            value={opcao.texto}
                            onChange={(e) => updateOpcao(index, 'texto', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Atacar o centro, Desenvolver cavalo..."
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explicação (Por que está certa/errada)
                        </label>
                        <textarea
                          value={opcao.explicacao || ''}
                          onChange={(e) => updateOpcao(index, 'explicacao', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Explique por que esta opção está correta ou incorreta..."
                          disabled={loading}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.conteudo.opcoes || formData.conteudo.opcoes.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <HelpCircle className="mx-auto text-gray-400 mb-3" size={48} />
                      <p className="text-gray-600 font-semibold">
                        Nenhuma opção adicionada
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Clique em &quot;Adicionar Opção&quot; para criar as alternativas
                      </p>
                    </div>
                  )}
                </div>
                
                {errors.opcoes && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.opcoes}
                  </p>
                )}
              </div>
            )}

            {/* Dicas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Dicas
                </label>
                <button
                  type="button"
                  onClick={addDica}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  disabled={loading}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite uma dica útil..."
                        disabled={loading}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDica(index)}
                      className="text-red-400 hover:text-red-600"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explicação Final
              </label>
              <textarea
                value={formData.conteudo.explicacao}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  conteudo: { ...prev.conteudo, explicacao: e.target.value }
                }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder={
                  isPassivo ? "Explique a importância da sequência demonstrada..." :
                  isInterativo ? "Explique por que este é o movimento correto..." :
                  "Explique a solução correta e os conceitos envolvidos..."
                }
                disabled={loading}
              />
            </div>

            {/* Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Correto
                </label>
                <textarea
                  value={formData.conteudo.feedbackCorreto}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conteudo: { ...prev.conteudo, feedbackCorreto: e.target.value }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Mensagem quando usuário acerta..."
                  disabled={loading}
                />
              </div>

              {!isPassivo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Incorreto
                  </label>
                  <textarea
                    value={formData.conteudo.feedbackIncorreto}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conteudo: { ...prev.conteudo, feedbackIncorreto: e.target.value }
                    }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Mensagem quando usuário erra..."
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {/* Configurações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pontuação
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pontuacao}
                  onChange={(e) => setFormData({ ...formData, pontuacao: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {!isPassivo && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo Limite (seg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tempoLimite || ''}
                      onChange={(e) => setFormData({ ...formData, tempoLimite: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0 = sem limite"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tentativas Máximas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.tentativasMaximas}
                      onChange={(e) => setFormData({ ...formData, tentativasMaximas: parseInt(e.target.value) || 3 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md flex items-center disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Exercício
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 