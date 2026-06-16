'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Loader2, LogOut, Info, AlertTriangle, CheckCircle, ChevronDown, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(console.error);

    fetch('/api/notificaciones')
      .then((r) => r.json())
      .then((data) => setNotificaciones(data.notificaciones || []))
      .catch(console.error);
  }, []);

  const unreadCount = notificaciones.filter((n) => !n.leida).length;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const markAsRead = async (id: string) => {
    await fetch('/api/notificaciones', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotificaciones(notificaciones.map((n) => (n._id === id ? { ...n, leida: true } : n)));
  };

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm transition-colors">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-nexo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 font-medium"
            placeholder="Buscar en NexoExport..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5 pl-4">
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notificaciones</h3>
                <span className="text-xs font-bold text-nexo-600 dark:text-nexo-400 bg-nexo-50 dark:bg-nexo-900/30 px-2 py-0.5 rounded-full">
                  {unreadCount} nuevas
                </span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notificaciones.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">No hay notificaciones</div>
                ) : (
                  notificaciones.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.leida && markAsRead(n._id)}
                      className={`p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex gap-3 ${
                        n.leida ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-900/10'
                      }`}
                    >
                      <div className={`mt-0.5 ${
                        n.tipo === 'success' ? 'text-emerald-500' :
                        n.tipo === 'warning' ? 'text-amber-500' :
                        n.tipo === 'error' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        {n.tipo === 'success' ? <CheckCircle className="w-4 h-4" /> :
                         n.tipo === 'warning' || n.tipo === 'error' ? <AlertTriangle className="w-4 h-4" /> :
                         <Info className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={`text-sm ${n.leida ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-bold text-slate-900 dark:text-white'}`}>
                          {n.titulo}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.mensaje}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-xl transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-nexo-500 to-nexo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-nexo-500/20">
              {user ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {user ? user.nombre : 'Cargando...'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {user ? user.rol : 'Usuario'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 animate-fade-in z-50">
              <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-700 mb-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{user?.nombre}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
