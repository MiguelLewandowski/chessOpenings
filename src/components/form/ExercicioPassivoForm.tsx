'use client';

import { Plus, Trash2, Play } from 'lucide-react';
import { type MovimentoPassivo } from '@/types/exercicios';

interface ExercicioPassivoFormProps {
  sequenciaMovimentos: MovimentoPassivo[];
  onChange: (movimentos: MovimentoPassivo[]) => void;
  loading?: boolean;
  error?: string;
}

export default function ExercicioPassivoForm({
  sequenciaMovimentos,
  onChange,
  loading = false,
  error
}: ExercicioPassivoFormProps) {
  
  const addMovimento = () => {
    const novoMovimento: MovimentoPassivo = {
      id: Math.random().toString(36).substr(2, 9),
      movimento: '',
      posicaoFEN: '',
      explicacao: ''
    };
    
    onChange([...sequenciaMovimentos, novoMovimento]);
  };

  const updateMovimento = (index: number, field: keyof MovimentoPassivo, value: string) => {
    const novosMovimentos = sequenciaMovimentos.map((mov, i) => 
      i === index ? { ...mov, [field]: value } : mov
    );
    onChange(novosMovimentos);
  };

  const removeMovimento = (index: number) => {
    const novosMovimentos = sequenciaMovimentos.filter((_, i) => i !== index);
    onChange(novosMovimentos);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Sequência de Movimentos *
        </label>
        <button
          type="button"
          onClick={addMovimento}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
          disabled={loading}
        >
          <Plus size={16} />
          Adicionar Movimento
        </button>
      </div>

      <div className="space-y-4">
        {sequenciaMovimentos.map((movimento, index) => (
          <div key={movimento.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Play className="text-blue-500" size={16} />
                <span className="text-sm font-medium text-gray-700">
                  Movimento {index + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeMovimento(index)}
                className="text-red-400 hover:text-red-600 cursor-pointer"
                disabled={loading}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Posição FEN (após movimento)
                </label>
                <input
                  type="text"
                  value={movimento.posicaoFEN}
                  onChange={(e) => updateMovimento(index, 'posicaoFEN', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="FEN da posição resultante..."
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explicação do Movimento
              </label>
              <textarea
                value={movimento.explicacao}
                onChange={(e) => updateMovimento(index, 'explicacao', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Explique por que este movimento é importante..."
                disabled={loading}
              />
            </div>
          </div>
        ))}
        
        {sequenciaMovimentos.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Play className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600 font-semibold">
              Nenhum movimento adicionado
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Clique em &quot;Adicionar Movimento&quot; para criar a sequência
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
} 