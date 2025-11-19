import { useState, useCallback, useEffect } from 'react';
import { type Licao, type LicaoFormData } from '@/types/licoes';

export type { Licao, LicaoFormData };



export function useLicoes() {
  const [licoes, setLicoes] = useState<Licao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/licoes')
      const data = await res.json()
      setLicoes(data)
    }
    fetchData()
  }, []);

// Helpers removidos após migração para API

  // Criar nova lição
  const createLicao = useCallback(async (data: LicaoFormData): Promise<Licao> => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/licoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const created = await res.json()
      setLicoes(prev => [created, ...prev])
      return created
    } catch {
      const errorMessage = 'Erro ao criar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes]);

  // Atualizar lição existente
  const updateLicao = useCallback(async (id: string, data: LicaoFormData): Promise<Licao> => {
    setLoading(true);
    setError(null);
    
    try {
      const licaoExistente = licoes.find(l => l.id === id);
      if (!licaoExistente) {
        throw new Error('Lição não encontrada');
      }

      const res = await fetch(`/api/licoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const updated = await res.json()
      setLicoes(prev => prev.map(l => l.id === id ? updated : l))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes]);

  // Deletar lição
  const deleteLicao = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await fetch(`/api/licoes/${id}`, { method: 'DELETE' })
      setLicoes(prev => prev.filter(l => l.id !== id))
    } catch {
      const errorMessage = 'Erro ao deletar lição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes]);

  // Deletar todas as lições de uma abertura (para exclusão em cascata)
  const deleteLicoesByAbertura = useCallback(async (aberturaId: string): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const toDelete = licoes.filter(l => l.aberturaId === aberturaId)
      const ids = toDelete.map(l => l.id)
      for (const id of ids) {
        await fetch(`/api/licoes/${id}`, { method: 'DELETE' })
      }
      setLicoes(prev => prev.filter(l => l.aberturaId !== aberturaId))
      return ids
    } catch {
      const errorMessage = 'Erro ao deletar lições da abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes]);

  // Buscar lição por ID
  const getLicao = useCallback((id: string): Licao | undefined => {
    return licoes.find(l => l.id === id);
  }, [licoes]);

  // Filtrar lições
  const filterLicoes = useCallback((
    searchTerm: string,
    aberturaId: string = 'all',
    dificuldade: string = 'all'
  ): Licao[] => {
    return licoes.filter(licao => {
      const matchSearch = licao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         licao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAbertura = aberturaId === 'all' || licao.aberturaId === aberturaId;
      const matchDificuldade = dificuldade === 'all' || licao.dificuldade === dificuldade;
      
      return matchSearch && matchAbertura && matchDificuldade;
    });
  }, [licoes]);

  // Lições por abertura
  const getLicoesByAbertura = useCallback((aberturaId: string): Licao[] => {
    return licoes
      .filter(l => l.aberturaId === aberturaId)
      .sort((a, b) => a.ordem - b.ordem);
  }, [licoes]);

  // Estatísticas
  const getStats = useCallback(() => {
    const total = licoes.length;
    const ativas = licoes.filter(l => l.status === 'Ativo').length;
    const rascunhos = licoes.filter(l => l.status === 'Rascunho').length;
    const arquivadas = licoes.filter(l => l.status === 'Arquivado').length;
    const tempoTotal = licoes.reduce((total, l) => total + l.estimativaTempo, 0);

    return {
      total,
      ativas,
      rascunhos,
      arquivadas,
      tempoTotal
    };
  }, [licoes]);

  // Reordenar lições de uma abertura
  const reorderLicoes = useCallback(async (aberturaId: string, licoesReordenadas: Licao[]): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Criar novo array com as lições reordenadas
      const newLicoes = licoes.map(licao => {
        // Se a lição pertence à abertura sendo reordenada, usa a versão reordenada
        const licaoReordenada = licoesReordenadas.find(l => l.id === licao.id);
        if (licaoReordenada) {
          return {
            ...licaoReordenada,
            atualizadoEm: new Date().toISOString().split('T')[0]
          };
        }
        // Senão, mantém a lição original
        return licao;
      });

      setLicoes(newLicoes)
    } catch {
      const errorMessage = 'Erro ao reordenar lições';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [licoes]);

  return {
    licoes,
    loading,
    error,
    createLicao,
    updateLicao,
    deleteLicao,
    deleteLicoesByAbertura,
    getLicao,
    filterLicoes,
    getLicoesByAbertura,
    getStats,
    reorderLicoes,
    clearError: () => setError(null)
  };
} 
