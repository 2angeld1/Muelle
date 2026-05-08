'use client';

import React, { useState, useRef } from 'react';
import { createSearchAction } from "../actions/search";
import { Search, Calendar, Activity, Loader2 } from "lucide-react";
import PortAutocomplete from './PortAutocomplete';

interface SearchFormProps {
  onResults?: (data: { itineraries: any[], origin: string, destination: string }) => void;
  onSearchStart?: () => void;
}

export default function SearchForm({ onResults, onSearchStart }: SearchFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const socketRef = useRef<WebSocket | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearchStart) onSearchStart();
    setLoading(true);
    setMessage("🤖 Caitlyn está despertando a las navieras...");
    setStatus("idle");

    // Conectar WebSocket para recibir actualizaciones en vivo
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/caitlyn';
    socketRef.current = new WebSocket(socketUrl);
    
    socketRef.current.onmessage = (event) => {
      setMessage(event.data); // Actualizamos el mensaje con lo último que diga Caitlyn
    };

    const formData = new FormData(e.currentTarget);
    try {
      const result = await createSearchAction(formData);

      if (result?.error) {
        setMessage(`❌ Error: ${result.error}`);
        setStatus("error");
      } else if (result?.success) {
        setMessage(`✅ ¡Misión cumplida! Se encontraron ${result.data?.itineraries?.length || 0} opciones.`);
        setStatus("success");
        if (onResults) {
          onResults({
            itineraries: result.data?.itineraries || [],
            origin: formData.get("origen") as string,
            destination: formData.get("destino") as string
          });
        }
      }
    } catch (err) {
      setMessage("❌ Error de conexión con el servidor.");
      setStatus("error");
    } finally {
      setLoading(false);
      if (socketRef.current) {
        socketRef.current.close();
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Origen */}
        <PortAutocomplete
          name="origen"
          label="Origen de Carga"
          placeholder="Ej: Los Angeles, Miami, Shanghai..."
          accentColor="cyan"
        />

        {/* Campo Destino */}
        <PortAutocomplete
          name="destino"
          label="Destino Final"
          placeholder="Ej: Colon Free Zone, Balboa, Howard..."
          accentColor="blue"
        />

        {/* Campo Fecha (ETA) */}
        <div className="group">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block group-focus-within:text-slate-300 transition-colors">
            Fecha Estimada de Arribo (ETA)
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
            <input
              name="arrivalDate"
              type="date"
              className="w-full h-14 bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:border-slate-500 outline-none transition-all text-white [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Botón de Búsqueda */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
            loading
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-white text-slate-950 hover:bg-cyan-50 active:scale-[0.98] shadow-white/5"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Consultar Itinerarios
            </>
          )}
        </button>
      </form>

      {/* Mensaje de Estado */}
      {message && (
        <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
          status === "error" 
            ? "bg-red-500/10 text-red-400 border-red-500/20" 
            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        }`}>
          <Activity className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
          {message}
        </div>
      )}
    </div>
  );
}
