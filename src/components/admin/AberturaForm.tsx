'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import {
  X,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface AberturaFormData {
  id?: string;
  nome: string;
  categoria: 'Tática' | 'Posicional' | 'Universal';
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  movimentos: string[];
  descricao: string;
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
}

interface AberturaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AberturaFormData) => void;
  initialData?: AberturaFormData | null;
  mode: 'create' | 'edit';
}

export default function AberturaForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}: AberturaFormProps) {
  const [formData, setFormData] = useState<AberturaFormData>({
    nome: '',
    categoria: 'Tática',
    dificuldade: 'Iniciante',
    movimentos: [],
    descricao: '',
    status: 'Rascunho'
  });

  const [movimentoInput, setMovimentoInput] = useState('');
  const [chess] = useState(new Chess());
  const [boardPosition, setBoardPosition] = useState(chess.fen());
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidSequence, setIsValidSequence] = useState(true);

  const resetBoard = useCallback(() => {
    chess.reset();
    setBoardPosition(chess.fen());
    setIsValidSequence(true);
  }, [chess]);

  const validateAndUpdateBoard = useCallback((movesString: string) => {
    const moves = movesString.trim().split(/\s+/).filter(move => move.length > 0);
    
    try {
      chess.reset();
      let isValid = true;
      
      for (const move of moves) {
        try {
          chess.move(move);
        } catch {
          isValid = false;
          break;
        }
      }
      
      if (isValid) {
        setBoardPosition(chess.fen());
        setFormData(prev => ({ ...prev, movimentos: moves }));
        setIsValidSequence(true);
        setErrors(prev => ({ ...prev, movimentos: '' }));
      } else {
        setIsValidSequence(false);
        setErrors(prev => ({ ...prev, movimentos: 'Sequência de movimentos inválida' }));
      }
    } catch {
      setIsValidSequence(false);
      setErrors(prev => ({ ...prev, movimentos: 'Erro ao validar movimentos' }));
    }
  }, [chess]);

  const resetForm = useCallback(() => {
    setMovimentoInput('');
    resetBoard();
    setFormData({
      nome: '',
      categoria: 'Tática',
      dificuldade: 'Iniciante',
      movimentos: [],
      descricao: '',
      status: 'Rascunho'
    });
    setErrors({});
  }, [resetBoard]);

  // Reset form quando modal abre/fecha ou muda de modo
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
        const movesString = initialData.movimentos.join(' ');
        setMovimentoInput(movesString);
        if (movesString) {
          validateAndUpdateBoard(movesString);
        } else {
          resetBoard();
        }
      } else {
        resetForm();
        resetBoard();
      }
      setErrors({});
    }
  }, [isOpen, initialData, mode, resetBoard, validateAndUpdateBoard, resetForm]);

  const handleMovimentosChange = (value: string) => {
    setMovimentoInput(value);
    if (value.trim()) {
      validateAndUpdateBoard(value);
    } else {
      resetBoard();
      setFormData(prev => ({ ...prev, movimentos: [] }));
      setIsValidSequence(true);
      setErrors(prev => ({ ...prev, movimentos: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da abertura é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (formData.movimentos.length === 0) {
      newErrors.movimentos = 'Pelo menos um movimento é obrigatório';
    }

    if (formData.movimentos.length > 0 && !isValidSequence) {
      newErrors.movimentos = 'Sequência de movimentos inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para verificar se pode habilitar o botão
  const canSubmit = () => {
    const hasBasicInfo = formData.nome.trim().length > 0 && formData.descricao.trim().length > 0;
    const hasValidMovements = formData.movimentos.length === 0 || isValidSequence;
    return hasBasicInfo && hasValidMovements;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="font-title text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Nova Abertura' : 'Editar Abertura'}
              </h2>
              <p className="font-body text-gray-600 mt-1">
                {mode === 'create' 
                  ? 'Adicione uma nova abertura ao catálogo' 
                  : 'Modifique os dados da abertura'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Form Section */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="block font-interface font-semibold text-gray-700 mb-2">
                    Nome da Abertura *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, nome: e.target.value }));
                      // Limpar erro do nome quando usuário digita
                      if (errors.nome && e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, nome: '' }));
                      }
                    }}
                    placeholder="Ex: Abertura Italiana, Defesa Siciliana..."
                    className={`w-full px-4 py-3 border rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nome ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.nome && (
                    <p className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertCircle size={16} />
                      {errors.nome}
                    </p>
                  )}
                </div>

                {/* Categoria e Dificuldade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        categoria: e.target.value as AberturaFormData['categoria']
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Tática">Tática</option>
                      <option value="Posicional">Posicional</option>
                      <option value="Universal">Universal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-interface font-semibold text-gray-700 mb-2">
                      Dificuldade *
                    </label>
                    <select
                      value={formData.dificuldade}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        dificuldade: e.target.value as AberturaFormData['dificuldade']
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                </div>

                {/* Movimentos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-interface font-semibold text-gray-700">
                      Sequência de Movimentos *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMovimentoInput('');
                        resetBoard();
                      }}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      Resetar
                    </button>
                  </div>
                  <input
                    type="text"
                    value={movimentoInput}
                    onChange={(e) => handleMovimentosChange(e.target.value)}
                    placeholder="Ex: e4 e5 Nf3 Nc6 Bc4"
                    className={`w-full px-4 py-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.movimentos ? 'border-red-300' : isValidSequence ? 'border-green-300' : 'border-gray-200'
                    }`}
                  />
                  <div className="flex items-center justify-between mt-2">
                    {errors.movimentos ? (
                      <p className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        {errors.movimentos}
                      </p>
                    ) : isValidSequence && formData.movimentos.length > 0 ? (
                      <p className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle2 size={16} />
                        Sequência válida ({formData.movimentos.length} movimentos)
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Digite os movimentos separados por espaço
                      </p>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-interface font-semibold cursor-pointer"
                    >
                      {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showPreview ? 'Ocultar' : 'Mostrar'} Preview
                    </button>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block font-interface font-semibold text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, descricao: e.target.value }));
                      // Limpar erro da descrição quando usuário digita
                      if (errors.descricao && e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, descricao: '' }));
                      }
                    }}
                    placeholder="Descreva as características principais desta abertura..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.descricao ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.descricao && (
                    <p className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertCircle size={16} />
                      {errors.descricao}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block font-interface font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      status: e.target.value as AberturaFormData['status']
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Arquivado">Arquivado</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Preview Section */}
            {showPreview && (
              <div className="w-full lg:w-96 border-l border-gray-200 p-6 bg-gray-50">
                <h3 className="font-interface font-semibold text-gray-900 mb-4">
                  Preview do Tabuleiro
                </h3>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Chessboard 
                    position={boardPosition}
                    arePiecesDraggable={false}
                    boardWidth={300}
                  />
                  {formData.movimentos.length > 0 && (
                    <div className="mt-4">
                      <p className="font-interface font-semibold text-gray-700 text-sm mb-2">
                        Movimentos:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {formData.movimentos.map((move, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono"
                          >
                            {index + 1}. {move}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-interface font-semibold cursor-pointer"
            >
              <RotateCcw size={18} />
              Limpar Formulário
            </button>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-interface font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-interface font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Save size={18} />
                {mode === 'create' ? 'Criar Abertura' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 