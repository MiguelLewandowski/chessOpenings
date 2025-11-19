import { useState, useCallback, useEffect } from 'react';
import { type Abertura, type AberturaFormData } from '@/types/aberturas';

export type { Abertura, AberturaFormData };



export function useAberturas() {
  const [aberturas, setAberturas] = useState<Abertura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/aberturas')
      const data = await res.json()
      setAberturas(data)
    }
    fetchData()
  }, []);

  // Helpers removidos após migração para API

  // Criar nova abertura
  const createAbertura = useCallback(async (data: AberturaFormData): Promise<Abertura> => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/aberturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const created = await res.json()
      setAberturas(prev => [created, ...prev])
      return created
    } catch {
      const errorMessage = 'Erro ao criar abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [aberturas]);

  // Atualizar abertura existente
  const updateAbertura = useCallback(async (id: string, data: AberturaFormData): Promise<Abertura> => {
    setLoading(true);
    setError(null);
    
    try {
      const aberturaExistente = aberturas.find(a => a.id === id);
      if (!aberturaExistente) {
        throw new Error('Abertura não encontrada');
      }

      const res = await fetch(`/api/aberturas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const updated = await res.json()
      setAberturas(prev => prev.map(a => a.id === id ? updated : a))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [aberturas]);

  // Deletar abertura com exclusão em cascata
  const deleteAbertura = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await fetch(`/api/aberturas/${id}`, { method: 'DELETE' })
      setAberturas(prev => prev.filter(a => a.id !== id))
        
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar abertura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [aberturas]);

  // Buscar abertura por ID
  const getAbertura = useCallback((id: string): Abertura | undefined => {
    return aberturas.find(a => a.id === id);
  }, [aberturas]);

  // Filtrar aberturas
  const filterAberturas = useCallback((
    searchTerm: string,
    categoria: string = 'all',
    dificuldade: string = 'all'
  ): Abertura[] => {
    return aberturas.filter(abertura => {
      const matchSearch = abertura.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         abertura.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategoria = categoria === 'all' || abertura.categoria === categoria;
      const matchDificuldade = dificuldade === 'all' || abertura.dificuldade === dificuldade;
      
      return matchSearch && matchCategoria && matchDificuldade;
    });
  }, [aberturas]);

  // Estatísticas (lições e exercícios serão calculados dinamicamente pelos hooks relacionados)
  const getStats = useCallback(() => {
    const total = aberturas.length;
    const ativas = aberturas.filter(a => a.status === 'Ativo').length;
    const rascunhos = aberturas.filter(a => a.status === 'Rascunho').length;
    const arquivadas = aberturas.filter(a => a.status === 'Arquivado').length;

    return {
      total,
      ativas,
      rascunhos,
      arquivadas
    };
  }, [aberturas]);

  // Função para obter estatísticas avançadas com relacionamentos
  const getAdvancedStats = useCallback((licoes: Array<{id: string; aberturaId: string}> = [], exercicios: Array<{id: string; licaoId: string}> = []) => {
    const baseStats = getStats();
    const totalLicoes = licoes.length;
    const totalExercicios = exercicios.length;
    
    // Contar lições e exercícios por abertura
    const aberturaStats = aberturas.map(abertura => ({
      ...abertura,
      licoes: licoes.filter(licao => licao.aberturaId === abertura.id).length,
      exercicios: exercicios.filter(exercicio => 
        licoes.some(licao => licao.id === exercicio.licaoId && licao.aberturaId === abertura.id)
      ).length
    }));

    return {
      ...baseStats,
      totalLicoes,
      totalExercicios,
      aberturaStats
    };
  }, [aberturas, getStats]);

  return {
    aberturas,
    loading,
    error,
    createAbertura,
    updateAbertura,
    deleteAbertura,
    getAbertura,
    filterAberturas,
    getStats,
    getAdvancedStats,
    clearError: () => setError(null)
  };
} 
