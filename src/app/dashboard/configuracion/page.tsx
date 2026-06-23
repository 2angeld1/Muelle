'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Shield, Database, Bell, Loader2 } from 'lucide-react';

export default function ConfiguracionPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-nexo-500 mx-auto mb-3" />
          <p className="text-base text-slate-400 dark:text-slate-500">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[800px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Configuración</h1>
        <p className="text-base text-slate-400 dark:text-slate-500 mt-1">Ajustes de tu cuenta y gestión del sistema</p>
      </div>

      <div className="space-y-4">
        {/* Profile */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-nexo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Mi Perfil</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nexo-500 to-nexo-700 flex items-center justify-center text-white text-xl font-bold">
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{user?.nombre || 'Desconocido'}</div>
              <div className="text-sm text-nexo-500 font-medium">{user?.rol || 'Usuario'}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{user?.email || 'correo@nexoexport.com'}</div>
            </div>
          </div>
        </div>



        {/* System Info */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Database className="w-5 h-5 text-nexo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sistema</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
              <span className="text-slate-400 dark:text-slate-500">Versión</span>
              <span className="font-bold text-slate-900 dark:text-white">NexoExport {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
              <span className="text-slate-400 dark:text-slate-500">Framework</span>
              <span className="font-bold text-slate-900 dark:text-white">Next.js 15+</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
              <span className="text-slate-400 dark:text-slate-500">Base de datos</span>
              <span className="font-bold text-slate-900 dark:text-white">MongoDB</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400 dark:text-slate-500">Entorno</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Producción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
