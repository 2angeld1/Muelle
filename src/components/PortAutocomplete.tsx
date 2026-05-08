'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Anchor, Building2, Package, Loader2 } from 'lucide-react';

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

export default function PortAutocomplete({ name, placeholder, label, accentColor = "cyan" }: PortAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Port[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  // Colores dinámicos
  const colors: Record<string, { focus: string; border: string; badge: string; text: string }> = {
    cyan: { focus: "focus-within:text-cyan-400", border: "focus-within:border-cyan-500", badge: "bg-cyan-500/20 text-cyan-400", text: "text-cyan-400" },
    blue: { focus: "focus-within:text-blue-400", border: "focus-within:border-blue-500", badge: "bg-blue-500/20 text-blue-400", text: "text-blue-400" },
  };
  const c = colors[accentColor] || colors.cyan;

  // Búsqueda con debounce
  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/ports/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
      setHighlightIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedPort(null);

    // Debounce de 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const selectPort = (port: Port) => {
    setSelectedPort(port);
    setQuery(`${port.name}, ${port.region} (${port.code})`);
    setIsOpen(false);
    setResults([]);
  };

  // Navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (highlightIndex >= 0 && results[highlightIndex]) {
          e.preventDefault();
          selectPort(results[highlightIndex]);
        } else {
          // Si no hay nada resaltado, dejamos que el Enter siga su camino
          // (probablemente enviando el formulario)
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="group relative">
      <label className={`text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ${c.focus} transition-colors`}>
        {label}
      </label>
      <div className="relative">
        <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:${accentColor === 'blue' ? 'text-blue-400' : 'text-cyan-400'} transition-colors`} />
        
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full h-14 bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-10 text-sm ${c.border} outline-none transition-all text-white placeholder:text-slate-700`}
        />

        {/* Input oculto con el valor real para el form */}
        <input type="hidden" name={name} value={selectedPort ? `${selectedPort.name}, ${selectedPort.region}` : query} />

        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 animate-spin" />
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((port, idx) => (
            <button
              key={port._id || `${port.code}-${idx}`}
              type="button"
              onClick={() => selectPort(port)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all ${
                idx === highlightIndex 
                  ? 'bg-slate-800/80' 
                  : 'hover:bg-slate-800/50'
              } ${idx !== results.length - 1 ? 'border-b border-slate-800/50' : ''}`}
            >
              {/* Ícono de tipo */}
              <div className={`w-8 h-8 rounded-xl ${c.badge} flex items-center justify-center flex-shrink-0`}>
                {TYPE_ICONS[port.type]}
              </div>

              {/* Info del puerto */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {port.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {port.region}, {port.country}
                </div>
              </div>

              {/* Badge de tipo + código */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-slate-800 px-2 py-1 rounded-lg">
                  {TYPE_LABELS[port.type]}
                </span>
                <span className={`text-[10px] font-mono font-bold ${c.text}`}>
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
