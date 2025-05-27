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
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="font-title text-xl font-bold text-gray-900">
                Chess<span className="text-blue-600">Openings</span>
              </h1>
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-interface font-semibold px-2 py-1 rounded">
                Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 p-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`flex-shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-interface font-semibold text-sm">
                      {item.name}
                    </p>
                    <p className="font-body text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight size={16} className="text-blue-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer do Sidebar */}
          <div className="p-6 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <Settings size={20} className="text-gray-400" />
              <span className="ml-3 font-interface font-semibold text-sm">Configurações</span>
            </button>
            <button className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={20} />
              <span className="ml-3 font-interface font-semibold text-sm">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 min-h-screen lg:min-h-0">
        {/* Header Mobile */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-title text-lg font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="w-6" /> {/* Spacer */}
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