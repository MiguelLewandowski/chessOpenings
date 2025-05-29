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
  CheckCircle2
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
      color: 'blue'
    },
    {
      title: 'Lições Criadas',
      value: '156',
      change: '+12 esta semana',
      changeType: 'positive',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Exercícios Ativos',
      value: '89',
      change: '+5 hoje',
      changeType: 'positive',
      icon: Puzzle,
      color: 'purple'
    },
    {
      title: 'Usuários Ativos',
      value: '1,247',
      change: '+87 esta semana',
      changeType: 'positive',
      icon: Users,
      color: 'orange'
    }
  ];

  const recentActivity = [
    {
      type: 'abertura',
      title: 'Nova abertura adicionada: Defesa Siciliana',
      time: '2 horas atrás',
      status: 'completed'
    },
    {
      type: 'licao',
      title: 'Lição "Gambito da Dama" atualizada',
      time: '4 horas atrás',
      status: 'completed'
    },
    {
      type: 'exercicio',
      title: 'Exercício de táticas criado',
      time: '1 dia atrás',
      status: 'pending'
    },
    {
      type: 'abertura',
      title: 'Abertura Inglesa revisada',
      time: '2 dias atrás',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Nova Abertura',
      description: 'Adicionar uma nova abertura ao catálogo',
      href: '/admin/aberturas/nova',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Criar Lição',
      description: 'Desenvolver uma nova lição interativa',
      href: '/admin/licoes/nova',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Novo Exercício',
      description: 'Configurar um exercício prático',
      href: '/admin/exercicios/novo',
      icon: Puzzle,
      color: 'purple'
    }
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    purple: 'bg-purple-600 text-white',
    orange: 'bg-orange-600 text-white'
  };

  const colorVariants: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard Administrativo
          </h1>
          <p className="font-body text-gray-600 mt-2">
            Visão geral e gerenciamento do sistema ChessOpenings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-interface font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base">
            <Plus size={18} />
            Novo Conteúdo
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600">{stat.title}</p>
                <p className="font-title text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="font-body text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-title text-xl font-bold text-gray-900 mb-6">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorVariants[action.color]}`}>
                  <action.icon size={20} />
                </div>
                <h3 className="font-interface font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
              </div>
              <p className="font-body text-sm text-gray-600">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Debug LocalStorage */}
      <LocalStorageDebug />

      {/* Grid com Atividade Recente e Estatísticas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Atividade Recente */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-title text-xl font-bold text-gray-900">
              Atividade Recente
            </h2>
            <button className="font-interface text-sm text-blue-600 hover:text-blue-700 font-semibold">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {activity.status === 'completed' ? (
                    <CheckCircle2 size={20} className="text-green-500 mt-0.5" />
                  ) : (
                    <Clock size={20} className="text-orange-500 mt-0.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-gray-900">
                    {activity.title}
                  </p>
                  <p className="font-body text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Progresso */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-title text-xl font-bold text-gray-900">
              Progresso do Mês
            </h2>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-body text-gray-600">Aberturas</span>
                <span className="font-interface font-semibold text-gray-900">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-body text-gray-600">Lições</span>
                <span className="font-interface font-semibold text-gray-900">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-body text-gray-600">Exercícios</span>
                <span className="font-interface font-semibold text-gray-900">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 