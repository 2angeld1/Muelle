'use client';

import React, { useState } from 'react';
import { Map, Search, Navigation, Ship, CheckCircle2, Clock } from 'lucide-react';

export default function TrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tracking</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Monitoreo en tiempo real de embarques</p>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        {/* Sidebar Left: Search & Timeline */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Código de exportación (Ej. EXP-...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nexo-500/20 transition-all"
            />
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white">EXP-2026-001</h3>
                <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                  EN TRÁNSITO
                </span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Naviera: MSC</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Origen: Callao, Perú</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Destino: Valencia, España</div>
            </div>

            {/* Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-nexo-500 before:to-slate-200 dark:before:to-slate-700">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-emerald-500 text-white shrink-0 z-10 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 shadow-sm ml-4 md:ml-0">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Zarpe</div>
                    <time className="font-medium text-emerald-500 text-xs">Ayer, 10:00 AM</time>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">Contenedor cargado en buque MSC RITA.</div>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-nexo-500 text-white shrink-0 z-10 shadow-sm animate-pulse">
                  <Ship className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-nexo-200 dark:border-nexo-800 bg-white dark:bg-slate-800 shadow-md ml-4 md:ml-0">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">En tránsito oceánico</div>
                    <time className="font-medium text-nexo-500 text-xs">En vivo</time>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">Navegando por Canal de Panamá.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shrink-0 z-10">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 ml-4 md:ml-0 opacity-60">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Arribo estimado</div>
                    <time className="font-medium text-slate-500 text-xs">15 Jul</time>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">Puerto de Valencia.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-nexo-100 dark:bg-nexo-900/30 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Map className="w-10 h-10 text-nexo-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Mapa Interactivo de Tracking</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
              (Simulación MVP) El contenedor MSCU1234567 de la exportación EXP-2026-001 se encuentra navegando.
            </p>
            <button className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm">
              <Navigation className="w-4 h-4 text-nexo-500" /> Centrar Nave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
