'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Target,
  Zap,
  MoreVertical
} from 'lucide-react';

// Tipo para aberturas
interface Abertura {
  id: string;
  nome: string;
  categoria: 'Tática' | 'Posicional' | 'Universal';
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  movimentos: string[];
  descricao: string;
  licoes: number;
  exercicios: number;
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
  criadoEm: string;
  atualizadoEm: string;
}

export default function GerenciamentoAberturas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');

  // Dados mockados - em produção viriam de uma API
  const aberturas: Abertura[] = [
    {
      id: '1',
      nome: 'Abertura Italiana',
      categoria: 'Tática',
      dificuldade: 'Iniciante',
      movimentos: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
      descricao: 'Uma das aberturas mais antigas e clássicas do xadrez',
      licoes: 8,
      exercicios: 15,
      status: 'Ativo',
      criadoEm: '2024-01-15',
      atualizadoEm: '2024-12-01'
    },
    {
      id: '2',
      nome: 'Defesa Siciliana',
      categoria: 'Tática',
      dificuldade: 'Intermediário',
      movimentos: ['e4', 'c5'],
      descricao: 'A defesa mais popular contra 1.e4',
      licoes: 12,
      exercicios: 25,
      status: 'Ativo',
      criadoEm: '2024-02-10',
      atualizadoEm: '2024-12-10'
    },
    {
      id: '3',
      nome: 'Gambito da Dama',
      categoria: 'Posicional',
      dificuldade: 'Intermediário',
      movimentos: ['d4', 'd5', 'c4'],
      descricao: 'Abertura posicional que visa controle central',
      licoes: 10,
      exercicios: 20,
      status: 'Rascunho',
      criadoEm: '2024-03-05',
      atualizadoEm: '2024-12-15'
    },
    {
      id: '4',
      nome: 'Abertura Inglesa',
      categoria: 'Universal',
      dificuldade: 'Avançado',
      movimentos: ['c4'],
      descricao: 'Abertura flexível com muitas transposições',
      licoes: 15,
      exercicios: 30,
      status: 'Ativo',
      criadoEm: '2024-04-20',
      atualizadoEm: '2024-12-18'
    }
  ];

  // Filtrar aberturas
  const aberturasFiltradas = aberturas.filter(abertura => {
    const matchSearch = abertura.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       abertura.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filterCategoria === 'all' || abertura.categoria === filterCategoria;
    const matchDificuldade = filterDificuldade === 'all' || abertura.dificuldade === filterDificuldade;
    
    return matchSearch && matchCategoria && matchDificuldade;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-700';
      case 'Arquivado': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Tática': return <Zap className="text-red-500" size={16} />;
      case 'Posicional': return <Target className="text-blue-500" size={16} />;
      case 'Universal': return <BookOpen className="text-purple-500" size={16} />;
      default: return <BookOpen className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-gray-900">
            Gerenciamento de Aberturas
          </h1>
          <p className="font-body text-gray-600 mt-2">
            Crie, edite e organize as aberturas de xadrez da plataforma
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Nova Abertura
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar aberturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as categorias</option>
              <option value="Tática">Tática</option>
              <option value="Posicional">Posicional</option>
              <option value="Universal">Universal</option>
            </select>

            <select
              value={filterDificuldade}
              onChange={(e) => setFilterDificuldade(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as dificuldades</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Aberturas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Abertura</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Categoria</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Dificuldade</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Conteúdo</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-interface font-semibold text-gray-700">Atualizado</th>
                <th className="text-right p-4 font-interface font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aberturasFiltradas.map((abertura) => (
                <tr key={abertura.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <h3 className="font-interface font-semibold text-gray-900">{abertura.nome}</h3>
                      <p className="font-body text-sm text-gray-600 mt-1">
                        {abertura.movimentos.join(' ')}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getCategoriaIcon(abertura.categoria)}
                      <span className="font-body text-sm text-gray-700">{abertura.categoria}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-gray-700">{abertura.dificuldade}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{abertura.licoes} lições</span>
                      <span>{abertura.exercicios} exercícios</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-interface font-semibold ${getStatusColor(abertura.status)}`}>
                      {abertura.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-gray-600">
                      {new Date(abertura.atualizadoEm).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Estado vazio */}
        {aberturasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="font-interface font-semibold text-gray-700 mb-2">
              Nenhuma abertura encontrada
            </h3>
            <p className="font-body text-gray-500 mb-6">
              Tente ajustar os filtros ou criar uma nova abertura
            </p>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors mx-auto">
              <Plus size={18} />
              Nova Abertura
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total</p>
              <p className="font-title text-2xl font-bold text-gray-900">{aberturas.length}</p>
            </div>
            <BookOpen className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Ativas</p>
              <p className="font-title text-2xl font-bold text-green-600">
                {aberturas.filter(a => a.status === 'Ativo').length}
              </p>
            </div>
            <Target className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Rascunhos</p>
              <p className="font-title text-2xl font-bold text-yellow-600">
                {aberturas.filter(a => a.status === 'Rascunho').length}
              </p>
            </div>
            <Edit className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-gray-600">Total Lições</p>
              <p className="font-title text-2xl font-bold text-purple-600">
                {aberturas.reduce((total, a) => total + a.licoes, 0)}
              </p>
            </div>
            <Zap className="text-purple-500" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
} 