'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Target,
  Zap,
  Brain,
  Star,
  Play,
  Eye
} from 'lucide-react';
import { useAberturas } from '@/hooks/useAberturas';
import { useLicoes } from '@/hooks/useLicoes';
import ChessPreview from '@/components/ChessPreview';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function GaleriaAberturas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterDificuldade, setFilterDificuldade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const { aberturas } = useAberturas();
  const { licoes } = useLicoes();

  // Filtrar apenas aberturas ativas
  const aberturasAtivas = aberturas.filter(abertura => abertura.status === 'Ativo');

  // Aplicar filtros
  const aberturasFiltradas = aberturasAtivas.filter(abertura => {
    const matchSearch = abertura.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       abertura.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filterCategoria === 'all' || abertura.categoria === filterCategoria;
    const matchDificuldade = filterDificuldade === 'all' || abertura.dificuldade === filterDificuldade;
    
    return matchSearch && matchCategoria && matchDificuldade;
  });

  // Ordenar aberturas
  const aberturasOrdenadas = [...aberturasFiltradas].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.nome.localeCompare(b.nome);
      case 'difficulty':
        const diffOrder = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3 };
        return diffOrder[a.dificuldade as keyof typeof diffOrder] - diffOrder[b.dificuldade as keyof typeof diffOrder];
      case 'category':
        return a.categoria.localeCompare(b.categoria);
      default:
        return 0;
    }
  });

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Tática': return <Zap className="text-red-500" size={20} />;
      case 'Posicional': return <Target className="text-blue-500" size={20} />;
      case 'Universal': return <Brain className="text-purple-500" size={20} />;
      default: return <BookOpen className="text-gray-500" size={20} />;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Tática': return 'bg-red-100 text-red-700 border-red-200';
      case 'Posicional': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Universal': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'Iniciante': return 'text-green-600 bg-green-50';
      case 'Intermediário': return 'text-yellow-600 bg-yellow-50';
      case 'Avançado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLicoesCount = (aberturaId: string) => {
    return licoes.filter(licao => licao.aberturaId === aberturaId && licao.status === 'Ativo').length;
  };

  const getEstimativaTempo = (aberturaId: string) => {
    const licoesAbertura = licoes.filter(licao => licao.aberturaId === aberturaId && licao.status === 'Ativo');
    return licoesAbertura.reduce((total, licao) => total + licao.estimativaTempo, 0);
  };

  const formatTempo = (minutos: number) => {
    if (minutos === 0) return '—';
    if (minutos < 60) return `${minutos}min`;
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h ${minutosRestantes > 0 ? `${minutosRestantes}min` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="font-title text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Galeria de Aberturas
            </h1>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Explore e aprenda as principais aberturas de xadrez com lições interativas e exercícios práticos
            </p>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
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
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-interface text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">Todas as categorias</option>
                  <option value="Tática">Tática</option>
                  <option value="Posicional">Posicional</option>
                  <option value="Universal">Universal</option>
                </select>
              </div>

              <select
                value={filterDificuldade}
                onChange={(e) => setFilterDificuldade(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-interface text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Todas as dificuldades</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg font-body focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Ordenar por nome</option>
                <option value="difficulty">Ordenar por dificuldade</option>
                <option value="category">Ordenar por categoria</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-6">
          <p className="font-body text-gray-600">
            {aberturasOrdenadas.length} {aberturasOrdenadas.length === 1 ? 'abertura encontrada' : 'aberturas encontradas'}
          </p>
        </div>

        {/* Grid de Aberturas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aberturasOrdenadas.map((abertura) => (
            <div
              key={abertura.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group transform hover:scale-105 cursor-pointer"
            >
              {/* Preview do tabuleiro */}
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <ChessPreview 
                  moves={abertura.movimentos}
                  size={280}
                />
                
                {/* Overlay com informações rápidas */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-interface font-semibold border ${getCategoriaColor(abertura.categoria)}`}>
                    <div className="flex items-center gap-1">
                      {getCategoriaIcon(abertura.categoria)}
                      {abertura.categoria}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-interface font-semibold ${getDificuldadeColor(abertura.dificuldade)}`}>
                    {abertura.dificuldade}
                  </div>
                </div>
              </div>

              {/* Conteúdo do card */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-title text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {abertura.nome}
                  </h3>
                  <p className="font-body text-gray-600 text-sm leading-relaxed">
                    {abertura.descricao}
                  </p>
                </div>

                {/* Movimentos */}
                <div className="mb-4">
                  <h4 className="font-interface font-semibold text-gray-700 text-sm mb-2">
                    Sequência inicial:
                  </h4>
                  <p className="font-mono text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    {abertura.movimentos.join(' ')}
                  </p>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="text-blue-500" size={16} />
                    </div>
                    <p className="font-title text-lg font-bold text-gray-900">
                      {getLicoesCount(abertura.id)}
                    </p>
                    <p className="font-body text-xs text-gray-600">
                      {getLicoesCount(abertura.id) === 1 ? 'Lição' : 'Lições'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="text-green-500" size={16} />
                    </div>
                    <p className="font-title text-lg font-bold text-gray-900">
                      {formatTempo(getEstimativaTempo(abertura.id))}
                    </p>
                    <p className="font-body text-xs text-gray-600">
                      Duração
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="text-yellow-500" size={16} />
                    </div>
                    <p className="font-title text-lg font-bold text-gray-900">
                      4.5
                    </p>
                    <p className="font-body text-xs text-gray-600">
                      Avaliação
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <Link
                    href={`/aberturas/${abertura.id}/trilha`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Play size={16} />
                    Estudar
                  </Link>
                  <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-interface font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
                    <Eye size={16} />
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vazio */}
        {aberturasOrdenadas.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="font-title text-xl font-bold text-gray-700 mb-2">
              Nenhuma abertura encontrada
            </h3>
            <p className="font-body text-gray-500 mb-6">
              Tente ajustar os filtros ou termos de busca
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterCategoria('all');
                setFilterDificuldade('all');
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Filter size={18} />
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 