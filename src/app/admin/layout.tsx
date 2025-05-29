'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Puzzle,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Visão geral do sistema'
  },
  {
    name: 'Aberturas',
    href: '/admin/aberturas',
    icon: BookOpen,
    description: 'Gerenciar aberturas de xadrez'
  },
  {
    name: 'Lições',
    href: '/admin/licoes',
    icon: Target,
    description: 'Criar e editar lições'
  },
  {
    name: 'Exercícios',
    href: '/admin/exercicios',
    icon: Puzzle,
    description: 'Configurar exercícios práticos'
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-screen flex-col lg:h-full">
          {/* Header do Sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <h1 className="font-title text-2xl font-bold text-gray-900">
                Chess<span className="text-blue-600">Openings</span>
              </h1>
              <span className="ml-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-interface font-bold px-3 py-1 rounded-full shadow-sm">
                Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 px-4 py-6 space-y-3">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center p-4 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? 'bg-blue-700 bg-opacity-30 shadow-inner' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <item.icon
                      size={20}
                      className={`${
                        isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                      }`}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`font-interface font-bold text-sm ${
                      isActive ? 'text-white' : ''
                    }`}>
                      {item.name}
                    </p>
                    <p className={`font-body text-xs mt-1 ${
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight size={16} className="text-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer do Sidebar */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center">
                <Settings size={18} className="text-gray-600" />
              </div>
              <span className="ml-3 font-interface font-semibold text-sm">Configurações</span>
            </button>
            <button className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center">
                <LogOut size={18} className="text-red-600" />
              </div>
              <span className="ml-3 font-interface font-semibold text-sm">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 min-h-screen lg:min-h-0">
        {/* Header Mobile */}
        <header className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border-b border-gray-200 lg:hidden sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-title text-xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
} 