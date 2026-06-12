'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Ship } from 'lucide-react';
import { NAVIERA_CONFIG } from '@/lib/naviera-config';
import type { NavieraName } from '@/lib/naviera-config';

interface EmbarqueRow {
  _id: string;
  cliente: string;
  naviera: NavieraName;
  numeroBooking: string;
  numeroContenedor?: string;
  origen: string;
  destino: string;
  estatus: string;
  fechaSolicitud: string;
  fechaCorteDocumental?: string;
  updatedAt: string;
}

interface EmbarqueTableProps {
  embarques: EmbarqueRow[];
  filterEstatus?: string;
  onFilterChange?: (estatus: string) => void;
}

const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
  SOLICITADO: { label: 'Solicitado', bg: 'bg-amber-100', text: 'text-amber-700' },
  CONFIRMADO: { label: 'Confirmado', bg: 'bg-blue-100', text: 'text-blue-700' },
  CIERRE_DOCUMENTAL: { label: 'Cierre Doc.', bg: 'bg-rose-100', text: 'text-rose-700' },
  COMPLETADO: { label: 'Completado', bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

function isNearCutoff(fecha?: string): boolean {
  if (!fecha) return false;
  const diff = new Date(fecha).getTime() - Date.now();
  return diff > 0 && diff < 48 * 60 * 60 * 1000;
}

export default function EmbarqueTable({ embarques, filterEstatus, onFilterChange }: EmbarqueTableProps) {
  const filtered = filterEstatus
    ? embarques.filter((e) => e.estatus === filterEstatus)
    : embarques;

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
      {/* Filtros */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => onFilterChange?.('')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            !filterEstatus
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-zinc-100 text-slate-500 hover:bg-zinc-200'
          }`}
        >
          Todos ({embarques.length})
        </button>
        {Object.entries(statusLabels).map(([key, { label }]) => {
          const count = embarques.filter((e) => e.estatus === key).length;
          return (
            <button
              key={key}
              onClick={() => onFilterChange?.(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterEstatus === key
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-zinc-100 text-slate-500 hover:bg-zinc-200'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <Ship className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
          <div className="text-sm font-bold text-slate-400">No hay embarques</div>
          <div className="text-xs text-slate-300 mt-1">Los embarques creados aparecerán aquí</div>
        </div>
      ) : (
        <div className="divide-y divide-zinc-50">
          {filtered.map((embarque) => {
            const config = NAVIERA_CONFIG[embarque.naviera];
            const status = statusLabels[embarque.estatus];
            const nearCutoff = isNearCutoff(embarque.fechaCorteDocumental);

            return (
              <Link
                key={embarque._id}
                href={`/embarques/${embarque._id}`}
                className={`flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors group ${
                  nearCutoff ? 'bg-rose-50/30' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Indicador de naviera */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-[10px] font-black shrink-0"
                    style={{ backgroundColor: config?.colorHex || '#64748b' }}
                  >
                    {embarque.naviera.slice(0, 3)}
                  </div>

                  {/* Info principal */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {embarque.numeroBooking || 'Booking pendiente'}
                      </span>
                      {nearCutoff && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold animate-pulse">
                          <Clock className="w-2.5 h-2.5" />
                          URGENTE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {embarque.origen} → {embarque.destino}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    {embarque.cliente}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${status?.bg} ${status?.text}`}>
                    {status?.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
