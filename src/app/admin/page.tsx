'use client';

import {
  BookOpen,
  Target,
  Puzzle,
  Users,
  TrendingUp,
  Plus,
  BarChart3,
  Clock,
  CheckCircle2,
  Activity,
  Zap
} from 'lucide-react';
import LocalStorageDebug from '@/components/admin/LocalStorageDebug';

export default function AdminDashboard() {
  // Dados mockados - em produção viriam de uma API
  const stats = [
    {
      title: 'Total de Aberturas',
      value: '24',
      change: '+3 este mês',
      changeType: 'positive',
      icon: BookOpen,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Lições Criadas',
      value: '156',
      change: '+12 esta semana',
      changeType: 'positive',
      icon: Target,
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Exercícios Ativos',
      value: '89',
      change: '+5 hoje',
      changeType: 'positive',
      icon: Puzzle,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Usuários Ativos',
      value: '1,247',
      change: '+87 esta semana',
      changeType: 'positive',
      icon: Users,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivity = [
    {
      type: 'abertura',
      title: 'Nova abertura adicionada: Defesa Siciliana',
      time: '2 horas atrás',
      status: 'completed',
      icon: BookOpen,
      color: 'blue'
    },
    {
      type: 'licao',
      title: 'Lição "Gambito da Dama" atualizada',
      time: '4 horas atrás',
      status: 'completed',
      icon: Target,
      color: 'green'
    },
    {
      type: 'exercicio',
      title: 'Exercício de táticas criado',
      time: '1 dia atrás',
      status: 'pending',
      icon: Puzzle,
      color: 'purple'
    },
    {
      type: 'abertura',
      title: 'Abertura Inglesa revisada',
      time: '2 dias atrás',
      status: 'completed',
      icon: BookOpen,
      color: 'blue'
    }
  ];

  const quickActions = [
    {
      title: 'Nova Abertura',
      description: 'Adicionar uma nova abertura ao catálogo',
      href: '/admin/aberturas/nova',
      icon: BookOpen,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Criar Lição',
      description: 'Desenvolver uma nova lição interativa',
      href: '/admin/licoes/nova',
      icon: Target,
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Novo Exercício',
      description: 'Configurar um exercício prático',
      href: '/admin/exercicios/novo',
      icon: Puzzle,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200',
    green: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-200'
  };

  const colorVariants: Record<string, string> = {
    blue: 'text-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    green: 'text-green-700 bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    purple: 'text-purple-700 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    orange: 'text-orange-700 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="font-title text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Administrativo
          </h1>
          <p className="font-body text-lg text-gray-600">
            Visão geral e gerenciamento do sistema ChessOpenings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-interface font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base cursor-pointer">
            <Plus size={20} />
            Novo Conteúdo
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="font-body text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="font-title text-3xl font-bold text-gray-900 mt-2 mb-3">
                  {stat.value}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} className="text-green-600" />
                    <span className="font-body text-xs font-semibold text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${colorClasses[stat.color]}`}>
                <stat.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <h2 className="font-title text-2xl font-bold text-gray-900">
            Ações Rápidas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="p-6 border-2 border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-left group hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md border ${colorVariants[action.color]}`}>
                  <action.icon size={24} />
                </div>
                <h3 className="font-interface font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
              </div>
              <p className="font-body text-gray-600 leading-relaxed">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Debug LocalStorage */}
      <LocalStorageDebug />

      {/* Grid com Atividade Recente e Estatísticas */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Atividade Recente */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <h2 className="font-title text-2xl font-bold text-gray-900">
                Atividade Recente
              </h2>
            </div>
            <button className="font-interface text-sm text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorVariants[activity.color]}`}>
                    <activity.icon size={18} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="font-body text-sm text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {activity.status === 'completed' ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : (
                    <Clock size={20} className="text-orange-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Progresso */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <h2 className="font-title text-2xl font-bold text-gray-900">
                Progresso do Mês
              </h2>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-600" />
                  <span className="font-body font-medium text-gray-700">Aberturas</span>
                </div>
                <span className="font-interface font-bold text-lg text-blue-600">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-green-600" />
                  <span className="font-body font-medium text-gray-700">Lições</span>
                </div>
                <span className="font-interface font-bold text-lg text-green-600">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Puzzle size={16} className="text-purple-600" />
                  <span className="font-body font-medium text-gray-700">Exercícios</span>
                </div>
                <span className="font-interface font-bold text-lg text-purple-600">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-sm" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 