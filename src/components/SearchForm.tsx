'use client';

import React from 'react';
import { Search, Calendar, Activity, Loader2, UploadCloud, FileText, Wand2 } from "lucide-react";
import PortAutocomplete from './PortAutocomplete';
import { useSearchForm } from '@/hooks/useSearchForm';

interface SearchFormProps {
  onResults?: (data: { itineraries: any[], origin: string, destination: string }) => void;
  onSearchStart?: () => void;
}

export default function SearchForm({ onResults, onSearchStart }: SearchFormProps) {
  const {
    loading,
    message,
    status,
    isDragging,
    isParsingDoc,
    handleDrag,
    handleDrop,
    handleSubmit,
  } = useSearchForm(onResults, onSearchStart);

  return (
    <div className="space-y-8 relative">
      {/* Zona de Drop para Auto-completado Mágico - Estilo Apple */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-[24px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
            : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100/50'}
          ${isParsingDoc ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {isParsingDoc ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Caitlyn está leyendo...</div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-colors ${isDragging ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-900">
              Auto-Completado Mágico
            </div>
            <div className="text-[11px] text-slate-400 max-w-[180px]">
              Suelta tu documento aquí para llenar los campos al instante.
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8">
          {/* Campo Origen */}
          <PortAutocomplete
            name="origen"
            label="Puerto de Origen"
            placeholder="Desde dónde sale..."
            accentColor="slate"
          />

          {/* Campo Destino */}
          <PortAutocomplete
            name="destino"
            label="Puerto de Destino"
            placeholder="A dónde llega..."
            accentColor="slate"
          />
        </div>

        {/* Campo Fecha (ETA) */}
        <div className="group">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block group-focus-within:text-slate-900 transition-colors">
            Arribo Estimado (ETA)
          </label>
          <div className="relative">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input
              name="arrivalDate"
              type="date"
              className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl pl-14 pr-6 text-sm focus:border-slate-900 focus:bg-white outline-none transition-all text-slate-900"
            />
          </div>
        </div>

        {/* Botón de Búsqueda Estilo Pro */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-16 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${
            loading
              ? "bg-zinc-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-slate-900/10"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Consultar Itinerarios
            </>
          )}
        </button>
      </form>

      {/* Mensaje de Estado */}
      {message && (
        <div className={`p-5 rounded-2xl text-[11px] font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-4 border ${
          status === "error" 
            ? "bg-red-50 text-red-600 border-red-100" 
            : "bg-blue-50 text-blue-600 border-blue-100"
        }`}>
          <div className={`w-2 h-2 rounded-full ${status === "error" ? 'bg-red-500' : 'bg-blue-500'} ${loading ? 'animate-pulse' : ''}`} />
          {message}
        </div>
      )}
    </div>
  );
}
