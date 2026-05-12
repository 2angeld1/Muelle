'use client';

import React, { useState } from 'react';
import { Ship, Clock, DollarSign, ExternalLink, ShieldCheck, MapPin, ChevronDown, ChevronUp, Leaf, Target, Activity, Zap } from 'lucide-react';

interface Itinerary {
  source: string;
  shipping_line?: string;
  price?: string;
  transit_time?: string;
  delay_risk?: string;
  co2_emissions?: string;
  transshipments?: string;
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
    <div id="itinerarios-resultados" className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
            Opciones de <span className="text-slate-400">Itinerario</span>
          </h2>
          <div className="flex items-center gap-4 text-slate-500 font-bold">
            <span className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-zinc-200 text-xs shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {origin}
            </span>
            <span className="text-zinc-300">→</span>
            <span className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-zinc-200 text-xs shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {destination}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span>{results.length} Rutas analizadas por Caitlyn AI</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[40px] border border-zinc-100 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] uppercase tracking-widest text-slate-400">
                <th className="p-8 font-bold w-1/3 text-slate-500">Operador Logístico</th>
                <th className="p-8 font-bold text-slate-500">Tiempo de Tránsito</th>
                <th className="p-8 font-bold text-slate-500">Tarifa Estimada</th>
                <th className="p-8 font-bold text-right text-slate-500">Gestión</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-zinc-50 text-sm">
              {Object.entries(
                results.reduce((acc, it) => {
                  const src = it.source.toUpperCase();
                  if (!acc[src]) acc[src] = [];
                  acc[src].push(it);
                  return acc;
                }, {} as Record<string, Itinerary[]>)
              ).map(([source, items]) => {
                const isExpanded = expandedGroups[source];
                const bestOption = items[0];
                
                return (
                  <React.Fragment key={source}>
                    <tr 
                      onClick={() => setExpandedGroups(p => ({ ...p, [source]: !p[source] }))}
                      className="hover:bg-zinc-50/80 transition-all group cursor-pointer"
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Ship className={`w-6 h-6 ${source === 'MAERSK' ? 'text-blue-600' : source === 'MSC' ? 'text-slate-900' : 'text-slate-900'}`} />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-lg mb-1">
                              {source}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                Canal Oficial
                              </span>
                              <span className="text-slate-400 text-xs font-medium">{items.length} conexiones</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-8">
                        <div className="flex items-center gap-3 text-slate-600 font-bold">
                          <Clock className="w-4 h-4 text-slate-400" />
                          Desde {bestOption.transit_time || 'Por confirmar'}
                        </div>
                      </td>

                      <td className="p-8">
                        <div className="font-black text-slate-900 flex items-center gap-1 text-2xl tracking-tighter">
                          {bestOption.price && bestOption.price.trim() ? bestOption.price : 'Cotizar'}
                        </div>
                      </td>

                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-6">
                          <button 
                            onClick={(e) => e.stopPropagation()} 
                            className="px-6 py-3 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Seleccionar
                          </button>
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-50 text-slate-400 group-hover:text-slate-900 transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <td colSpan={4} className="p-10 bg-zinc-50/50">
                          <div className="mb-8 flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                              <Activity className="w-4 h-4 text-blue-600" /> 
                              Comparativa de Caitlyn AI para {source}
                            </h4>
                            <button className="text-[10px] font-bold px-4 py-2 bg-white text-slate-900 hover:bg-zinc-100 rounded-full flex items-center gap-2 transition-all border border-zinc-200 shadow-sm">
                              <Target className="w-3.5 h-3.5 text-blue-600" />
                              Rastreador de precios
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {items.slice(0, 3).map((it, idx) => {
                              const tierTypes = [
                                { name: 'Eficiencia', color: 'text-slate-400', border: 'border-zinc-200', bg: 'bg-white', icon: Clock, co2: 'Standard', delay: 'Moderado' },
                                { name: 'Recomendado', color: 'text-blue-600', border: 'border-blue-100', bg: 'bg-blue-50/50', icon: ShieldCheck, co2: 'Baja', delay: 'Mínimo' },
                                { name: 'Premium', color: 'text-slate-900', border: 'border-zinc-200', bg: 'bg-white', icon: Zap, co2: 'Baja', delay: 'Nulo' },
                              ];
                              const tier = tierTypes[idx % 3];
                              const TierIcon = tier.icon;

                              return (
                                <div key={`${source}-tier-${idx}`} className={`p-8 rounded-[32px] border ${tier.border} ${tier.bg} flex flex-col relative overflow-hidden group/tier hover:scale-[1.02] transition-all shadow-sm`}>
                                  {idx === 1 && (
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                                      Best Value
                                    </div>
                                  )}
                                  
                                  <div className={`font-bold uppercase tracking-widest text-[10px] mb-4 ${tier.color} flex items-center gap-2`}>
                                    <TierIcon className="w-4 h-4" /> {tier.name}
                                  </div>
                                  <div className="font-bold text-slate-900 text-lg mb-6">
                                    {it.shipping_line || 'Servicio Express'}
                                  </div>

                                  <div className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">
                                    {it.price && it.price.trim() ? it.price : '---'}
                                    <span className="text-sm font-bold text-slate-400 ml-2 tracking-normal">/ 20'</span>
                                  </div>

                                  <div className="space-y-4 flex-grow text-xs font-medium text-slate-500">
                                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                                      <span>Tránsito</span>
                                      <span className="font-bold text-slate-900">{it.transit_time || '7 días'}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                                      <span>Fiabilidad</span>
                                      <span className={`font-bold ${it.delay_risk?.includes('Alto') ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {it.delay_risk || 'Alta'}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between pb-3">
                                      <span className="flex items-center gap-1.5">
                                        <Leaf className="w-4 h-4 text-emerald-500" /> Huella CO2
                                      </span>
                                      <span className="font-bold text-slate-900">
                                        {it.co2_emissions || 'Eco-Ship'}
                                      </span>
                                    </div>
                                  </div>

                                  <button className={`mt-8 w-full py-4 rounded-2xl font-bold text-xs transition-all ${idx === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                    Reservar Itinerario
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
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
