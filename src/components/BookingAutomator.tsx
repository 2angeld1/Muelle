'use client';

import React from 'react';
import { Play, CheckCircle2, FileText, Loader2, Send, Terminal, ShieldCheck, Lock } from 'lucide-react';
import { useBookingAutomation } from '@/hooks/useBookingAutomation';

export default function BookingAutomator() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    bookingNumber,
    setBookingNumber,
    status,
    logs,
    progress,
    startAutomation,
    reset,
    approve,
  } = useBookingAutomation();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Header Estilo Apple */}
      <div className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-3">
          <Terminal className="text-slate-900 w-6 h-6" />
          Automatización de Declaraciones
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Conecta tus credenciales y deja que Caitlyn orqueste la extracción y validación de tus documentos en segundos.
        </p>

        {/* Input Area */}
        <div className="mt-10 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Usuario Naviera</label>
              <input
                type="text"
                placeholder="admin@agencia.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={status !== 'idle'}
                className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status !== 'idle'}
                className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Número de Booking</label>
              <input
                type="text"
                placeholder="Ej: MEDUX4590123"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                disabled={status !== 'idle'}
                className="w-full h-16 bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-xl font-bold tracking-widest text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all uppercase disabled:opacity-50"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={startAutomation}
                disabled={!bookingNumber || !username || !password || status !== 'idle'}
                className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:bg-zinc-100 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
              >
                {status === 'idle' ? (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Ejecutar Caitlyn
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <Lock className="w-4 h-4 text-slate-900 mt-1 shrink-0" />
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
              <strong className="text-slate-900">Privacidad 100% Garantizada:</strong> Tu contraseña se protege con seguridad bancaria. Nadie en nuestro equipo puede leerla ni se guarda en nuestros servidores. Caitlyn solo la utiliza como una llave invisible durante el proceso, y luego la olvida por completo.
            </p>
          </div>
        </div>
      </div>

      {/* Terminal View Estilo Apple Pro */}
      {(status === 'running' || status === 'draft' || status === 'sent') && (
        <div className="bg-[#1c1c1e] rounded-[32px] border border-zinc-800 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
          <div className="h-12 bg-[#2c2c2e] flex items-center px-6 gap-2 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-4 text-[11px] font-medium text-zinc-500 tracking-wider">CAITLYN AGENT RUNTIME v3.0</span>
          </div>
          
          <div className="p-8 font-mono text-[13px] h-72 overflow-y-auto flex flex-col gap-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-zinc-600 shrink-0">{new Date().toLocaleTimeString([], { hour12: false })}</span>
                {log.type === 'process' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin mt-0.5" />}
                {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />}
                {log.type === 'info' && <ShieldCheck className="w-4 h-4 text-zinc-400 mt-0.5" />}
                <span className={`
                  ${log.type === 'success' ? 'text-emerald-400 font-bold' : ''}
                  ${log.type === 'info' ? 'text-zinc-100' : ''}
                  ${log.type === 'process' ? 'text-zinc-300' : ''}
                `}>
                  {log.text}
                </span>
              </div>
            ))}
            {status === 'running' && (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-5 bg-blue-500 animate-pulse"></span>
              </div>
            )}
          </div>
          
          {/* Progress Bar Minimalista */}
          <div className="h-1 bg-zinc-800 w-full">
            <div 
              className="h-full bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Draft UI (Borrador Estilo Apple) */}
      {status === 'draft' && (
        <div className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Borrador Generado</h3>
              <p className="text-blue-600 text-sm font-bold tracking-tight">Listo para aprobación final</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 transition-hover hover:bg-white hover:shadow-md transition-all">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Vessel / Naviera</div>
              <div className="text-slate-900 font-bold text-lg">MSC ANNA V.402</div>
            </div>
            <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">ETA Declarado</div>
              <div className="text-slate-900 font-bold text-lg">14 de Mayo, 2026</div>
            </div>
            <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Origen / Destino</div>
              <div className="text-slate-900 font-bold text-lg">Ningbo, CN ➔ Manzanillo, PA</div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-2">Auditoría IA</div>
              <div className="text-emerald-700 font-bold flex items-center gap-2 text-lg">
                <ShieldCheck className="w-5 h-5" /> Sin discrepancias
              </div>
            </div>
          </div>

          <button
            onClick={approve}
            className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10"
          >
            <Send className="w-5 h-5" /> Aprobar y Enviar Documentos
          </button>
        </div>
      )}

      {/* Sent State Estilo Apple */}
      {status === 'sent' && (
        <div className="bg-white border border-zinc-100 rounded-[40px] p-16 text-center animate-in fade-in zoom-in duration-500 shadow-xl">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">¡Envío Completado!</h3>
          <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto leading-relaxed">
            Los documentos han sido procesados y enviados exitosamente.
          </p>
          <button
            onClick={reset}
            className="mt-10 px-8 py-3 bg-zinc-100 text-slate-900 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all"
          >
            Procesar otro Booking
          </button>
        </div>
      )}
    </div>
  );
}
