'use client';

import { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  getStorageStats, 
  hasStoredData, 
  clearChessOpeningsData,
  exportData,
  importData,
  type ExportedData
} from '@/utils/localStorage';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes } from '@/hooks/useLicoes';
import { useExercicios } from '@/hooks/useExercicios';

export default function LocalStorageDebug() {
  const [stats, setStats] = useState<ReturnType<typeof getStorageStats> | null>(null);
  const [storedData, setStoredData] = useState<ReturnType<typeof hasStoredData> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { aberturas, getStats: getAberturaStats } = useAberturas();
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