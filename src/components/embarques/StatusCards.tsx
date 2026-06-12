'use client';

import React from 'react';
import { Package, CheckCircle2, AlertTriangle, Ship } from 'lucide-react';

interface StatusCardsProps {
  counts: {
    SOLICITADO: number;
    CONFIRMADO: number;
    CIERRE_DOCUMENTAL: number;
    COMPLETADO: number;
  };
}

const cards = [
  {
    key: 'SOLICITADO' as const,
    label: 'Solicitados',
    sublabel: 'Espera naviera',
    icon: Package,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    ring: 'ring-amber-500/20',
  },
  {
    key: 'CONFIRMADO' as const,
    label: 'Confirmados',
    sublabel: 'Espera retiro',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    ring: 'ring-blue-500/20',
  },
  {
    key: 'CIERRE_DOCUMENTAL' as const,
    label: 'En Cierre',
    sublabel: 'Próximos a vencer',
    icon: AlertTriangle,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    ring: 'ring-rose-500/20',
  },
  {
    key: 'COMPLETADO' as const,
    label: 'Completados',
    sublabel: 'En tránsito',
    icon: Ship,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    ring: 'ring-emerald-500/20',
  },
];

export default function StatusCards({ counts }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const count = counts[card.key];
        return (
          <div
            key={card.key}
            className={`relative overflow-hidden bg-white border ${card.border} rounded-3xl p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-0.5 group cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${card.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {card.key === 'CIERRE_DOCUMENTAL' && count > 0 && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
              {count}
            </div>
            <div className="text-sm font-bold text-slate-900">{card.label}</div>
            <div className="text-[11px] font-medium text-slate-400 tracking-wide">
              {card.sublabel}
            </div>

            {/* Decoración sutil de fondo */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${card.bg} rounded-full opacity-50 transition-transform group-hover:scale-150`}></div>
          </div>
        );
      })}
    </div>
  );
}
