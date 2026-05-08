'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden bg-white">
              <Image src={muelleIcon} alt="Muelle Icon" className="w-full h-full object-cover" priority />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">MUELLE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300 tracking-wide">
            <a href="#soluciones" className="hover:text-cyan-400 transition-colors">Soluciones</a>
            <a href="#rastreo" className="hover:text-cyan-400 transition-colors">Rastreo Automático</a>
            <a href="#tarifas" className="hover:text-cyan-400 transition-colors">Itinerarios</a>
          </div>
          <button className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-cyan-50 transition-colors">
            Acceso Clientes
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-cyan-900/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center pt-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Caitlyn AI Logística Activa</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
              La aduana, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">sin el dolor <br/>de cabeza.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 font-medium leading-relaxed max-w-xl">
              Plataforma de inteligencia logística que automatiza tus declaraciones, cotiza itinerarios y procesa facturas comerciales en segundos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="h-14 px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25">
                Probar Cotizador AI
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="h-14 px-8 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                Ver Demostración
              </button>
            </div>
          </div>

          {/* Tarjeta Flotante con el Formulario */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-3xl transform rotate-3 blur-xl"></div>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Globe className="text-cyan-400 w-5 h-5" />
                Buscador de Itinerarios
              </h3>
              
              <SearchForm 
                onResults={handleSearchResults} 
              />

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span>PDFs procesados hoy:</span>
                 </div>
                 <span className="text-cyan-400 font-bold">142</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SECCIÓN DE RESULTADOS (Separada del Hero) */}
      {searchResults && (
        <section className="bg-slate-950 relative border-t border-slate-900">
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
