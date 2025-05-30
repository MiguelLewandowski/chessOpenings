'use client';

import { Plus, Trash2, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { type OpcaoQuiz } from '@/types/exercicios';

interface ExercicioQuizFormProps {
  opcoes: OpcaoQuiz[];
  tempoLimite?: number;
  tentativasMaximas: number;
  onChange: (field: string, value: OpcaoQuiz[] | string | number | undefined) => void;
  loading?: boolean;
  error?: string;
}

export default function ExercicioQuizForm({
  opcoes,
  tempoLimite,
  tentativasMaximas,
  onChange,
  loading = false,
  error
}: ExercicioQuizFormProps) {

  const addOpcao = () => {
    const novaOpcao: OpcaoQuiz = {
      id: Math.random().toString(36).substr(2, 9),
      movimento: '',
      texto: '',
      correta: false
    };
    
    onChange('opcoes', [...opcoes, novaOpcao]);
  };

  const updateOpcao = (index: number, field: keyof OpcaoQuiz, value: string | boolean) => {
    const novasOpcoes = opcoes.map((opcao, i) => 
      i === index ? { ...opcao, [field]: value } : opcao
    );
    onChange('opcoes', novasOpcoes);
  };

  const removeOpcao = (index: number) => {
    const novasOpcoes = opcoes.filter((_, i) => i !== index);
    onChange('opcoes', novasOpcoes);
  };

  const opcoesCorretas = opcoes.filter(opcao => opcao.correta).length;

  return (
    <div className="space-y-6">
      {/* Opções do Quiz */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-purple-500" size={16} />
              Opções de Resposta *
            </div>
          </label>
          <button
            type="button"
            onClick={addOpcao}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            disabled={loading}
          >
            <Plus size={16} />
            Adicionar Opção
          </button>
        </div>

        {/* Status das opções */}
        {opcoes.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Total de opções: {opcoes.length}
              </span>
              <span className={`flex items-center gap-1 ${
                opcoesCorretas > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {opcoesCorretas > 0 ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                Opções corretas: {opcoesCorretas}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {opcoes.map((opcao, index) => (
            <div key={opcao.id} className={`border rounded-lg p-4 ${
              opcao.correta ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    opcao.correta ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Opção {index + 1}
                    {opcao.correta && <span className="text-green-600 ml-1">(Correta)</span>}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeOpcao(index)}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                  disabled={loading}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`opcao-correta-${opcao.id}`}
                    checked={opcao.correta}
                    onChange={(e) => updateOpcao(index, 'correta', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={loading}
                  />
                  <label
                    htmlFor={`opcao-correta-${opcao.id}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Esta é uma opção correta
                  </label>
                </div>
              </div>
            </div>
          ))}
          
          {opcoes.length === 0 && (
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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="text-purple-600 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-purple-800 mb-1">
              Exercício de Quiz
            </h4>
            <p className="text-sm text-purple-700">
              O usuário verá as opções e deve escolher a(s) correta(s). 
              Certifique-se de marcar pelo menos uma opção como correta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 