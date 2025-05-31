'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';
import { type LicaoFormData } from '@/types/licoes';
import { useAberturas } from '@/hooks/useAberturas';

interface LicaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LicaoFormData) => Promise<void>;
  initialData?: LicaoFormData;
  loading?: boolean;
}

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
    dificuldade: 'Iniciante',
    status: 'Ativo',
    exercicios: [],
    estimativaTempo: 15,
    pontuacao: 100,
    prerequisitos: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        aberturaId: '',
        ordem: 1,
        dificuldade: 'Iniciante',
        status: 'Ativo',
        exercicios: [],
        estimativaTempo: 15,
        pontuacao: 100,
        prerequisitos: []
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.aberturaId) {
      newErrors.aberturaId = 'Abertura é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  const aberturaSelected = aberturas.find(a => a.id === formData.aberturaId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="font-title text-xl font-bold text-gray-900">
              {initialData ? 'Editar Lição' : 'Nova Lição'}
            </h2>
            <p className="font-body text-sm text-gray-600 mt-1">
              Lições são containers simples para organizar exercícios
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Abertura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Abertura *
            </label>
            <select
              value={formData.aberturaId}
              onChange={(e) => setFormData({ ...formData, aberturaId: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer ${
                errors.aberturaId ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
            >
              <option value="">Selecione uma abertura</option>
              {aberturas.map((abertura) => (
                <option key={abertura.id} value={abertura.id}>
                  {abertura.nome}
                </option>
              ))}
            </select>
            {aberturaSelected && (
              <p className="mt-1 text-sm text-gray-500">
                {aberturaSelected.categoria} • {aberturaSelected.dificuldade}
              </p>
            )}
            {errors.aberturaId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.aberturaId}
              </p>
            )}
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Lição *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.titulo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Fundamentos da Abertura Italiana"
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
              Descrição da Lição *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.descricao ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descreva o que será aprendido nesta lição..."
              disabled={loading}
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.descricao}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md flex items-center transition-colors disabled:opacity-50 cursor-pointer"
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
                  Salvar Lição
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 