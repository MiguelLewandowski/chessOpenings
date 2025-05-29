'use client';

import { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { 
  getStorageStats, 
  hasStoredData, 
  clearChessOpeningsData,
  exportData,
  importData,
  type ExportedData,
  migrateLicoesVisualizacaoToExercicios,
  verificarMigracaoNecessaria
} from '@/utils/localStorage';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes } from '@/hooks/useLicoes';
import { useExercicios } from '@/hooks/useExercicios';

// Dados de exemplo para popular o sistema (opcionais)
const exemploAberturas = [
  {
    nome: 'Abertura Italiana',
    categoria: 'Tática' as const,
    dificuldade: 'Iniciante' as const,
    movimentos: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    descricao: 'Uma das aberturas mais antigas e clássicas do xadrez',
    status: 'Ativo' as const,
  },
  {
    nome: 'Defesa Siciliana',
    categoria: 'Tática' as const,
    dificuldade: 'Intermediário' as const,
    movimentos: ['e4', 'c5'],
    descricao: 'A defesa mais popular contra 1.e4',
    status: 'Ativo' as const,
  }
];

export default function LocalStorageDebug() {
  const [stats, setStats] = useState<ReturnType<typeof getStorageStats> | null>(null);
  const [storedData, setStoredData] = useState<ReturnType<typeof hasStoredData> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { aberturas, getStats: getAberturaStats, createAbertura } = useAberturas();
  const { licoes, getStats: getLicaoStats } = useLicoes();
  const { exercicios, getStats: getExercicioStats } = useExercicios();

  const updateStats = () => {
    setStats(getStorageStats());
    setStoredData(hasStoredData());
  };

  useEffect(() => {
    updateStats();
  }, [aberturas, licoes, exercicios]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      const success = clearChessOpeningsData();
      if (success) {
        showMessage('success', 'Dados limpos com sucesso! Recarregue a página.');
      } else {
        showMessage('error', 'Erro ao limpar dados.');
      }
      updateStats();
    }
  };

  const handlePopularExemplos = async () => {
    if (aberturas.length > 0) {
      if (!window.confirm('Já existem dados cadastrados. Deseja adicionar os exemplos mesmo assim?')) {
        return;
      }
    }

    try {
      for (const abertura of exemploAberturas) {
        await createAbertura(abertura);
      }
      showMessage('success', `${exemploAberturas.length} aberturas de exemplo adicionadas!`);
    } catch {
      showMessage('error', 'Erro ao adicionar dados de exemplo.');
    }
  };

  // Função para analisar relações entre dados
  const analyzeDataRelations = () => {
    const relations = aberturas.map(abertura => {
      const licoesRelacionadas = licoes.filter(licao => licao.aberturaId === abertura.id);
      const exerciciosRelacionados = exercicios.filter(exercicio => 
        licoesRelacionadas.some(licao => licao.id === exercicio.licaoId)
      );
      
      return {
        abertura: abertura.nome,
        aberturaId: abertura.id,
        licoes: licoesRelacionadas.length,
        exercicios: exerciciosRelacionados.length,
        licoesDetalhes: licoesRelacionadas.map(l => ({ id: l.id, titulo: l.titulo })),
        exerciciosDetalhes: exerciciosRelacionados.map(e => ({ id: e.id, titulo: e.titulo }))
      };
    });
    
    return relations;
  };

  const dataRelations = analyzeDataRelations();

  const handleExportData = () => {
    const exported = exportData();
    if (exported) {
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chess-openings-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('success', 'Dados exportados com sucesso!');
    } else {
      showMessage('error', 'Erro ao exportar dados.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as ExportedData;
        
        const success = importData(imported);
        if (success) {
          showMessage('success', 'Dados importados com sucesso! Recarregue a página.');
          updateStats();
        } else {
          showMessage('error', 'Erro ao importar dados.');
        }
      } catch {
        showMessage('error', 'Arquivo inválido ou corrompido.');
      }
    };
    reader.readAsText(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Função para executar migração
  const executarMigracao = () => {
    if (confirm('⚠️ MIGRAÇÃO IMPORTANTE\n\nIsto irá converter todas as lições do tipo "Visualização" em exercícios passivos.\n\nAs lições serão simplificadas para apenas conteúdo conceitual.\n\nEsta operação não pode ser desfeita. Continuar?')) {
      const resultado = migrateLicoesVisualizacaoToExercicios();
      
      if (resultado.erro) {
        alert(`Erro durante migração: ${resultado.erro}`);
      } else {
        alert(`✅ Migração concluída!\n\n${resultado.migradas} lições migradas\n${resultado.exerciciosCriados} exercícios criados\n\nRecarregue a página para ver as mudanças.`);
        window.location.reload();
      }
    }
  };

  const migracaoNecessaria = verificarMigracaoNecessaria();

  if (!stats || !storedData) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const aberturaStats = getAberturaStats();
  const licaoStats = getLicaoStats();
  const exercicioStats = getExercicioStats();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-blue-600" size={24} />
        <h2 className="font-title text-xl font-bold text-gray-900">
          Debug LocalStorage
        </h2>
      </div>

      {/* Mensagem de status */}
      {message && (
        <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {message.text}
        </div>
      )}

      {/* Aviso se não há dados */}
      {aberturaStats.total === 0 && licaoStats.total === 0 && exercicioStats.total === 0 && (
        <div className="p-4 rounded-lg mb-4 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle size={16} />
            <span className="font-medium">Sistema iniciado sem dados</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            O sistema está vazio. Use os botões abaixo para popular com dados de exemplo ou criar conteúdo via painel administrativo.
          </p>
        </div>
      )}

      {/* Estatísticas de Armazenamento */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="font-interface text-lg font-semibold text-gray-900">
            Estatísticas de Storage
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de itens:</span>
              <span className="font-mono">{stats.itemCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tamanho total:</span>
              <span className="font-mono">{formatBytes(stats.totalSize)}</span>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(stats.items).map(([key, item]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{key}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{formatBytes(item.size)}</span>
                  {item.hasData ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <AlertCircle size={14} className="text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-interface text-lg font-semibold text-gray-900">
            Dados da Aplicação
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Aberturas:</span>
              <span className="font-mono">{aberturaStats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lições:</span>
              <span className="font-mono">{licaoStats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Exercícios:</span>
              <span className="font-mono">{exercicioStats.total}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Última atualização: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Relações entre Dados */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Database size={18} className="text-white" />
          </div>
          <h3 className="font-interface font-bold text-lg text-gray-900">
            Relações entre Dados
          </h3>
        </div>
        
        <div className="space-y-4">
          {dataRelations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma abertura cadastrada
            </p>
          ) : (
            dataRelations.map((relation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-interface font-semibold text-gray-900">
                    {relation.abertura}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-blue-600">
                      <CheckCircle size={16} />
                      {relation.licoes} lições
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Zap size={16} />
                      {relation.exercicios} exercícios
                    </span>
                  </div>
                </div>
                
                {relation.licoes > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                      Lições vinculadas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relation.licoesDetalhes.map(licao => (
                        <span key={licao.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {licao.titulo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {relation.exercicios > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                      Exercícios vinculados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relation.exerciciosDetalhes.map(exercicio => (
                        <span key={exercicio.id} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {exercicio.titulo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {relation.licoes === 0 && relation.exercicios === 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    ⚠️ Esta abertura não possui lições ou exercícios vinculados
                  </p>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-interface font-semibold text-yellow-800 mb-1">
                Sobre a Exclusão em Cascata
              </h4>
              <p className="text-yellow-700 text-sm">
                Ao excluir uma abertura, todas as lições e exercícios relacionados 
                serão automaticamente removidos. Esta operação não pode ser desfeita.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Migração */}
      {migracaoNecessaria && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Migração Necessária
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Foram detectadas lições do tipo &ldquo;Visualização&rdquo; que precisam ser migradas para a nova estrutura.
                </p>
                <div className="mt-3">
                  <p className="text-sm text-yellow-700">
                    <strong>O que será feito:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 mt-1 space-y-1">
                    <li>Lições &ldquo;Visualização&rdquo; → Exercícios &ldquo;Passivos&rdquo;</li>
                    <li>Movimentos migrados para sequência de exercícios</li>
                    <li>Lições simplificadas para conteúdo conceitual</li>
                    <li>Manutenção da hierarquia e relacionamentos</li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={executarMigracao}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Executar Migração
            </button>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={updateStats}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>

        <button
          onClick={handlePopularExemplos}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Zap size={16} />
          Popular Exemplos
        </button>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Download size={16} />
          Exportar
        </button>

        <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
          <Upload size={16} />
          Importar
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
        </label>

        <button
          onClick={handleClearData}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 size={16} />
          Limpar Tudo
        </button>
      </div>
    </div>
  );
} 