'use client';

import React from 'react';
import { NAVIERA_CONFIG, NAVIERAS } from '@/lib/naviera-config';
import type { NavieraName } from '@/lib/naviera-config';
import { Ship } from 'lucide-react';

interface NavieraSelectorProps {
  value: NavieraName | '';
  onChange: (naviera: NavieraName) => void;
  disabled?: boolean;
}

export default function NavieraSelector({ value, onChange, disabled = false }: NavieraSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {NAVIERAS.map((naviera) => {
        const config = NAVIERA_CONFIG[naviera];
        const isSelected = value === naviera;

        return (
          <button
            key={naviera}
            type="button"
            disabled={disabled}
            onClick={() => onChange(naviera)}
            className={`relative p-4 rounded-2xl border-2 transition-all text-left group ${
              isSelected
                ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md disabled:opacity-50'
            }`}
          >
            {/* Indicator dot */}
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-[9px] font-black`}
                style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : config.colorHex }}
              >
                {isSelected ? (
                  <Ship className="w-4 h-4" />
                ) : (
                  naviera.slice(0, 3)
                )}
              </div>
              {!config.requiereCartaRetiro && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  Sin carta
                </span>
              )}
            </div>

            <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
              {naviera}
            </div>
            <div className={`text-[10px] mt-0.5 ${
              isSelected ? 'text-white/70' : 'text-slate-400'
            }`}>
              {config.tieneApiOficial ? '🟢 API disponible' : '🟡 Web scraping'}
            </div>
          </button>
        );
      })}
    </div>
  );
}
