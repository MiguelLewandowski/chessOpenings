import { useState, useCallback } from 'react';
import { type ExercicioFormData } from '@/types/exercicios';

export interface ValidationErrors {
  [key: string]: string;
}

export const useExercicioFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateBasicFields = useCallback((formData: ExercicioFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Validações básicas obrigatórias
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

    return newErrors;
  }, []);

  const validateContentByType = useCallback((formData: ExercicioFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Validações específicas por tipo de exercício
    switch (formData.tipo) {
      case 'Passivo':
        if (!formData.conteudo.sequenciaMovimentos || formData.conteudo.sequenciaMovimentos.length === 0) {
          newErrors.sequenciaMovimentos = 'Exercícios passivos devem ter pelo menos um movimento';
        }
        break;

      case 'Interativo':
        if (!formData.conteudo.movimentoCorreto?.trim()) {
          newErrors.movimentoCorreto = 'Movimento correto é obrigatório para exercícios interativos';
        }
        break;

      case 'Quiz':
        if (!formData.conteudo.opcoes || formData.conteudo.opcoes.length < 2) {
          newErrors.opcoes = 'Quiz deve ter pelo menos 2 opções';
        } else {
          const temOpcaoCorreta = formData.conteudo.opcoes.some(opcao => opcao.correta);
          if (!temOpcaoCorreta) {
            newErrors.opcoes = 'Quiz deve ter pelo menos uma opção correta';
          }
        }
        break;
    }

    return newErrors;
  }, []);

  const validateForm = useCallback((formData: ExercicioFormData): boolean => {
    const basicErrors = validateBasicFields(formData);
    const contentErrors = validateContentByType(formData);
    
    const allErrors = { ...basicErrors, ...contentErrors };
    setErrors(allErrors);
    
    return Object.keys(allErrors).length === 0;
  }, [validateBasicFields, validateContentByType]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  return {
    errors,
    validateForm,
    validateBasicFields,
    validateContentByType,
    clearErrors,
    clearError,
    setError
  };
}; 