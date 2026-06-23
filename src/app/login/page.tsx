'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Search,
  Bell,
  Ship,
  MonitorSmartphone,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const features = [
    { icon: Search, text: 'Buscar y revisar tus exportaciones' },
    { icon: Bell, text: 'Alertas y notificaciones en tiempo real' },
    { icon: Ship, text: 'Administrar todos tus embarques' },
    { icon: MonitorSmartphone, text: 'Acceso 24/7 desde cualquier dispositivo' },
  ];

  return (
    <div className="flex min-h-screen bg-sidebar">
      {/* ── Left: Ship Image ── */}
      <div className="relative flex-[1.2] min-h-screen overflow-hidden hidden md:block">
        <Image
          src="/ship-bg.png"
          alt="Buque de carga"
          fill
          priority
          quality={85}
          className="object-cover object-center"
        />
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/10 to-sidebar/30 z-[1]" />
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="relative flex-[0.8] min-w-[380px] max-w-[530px] flex items-center justify-center bg-sidebar p-8 max-md:flex-1 max-md:min-w-0 max-md:max-w-none">
        <div className="w-full max-w-[370px] animate-fade-in">

          {/* Logo + Brand */}
          <div className="flex items-center gap-3.5 mb-10">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-white/[0.08] border border-white/10 flex items-center justify-center shadow-lg hover:-translate-y-0.5 hover:shadow-nexo-500/25 transition-all duration-300 overflow-hidden">
              <Image src="/icon.png" alt="NexoExport Logo" width={36} height={36} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[1.1rem] font-extrabold text-white tracking-tight leading-tight">NexoExport</h2>
              <span className="text-[0.72rem] text-white/40 font-medium mt-px">Plataforma de Exportaciones</span>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-7">
            <h1 className="text-[1.6rem] font-extrabold text-white tracking-tighter leading-tight mb-1">Bienvenido de nuevo</h1>
            <p className="text-[0.88rem] text-white/40">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 mb-5 bg-red-500/[0.12] border border-red-500/20 rounded-xl text-red-300 text-[0.82rem] font-medium animate-scale-in" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4.5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-[0.74rem] font-bold text-white/45 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-white/25 pointer-events-none transition-colors duration-200 group-focus-within:text-nexo-400/80" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="usuario@empresa.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border-[1.5px] border-white/10 rounded-xl text-white text-[0.9rem] placeholder:text-white/20 outline-none transition-all duration-200 focus:bg-white/[0.08] focus:border-nexo-500/50 focus:ring-[3.5px] focus:ring-nexo-500/[0.12]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-[0.74rem] font-bold text-white/45 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-white/25 pointer-events-none transition-colors duration-200 group-focus-within:text-nexo-400/80" />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border-[1.5px] border-white/10 rounded-xl text-white text-[0.9rem] placeholder:text-white/20 outline-none transition-all duration-200 focus:bg-white/[0.08] focus:border-nexo-500/50 focus:ring-[3.5px] focus:ring-nexo-500/[0.12]"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center gap-2 w-full py-3.5 mt-1 bg-nexo-500 hover:bg-nexo-600 text-white text-[0.92rem] font-bold rounded-xl border-none cursor-pointer transition-all duration-300 shadow-[0_4px_14px_rgba(30,111,217,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(30,111,217,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Ingresar al sistema</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-9">
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-6" />
            <p className="text-[0.74rem] text-white/30 font-semibold uppercase tracking-wider mb-3.5">
              En pocos clics podrás:
            </p>
            <div className="flex flex-col gap-2">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group/feat flex items-center gap-3 py-2 px-2.5 rounded-[10px] text-[0.82rem] text-white/50 transition-all duration-200 hover:bg-white/[0.04] hover:translate-x-1"
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-nexo-500/[0.12] text-nexo-400 transition-all duration-200 group-hover/feat:bg-nexo-500 group-hover/feat:text-white">
                    <f.icon size={15} />
                  </div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-10 text-center text-[0.68rem] text-white/[0.18]">
            © {new Date().getFullYear()} NexoExport · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
