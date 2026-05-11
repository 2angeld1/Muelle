'use client';

import React, { useState } from 'react';
import { Ship, Clock, DollarSign, ExternalLink, ShieldCheck, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  if (!results || results.length === 0) return null;

  const getSourceColor = (source: string) => {
    switch (source.toUpperCase()) {
      case 'MAERSK': return 'bg-blue-500 text-white';
      case 'MSC': return 'bg-orange-500 text-white';
      case 'SEARATES': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
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

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500">
                <th className="p-6 font-black w-1/3">Compañía / Plataforma</th>
                <th className="p-6 font-black">Tiempo Tránsito</th>
                <th className="p-6 font-black">Tarifa Est.</th>
                <th className="p-6 font-black text-right">Acciones</th>
              </tr>
            </thead>
            
            {/* Agrupamos por Naviera y mostramos vista Resumen/Detalle */}
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {Object.entries(
                results.reduce((acc, it) => {
                  const src = it.source.toUpperCase();
                  if (!acc[src]) acc[src] = [];
                  acc[src].push(it);
                  return acc;
                }, {} as Record<string, Itinerary[]>)
              ).map(([source, items]) => {
                const isExpanded = expandedGroups[source];
                const bestOption = items[0]; // Usamos el primero como referencia
                
                return (
                  <React.Fragment key={source}>
                    {/* Fila Principal (Resumen de la Naviera) */}
                    <tr 
                      onClick={() => setExpandedGroups(p => ({ ...p, [source]: !p[source] }))}
                      className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-900 flex-shrink-0">
                            <Ship className={`w-5 h-5 ${source === 'MAERSK' ? 'text-blue-400' : source === 'MSC' ? 'text-orange-400' : 'text-emerald-400'}`} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">
                              {source}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getSourceColor(source)}`}>
                                OFICIAL
                              </span>
                              <span className="text-slate-500 text-xs">{items.length} opciones de ruta</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                          <Clock className="w-4 h-4 text-slate-500" />
                          Desde {bestOption.transit_time || 'Consultar'}
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="font-black text-cyan-400 flex items-center gap-1 text-lg">
                          {bestOption.price && bestOption.price.trim() ? bestOption.price : 'Por cotizar'}
                        </div>
                      </td>

                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button 
                            onClick={(e) => e.stopPropagation()} 
                            className="px-5 py-2.5 bg-white text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-50 transition-colors flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Pedir Cotización
                          </button>
                          <div className="p-2.5 bg-slate-800/50 text-slate-400 rounded-xl group-hover:text-cyan-400 group-hover:bg-slate-800 transition-colors border border-slate-700">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Filas Desplegables (Detalles de los barcos) */}
                    {isExpanded && items.map((it, idx) => (
                      <tr key={`${source}-detail-${idx}`} className="bg-slate-950/40 hover:bg-slate-900/60 transition-colors border-l-2 border-l-cyan-500/50">
                        <td className="p-4 pl-24">
                          <div className="font-bold text-slate-300 text-sm mb-0.5">
                            {it.shipping_line || 'Buque Regular'}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">Contenedor FCL 20' ST</div>
                        </td>
                        <td className="p-4 text-sm text-slate-400 font-medium">
                          {it.transit_time || 'Tránsito a confirmar'}
                        </td>
                        <td className="p-4 text-sm font-bold text-cyan-400/80">
                          {it.price && it.price.trim() ? it.price : '-'}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <button className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                            Elegir itinerario
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogisticsResults;
