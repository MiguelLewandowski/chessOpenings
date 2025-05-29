// Utilitário para gerenciar localStorage do ChessOpenings

export const STORAGE_KEYS = {
  ABERTURAS: 'aberturas',
  LICOES: 'licoes',
  EXERCICIOS: 'exercicios'
} as const;

// Função genérica para salvar dados
export const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
    return false;
  }
};

// Função genérica para carregar dados
export const loadFromLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validação melhorada para arrays
      if (Array.isArray(fallback)) {
        return (Array.isArray(parsed) ? parsed : fallback) as T;
      }
      return parsed as T;
    }
  } catch (error) {
    console.warn(`Erro ao carregar ${key} do localStorage:`, error);
  }
  
  return fallback;
};

// Função para remover dados específicos
export const removeFromLocalStorage = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erro ao remover ${key} do localStorage:`, error);
    return false;
  }
};

// Função para limpar todos os dados da aplicação
export const clearChessOpeningsData = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados da aplicação:', error);
    return false;
  }
};

// Função para verificar se há dados salvos
export const hasStoredData = (): { [key: string]: boolean } => {
  if (typeof window === 'undefined') {
    return Object.fromEntries(
      Object.values(STORAGE_KEYS).map(key => [key, false])
    );
  }
  
  return Object.fromEntries(
    Object.values(STORAGE_KEYS).map(key => [
      key, 
      localStorage.getItem(key) !== null
    ])
  );
};

// Função para obter estatísticas de armazenamento
export const getStorageStats = () => {
  if (typeof window === 'undefined') {
    return { totalSize: 0, itemCount: 0, items: {} };
  }

  const items: { [key: string]: { size: number; hasData: boolean } } = {};
  let totalSize = 0;
  let itemCount = 0;

  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    const size = data ? new Blob([data]).size : 0;
    
    items[key] = {
      size,
      hasData: data !== null
    };
    
    if (data) {
      totalSize += size;
      itemCount++;
    }
  });

  return {
    totalSize,
    itemCount,
    items
  };
};

// Função para migrar dados antigos (se necessário no futuro)
export const migrateData = (version: string): boolean => {
  // Implementar migrações de dados conforme necessário
  // Por exemplo: migrar estruturas antigas para novas
  console.log(`Migração de dados para versão ${version} - não implementada ainda`);
  return true;
};

// Tipos para exportação/importação
export interface ExportedData {
  exportDate: string;
  version: string;
  data: { [key: string]: unknown };
}

// Função para exportar todos os dados
export const exportData = (): ExportedData | null => {
  if (typeof window === 'undefined') return null;

  const data: { [key: string]: unknown } = {};
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        data[key] = JSON.parse(stored);
      } catch (error) {
        console.warn(`Erro ao exportar ${key}:`, error);
      }
    }
  });

  return {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    data
  };
};

// Função para importar dados
export const importData = (exportedData: ExportedData): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    if (!exportedData.data) {
      throw new Error('Dados de importação inválidos');
    }

    const validKeys = Object.values(STORAGE_KEYS);
    Object.entries(exportedData.data).forEach(([key, value]) => {
      if (validKeys.includes(key as typeof validKeys[number])) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};

// Função para exclusão em cascata de abertura
export const deleteAberturaWithCascade = async (aberturaId: string) => {
  try {
    // 1. Carregar dados atuais
    const licoes = loadFromLocalStorage<Array<{id: string; aberturaId: string; licaoId?: string}>>('licoes', []);
    const exercicios = loadFromLocalStorage<Array<{id: string; licaoId: string}>>('exercicios', []);
    const aberturas = loadFromLocalStorage<Array<{id: string}>>('aberturas', []);

    // 2. Encontrar lições relacionadas à abertura
    const licoesRelacionadas = licoes.filter(licao => licao.aberturaId === aberturaId);
    const idsLicoesRelacionadas = licoesRelacionadas.map(licao => licao.id);

    // 3. Encontrar exercícios relacionados às lições
    const exerciciosRelacionados = exercicios.filter(exercicio => 
      idsLicoesRelacionadas.includes(exercicio.licaoId)
    );

    // 4. Remover exercícios relacionados
    const exerciciosRestantes = exercicios.filter(exercicio => 
      !idsLicoesRelacionadas.includes(exercicio.licaoId)
    );

    // 5. Remover lições relacionadas
    const licoesRestantes = licoes.filter(licao => licao.aberturaId !== aberturaId);

    // 6. Remover a abertura
    const aberturasRestantes = aberturas.filter(abertura => abertura.id !== aberturaId);

    // 7. Salvar todos os dados atualizados
    saveToLocalStorage('exercicios', exerciciosRestantes);
    saveToLocalStorage('licoes', licoesRestantes);
    saveToLocalStorage('aberturas', aberturasRestantes);

    // 8. Retornar estatísticas da exclusão
    return {
      aberturaRemovida: true,
      licoesRemovidas: licoesRelacionadas.length,
      exerciciosRemovidos: exerciciosRelacionados.length,
      idsLicoesRemovidas: idsLicoesRelacionadas,
      idsExerciciosRemovidos: exerciciosRelacionados.map(e => e.id)
    };
  } catch (error) {
    console.error('Erro na exclusão em cascata:', error);
    throw new Error('Falha ao excluir abertura e dados relacionados');
  }
};

// Tipos para migração (dados antigos)
interface LicaoLegacy {
  id: string;
  titulo: string;
  descricao?: string;
  tipo?: 'Visualização' | 'Interativo';
  dificuldade?: string;
  status?: string;
  pontuacao?: number;
  conteudo?: {
    introducao?: string;
    explicacao?: string;
    movimentos?: Array<{
      id?: string;
      movimento?: string;
      posicaoFEN?: string;
      explicacao?: string;
      destaque?: unknown;
      tempo?: number;
    }>;
    dicas?: string[];
    conclusao?: string;
  };
}

// Função para migrar dados da reestruturação de lições/exercícios
export const migrateLicoesVisualizacaoToExercicios = () => {
  try {
    // Carrega dados atuais
    const licoes: LicaoLegacy[] = JSON.parse(localStorage.getItem('chess-openings-licoes') || '[]');
    const exercicios = JSON.parse(localStorage.getItem('chess-openings-exercicios') || '[]');
    
    // Encontra lições do tipo "Visualização" que precisam ser migradas
    const licoesVisualizacao = licoes.filter((licao: LicaoLegacy) => licao.tipo === 'Visualização');
    
    if (licoesVisualizacao.length === 0) {
      console.log('Nenhuma lição de visualização encontrada para migrar');
      return { migradas: 0, exerciciosCriados: 0 };
    }
    
    const exerciciosCriados = [];
    
    // Converte cada lição de visualização em exercício passivo
    for (const licao of licoesVisualizacao) {
      const novoExercicio = {
        id: Math.random().toString(36).substr(2, 9),
        titulo: `${licao.titulo} - Sequência`,
        descricao: licao.descricao || `Visualização da sequência: ${licao.titulo}`,
        licaoId: licao.id,
        ordem: 1, // Primeiro exercício da lição
        tipo: 'Conceitual',
        modo: 'Passivo',
        dificuldade: licao.dificuldade || 'Iniciante',
        status: licao.status || 'Ativo',
        conteudo: {
          posicaoInicial: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          contexto: licao.conteudo?.introducao || '',
          pergunta: '',
          sequenciaMovimentos: licao.conteudo?.movimentos?.map((mov) => ({
            id: mov.id || Math.random().toString(36).substr(2, 9),
            movimento: mov.movimento || '',
            posicaoFEN: mov.posicaoFEN || '',
            explicacao: mov.explicacao || '',
            destaque: mov.destaque,
            tempo: mov.tempo
          })) || [],
          opcoes: [],
          movimentoCorreto: [],
          explicacao: licao.conteudo?.explicacao || '',
          dicas: licao.conteudo?.dicas || [],
          feedbackCorreto: 'Sequência concluída com sucesso!',
          feedbackIncorreto: ''
        },
        pontuacao: licao.pontuacao || 100,
        tempoLimite: undefined,
        tentativasMaximas: 1,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0]
      };
      
      exerciciosCriados.push(novoExercicio);
    }
    
    // Atualiza as lições removendo o tipo "Visualização" e simplificando o conteúdo
    const licoesAtualizadas = licoes.map((licao: LicaoLegacy) => {
      if (licao.tipo === 'Visualização') {
        return {
          ...licao,
          // Remove o campo tipo (agora só conceituais)
          tipo: undefined,
          conteudo: {
            introducao: licao.conteudo?.introducao || '',
            explicacao: licao.conteudo?.explicacao || '',
            conceitos: [], // Novo campo
            dicas: licao.conteudo?.dicas || [],
            conclusao: licao.conteudo?.conclusao || '',
            recursosAdicionais: []
          }
        };
      }
      return licao;
    });
    
    // Salva os dados atualizados
    localStorage.setItem('chess-openings-licoes', JSON.stringify(licoesAtualizadas));
    localStorage.setItem('chess-openings-exercicios', JSON.stringify([...exercicios, ...exerciciosCriados]));
    
    console.log(`Migração concluída: ${licoesVisualizacao.length} lições convertidas, ${exerciciosCriados.length} exercícios criados`);
    
    return {
      migradas: licoesVisualizacao.length,
      exerciciosCriados: exerciciosCriados.length
    };
    
  } catch (error) {
    console.error('Erro durante migração:', error);
    return { migradas: 0, exerciciosCriados: 0, erro: error };
  }
};

// Função para verificar se a migração já foi executada
export const verificarMigracaoNecessaria = (): boolean => {
  try {
    const licoes: LicaoLegacy[] = JSON.parse(localStorage.getItem('chess-openings-licoes') || '[]');
    return licoes.some((licao: LicaoLegacy) => licao.tipo === 'Visualização');
  } catch {
    return false;
  }
}; 