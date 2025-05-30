'use client';

import { Zap, AlertCircle } from 'lucide-react';

interface ExercicioInterativoFormProps {
  movimentoCorreto: string;
  tempoLimite?: number;
  tentativasMaximas: number;
  onChange: (field: string, value: string | number | undefined) => void;
  loading?: boolean;
  error?: string;
}

export default function ExercicioInterativoForm({
  movimentoCorreto,
  tempoLimite,
  tentativasMaximas,
  onChange,
  loading = false,
  error
}: ExercicioInterativoFormProps) {

  return (
    <div className="space-y-6">
      {/* Movimento Correto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Zap className="text-green-500" size={16} />
            Movimento Correto *
          </div>
        </label>
        <input
          type="text"
          value={movimentoCorreto}
          onChange={(e) => onChange('movimentoCorreto', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: e4, Nf3, Bc4, Qxh7+..."
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">
          Lance que o usuário deve descobrir (notação algébrica)
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>

      {/* Configurações de Tempo e Tentativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempo Limite (segundos)
          </label>
          <input
            type="number"
            min="0"
            value={tempoLimite || ''}
            onChange={(e) => onChange('tempoLimite', parseInt(e.target.value) || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0 = sem limite"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Deixe vazio ou 0 para sem limite de tempo
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tentativas Máximas
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={tentativasMaximas}
            onChange={(e) => onChange('tentativasMaximas', parseInt(e.target.value) || 3)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Número máximo de tentativas antes de mostrar a resposta
          </p>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Zap className="text-green-600 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-green-800 mb-1">
              Exercício Interativo
            </h4>
            <p className="text-sm text-green-700">
              O usuário verá a posição inicial e deve encontrar o movimento correto. 
              Use as configurações de tempo e tentativas para ajustar a dificuldade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 