'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Loader2, CheckCircle2 } from 'lucide-react';

export default function AlertasPage() {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notificaciones')
      .then(res => res.json())
      .then(data => {
        setNotificaciones(data.notificaciones || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notificaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setNotificaciones(notificaciones.map(n => n._id === id ? { ...n, leida: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    // Para simplificar, iteramos o enviamos un ID especial, aquí lo marcamos en el estado
    try {
      await Promise.all(notificaciones.filter(n => !n.leida).map(n => 
        fetch('/api/notificaciones', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: n._id })
        })
      ));
      setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="space-y-6 max-w-[800px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Alertas y Notificaciones
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-red-500 text-white px-2.5 py-0.5 rounded-full">
                {unreadCount} nuevas
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Historial completo de eventos del sistema</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Marcar todo leído
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-nexo-500" /></div>
        ) : notificaciones.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-400 dark:text-slate-500">No hay alertas registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {notificaciones.map(n => (
              <div 
                key={n._id} 
                onClick={() => !n.leida && markAsRead(n._id)}
                className={`p-5 flex items-start gap-4 transition-colors ${n.leida ? 'opacity-70 bg-white dark:bg-slate-800' : 'bg-blue-50/30 dark:bg-blue-900/10 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
              >
                <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  n.tipo === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                  n.tipo === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                  n.tipo === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {n.tipo === 'success' ? <CheckCircle className="w-5 h-5" /> :
                   n.tipo === 'warning' || n.tipo === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-base ${n.leida ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-bold text-slate-900 dark:text-white'}`}>
                      {n.titulo}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleDateString('es-PA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {n.mensaje}
                  </p>
                </div>
                {!n.leida && (
                  <div className="w-2.5 h-2.5 bg-nexo-500 rounded-full shrink-0 mt-2 shadow-sm shadow-nexo-500/50" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
