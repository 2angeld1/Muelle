'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Globe, FileText, Activity } from 'lucide-react';
import muelleIcon from './icon.png';
import SearchForm from '../components/SearchForm';
import LogisticsResults from '../components/LogisticsResults';

export default function Home() {
  const [searchResults, setSearchResults] = useState<{
    itineraries: any[];
    origin: string;
    destination: string;
  } | null>(null);

  const handleSearchResults = (data: { itineraries: any[], origin: string, destination: string }) => {
    setSearchResults(data);
    // Scroll suave hacia los resultados
    setTimeout(() => {
      document.getElementById('itinerarios-resultados')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Navbar Estilo Apple */}
      <nav className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white border border-zinc-100">
              <Image src={muelleIcon} alt="Muelle Icon" className="w-full h-full object-cover" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">MUELLE</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium text-slate-500 tracking-tight">
            <Link href="/embarques" className="hover:text-slate-900 transition-colors font-bold text-slate-900">Embarques</Link>
            <a href="#soluciones" className="hover:text-slate-900 transition-colors">Soluciones</a>
            <a href="#buscador-itinerarios" className="hover:text-slate-900 transition-colors">Itinerarios</a>
          </div>
          <Link href="/embarques" className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-[13px] hover:bg-slate-800 transition-all shadow-sm">
            Panel Operativo
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm mb-10">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Caitlyn AI v3.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-slate-900">
              Logística <br />
              <span className="text-slate-400">rediseñada.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed max-w-lg">
              La plataforma inteligente que automatiza declaraciones, cotiza itinerarios y procesa documentos con la precisión que tu negocio merece.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10">
                Empezar Ahora
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/automator" className="h-14 px-10 bg-white hover:bg-zinc-50 border border-zinc-200 text-slate-900 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
                Ver Demostración
              </Link>
            </div>
          </div>

          {/* Card de Búsqueda Estilo Apple */}
          <div id="buscador-itinerarios" className="relative">
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Globe className="w-32 h-32 text-slate-900" />
              </div>
              
              <h3 className="text-2xl font-bold mb-8 text-slate-900 flex items-center gap-3">
                <Globe className="text-blue-600 w-6 h-6" />
                Buscar Itinerarios
              </h3>

              <SearchForm
                onResults={handleSearchResults}
              />

              <div className="mt-10 pt-8 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Procesado por Caitlyn Vision</span>
                </div>
                <span className="text-slate-900 font-bold bg-zinc-100 px-3 py-1 rounded-lg">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SECCIÓN DE SOLUCIONES */}
      <section id="soluciones" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Soluciones Operativas</h2>
            <p className="text-slate-500 text-lg">Todo lo que necesitas para automatizar y gestionar tu logística en una sola plataforma unificada.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rastreo de Navieras</h3>
              <p className="text-slate-500 leading-relaxed">Conexión directa vía API y Scraping con COSCO, MSC, Evergreen y Seaboard para actualizaciones en tiempo real.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cartas de Retiro</h3>
              <p className="text-slate-500 leading-relaxed">Generación automática de PDFs y redirección a portales de navieras según el estado del BL y los sellos.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Alertas Predictivas</h3>
              <p className="text-slate-500 leading-relaxed">Cronómetros y notificaciones cuando se acercan las fechas críticas de corte documental o de carga física.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE RESULTADOS */}
      {searchResults && (
        <section id="itinerarios-resultados" className="bg-white relative border-t border-zinc-100 py-20">
          <LogisticsResults
            results={searchResults.itineraries}
            origin={searchResults.origin}
            destination={searchResults.destination}
          />
        </section>
      )}
    </div>
  );
}
