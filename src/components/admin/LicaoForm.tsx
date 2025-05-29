'use client';

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Licao, LicaoFormData } from '@/types/licoes';
import { Abertura } from '@/types/aberturas';

interface LicaoFormProps {
  licao?: Licao;
  aberturas: Abertura[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LicaoFormData) => void;
  aberturaIdPreSelected?: string;
}

export default function LicaoForm({ 
  licao, 
  aberturas, 
  isOpen, 
  onClose, 
  onSave, 
  aberturaIdPreSelected 
}: LicaoFormProps) {
  const [formData, setFormData] = useState<LicaoFormData>({
    titulo: '',
    descricao: '',
    aberturaId: aberturaIdPreSelected || '',
    ordem: 1,
    status: 'Ativo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (licao) {
      setFormData({
        titulo: licao.titulo,
        descricao: licao.descricao,
        aberturaId: licao.aberturaId,
        ordem: licao.ordem,
        status: licao.status
      });
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        aberturaId: aberturaIdPreSelected || '',
        ordem: 1,
        status: 'Ativo'
      });
    }
    setErrors({});
  }, [licao, isOpen, aberturaIdPreSelected]);

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

    if (formData.ordem < 1) {
      newErrors.ordem = 'Ordem deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
  };

  if (!isOpen) return null;

  const aberturaSelected = aberturas.find(a => a.id === formData.aberturaId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {licao ? 'Editar Lição' : 'Nova Lição'}
          </h2>
          <button
            onClick={onClose}
            className="admin-button p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-5 h-5" />
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-interactive ${
                errors.aberturaId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!!aberturaIdPreSelected}
            >
              <option value="">Selecione uma abertura</option>
              {aberturas.map((abertura) => (
                <option key={abertura.id} value={abertura.id}>
                  {abertura.nome} ({abertura.categoria})
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
              placeholder="Ex: Conceitos Básicos da Abertura Italiana"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Ordem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordem na Sequência
            </label>
            <input
              type="number"
              min="1"
              value={formData.ordem}
              onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ordem ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-sm text-gray-500">
              Define a ordem desta lição na sequência de estudos
            </p>
            {errors.ordem && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.ordem}
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
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.descricao ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descreva o que será abordado nesta lição, objetivos e conceitos principais..."
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.descricao}
              </p>
            )}
          </div>

          {/* Status */}
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

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              Salvar Lição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 