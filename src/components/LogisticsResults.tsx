'use client';

import React from 'react';
import { Ship, Clock, DollarSign, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';

interface Itinerary {
  source: string;
  shipping_line?: string;
  price?: string;
  transit_time?: string;
}

interface LogisticsResultsProps {
  results: Itinerary[];
  origin: string;
  destination: string;
}

const LogisticsResults: React.FC<LogisticsResultsProps> = ({ results, origin, destination }) => {
  if (!results || results.length === 0) return null;

  const getSourceColor = (source: string) => {
    switch (source.toUpperCase()) {
      case 'MAERSK': return 'from-blue-500 to-cyan-400';
      case 'MSC': return 'from-orange-500 to-yellow-400';
      case 'SEARATES': return 'from-emerald-500 to-teal-400';
      default: return 'from-slate-500 to-slate-400';
    }
  };

  return (
    <div id="itinerarios-resultados" className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            Itinerarios Encontrados
          </h2>
          <div className="flex items-center gap-3 text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {origin}
            </span>
            <span className="text-slate-600">→</span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs">
              <MapPin className="w-3 h-3 text-blue-400" />
              {destination}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
           <span>{results.length} Opciones detectadas por Caitlyn AI</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((it, idx) => (
          <div key={idx} className="group relative">
            {/* Gradiente de fondo al hacer hover */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${getSourceColor(it.source)} rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500`}></div>
            
            <div className="relative h-full bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col hover:border-slate-700/50 transition-colors shadow-2xl">
              {/* Header: Badge de Fuente y Naviera */}
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getSourceColor(it.source)} text-slate-950 text-[10px] font-black uppercase tracking-wider`}>
                  {it.source}
                </div>
                <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                  <Ship className="w-5 h-5 text-cyan-400" />
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {it.shipping_line || 'Naviera no especificada'}
              </h4>
              <p className="text-slate-500 text-sm mb-6">FCL Container 20' ST</p>

              {/* Detalles Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    Tránsito
                  </div>
                  <div className="text-sm font-bold text-slate-200">
                    {it.transit_time || 'Consultar'}
                  </div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <DollarSign className="w-3 h-3" />
                    Precio Estimado
                  </div>
                  <div className="text-sm font-black text-cyan-400">
                    {it.price || 'Ver detalles'}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-auto pt-4 flex gap-3">
                <button className="flex-1 h-12 bg-white text-slate-950 rounded-xl font-bold text-xs hover:bg-cyan-50 transition-all flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Reservar
                </button>
                <button className="w-12 h-12 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center border border-slate-700">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogisticsResults;
