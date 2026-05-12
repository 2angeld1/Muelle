'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Anchor, Building2, Package, Loader2 } from 'lucide-react';
import { usePortSearch } from '@/hooks/usePortSearch';

interface Port {
  _id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
  type: "port" | "city" | "terminal" | "depot";
  region: string;
}

interface PortAutocompleteProps {
  name: string;
  placeholder: string;
  label: string;
  accentColor?: string; // "cyan" | "blue" etc.
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  port:     <Anchor className="w-3.5 h-3.5" />,
  city:     <Building2 className="w-3.5 h-3.5" />,
  terminal: <Package className="w-3.5 h-3.5" />,
  depot:    <Package className="w-3.5 h-3.5" />,
};

const TYPE_LABELS: Record<string, string> = {
  port: "Puerto",
  city: "Ciudad",
  terminal: "Terminal",
  depot: "Depósito",
};

export default function PortAutocomplete({ name, placeholder, label, accentColor = "slate" }: PortAutocompleteProps) {
  const {
    query,
    results,
    isOpen,
    loading,
    selectedPort,
    highlightIndex,
    wrapperRef,
    inputRef,
    setIsOpen,
    handleChange,
    selectPort,
    handleKeyDown,
  } = usePortSearch();

  // Colores dinámicos estilo Apple
  const colors: Record<string, { focus: string; border: string; badge: string; text: string }> = {
    slate: { focus: "focus-within:text-slate-900", border: "focus-within:border-slate-900", badge: "bg-slate-100 text-slate-600", text: "text-slate-900" },
    blue:  { focus: "focus-within:text-blue-600", border: "focus-within:border-blue-600", badge: "bg-blue-50 text-blue-600", text: "text-blue-600" },
  };
  const c = colors[accentColor] || colors.slate;

  return (
    <div ref={wrapperRef} className="group relative">
      <label className={`text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block group-focus-within:text-slate-900 transition-colors`}>
        {label}
      </label>
      <div className="relative">
        <MapPin className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors`} />
        
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl pl-14 pr-12 text-sm focus:border-slate-900 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300`}
        />

        {/* Input oculto con el valor real para el form */}
        <input type="hidden" name={name} value={selectedPort ? `${selectedPort.name}, ${selectedPort.country} (${selectedPort.code})` : query} />

        {loading && (
          <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
        )}
      </div>

      {/* Dropdown de resultados Estilo Apple */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-3 bg-white/95 backdrop-blur-2xl border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-top-4 duration-300">
          {results.map((port, idx) => (
            <button
              key={port._id || `${port.code}-${idx}`}
              type="button"
              onClick={() => selectPort(port)}
              className={`w-full px-6 py-4 flex items-center gap-4 text-left transition-all ${
                idx === highlightIndex 
                  ? 'bg-zinc-50' 
                  : 'hover:bg-zinc-50'
              } ${idx !== results.length - 1 ? 'border-b border-zinc-100' : ''}`}
            >
              {/* Ícono de tipo */}
              <div className={`w-10 h-10 rounded-2xl ${c.badge} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                {TYPE_ICONS[port.type]}
              </div>

              {/* Info del puerto */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {port.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {port.region}, {port.country}
                </div>
              </div>

              {/* Badge de tipo + código */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-zinc-100 px-3 py-1 rounded-lg">
                  {TYPE_LABELS[port.type]}
                </span>
                <span className={`text-[11px] font-mono font-bold ${c.text}`}>
                  {port.code}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

