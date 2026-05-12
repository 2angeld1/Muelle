'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Cpu } from 'lucide-react';
import muelleIcon from '../icon.png';
import BookingAutomator from '../../components/BookingAutomator';

export default function AutomatorPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 font-sans">
      {/* Navbar Minimalista Estilo Apple */}
      <nav className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white border border-zinc-100 group-hover:scale-105 transition-transform">
              <Image src={muelleIcon} alt="Muelle Icon" className="w-full h-full object-cover" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">MUELLE</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-40 pb-20 px-6 relative overflow-hidden min-h-screen flex flex-col items-center justify-center">
        
        {/* Decoración de fondo sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white border border-zinc-100 shadow-xl mb-8">
            <Cpu className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6">
            Auditor Aduanero <span className="text-slate-400">IA</span>
          </h1>
          <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
            El asistente inteligente que cruza datos, valida discrepancias y genera declaraciones de aduana en segundos.
          </p>
        </div>

        <div className="w-full relative z-10">
          <BookingAutomator />
        </div>
      </main>
    </div>
  );
}
