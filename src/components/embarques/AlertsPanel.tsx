'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Alerta {
  _id: string;
  cliente: string;
  naviera: string;
  numeroBooking: string;
  fechaCorteDocumental: string;
  estatus: string;
}

interface AlertsPanelProps {
  alertas: Alerta[];
}

function TimeRemaining({ fechaCorte }: { fechaCorte: string }) {
  const [remaining, setRemaining] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const corte = new Date(fechaCorte).getTime();
      const diff = corte - now;

      if (diff <= 0) {
        setRemaining('¡VENCIDO!');
        setIsUrgent(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours < 24) {
        setIsUrgent(true);
        setRemaining(`${hours}h ${minutes}m`);
      } else {
        const days = Math.floor(hours / 24);
        setIsUrgent(false);
        setRemaining(`${days}d ${hours % 24}h`);
      }
    };

    update();
    const interval = setInterval(update, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [fechaCorte]);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
      isUrgent 
        ? 'bg-rose-100 text-rose-700 animate-pulse' 
        : 'bg-amber-100 text-amber-700'
    }`}>
      <Clock className="w-3 h-3" />
      {remaining}
    </span>
  );
}

export default function AlertsPanel({ alertas }: AlertsPanelProps) {
  if (alertas.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center">
        <div className="text-emerald-600 font-bold text-sm">✅ Sin alertas críticas</div>
        <div className="text-emerald-500 text-xs mt-1">Todos los embarques están dentro de plazo</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-rose-900">Alertas Críticas</div>
          <div className="text-[11px] text-rose-500">{alertas.length} embarque{alertas.length > 1 ? 's' : ''} con fecha de corte próxima</div>
        </div>
      </div>

      <div className="divide-y divide-zinc-50">
        {alertas.map((alerta) => (
          <Link
            key={alerta._id}
            href={`/embarques/${alerta._id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-rose-50/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="text-xs font-bold text-slate-900 bg-zinc-100 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">
                {alerta.naviera}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {alerta.numeroBooking || 'Sin booking'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {alerta.cliente}
                </div>
              </div>
            </div>
            <TimeRemaining fechaCorte={alerta.fechaCorteDocumental} />
          </Link>
        ))}
      </div>
    </div>
  );
}
