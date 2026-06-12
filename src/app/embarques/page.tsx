'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, RefreshCw, Anchor, ArrowLeft, Database } from 'lucide-react';
import muelleIcon from '../icon.png';
import StatusCards from '@/components/embarques/StatusCards';
import AlertsPanel from '@/components/embarques/AlertsPanel';
import EmbarqueTable from '@/components/embarques/EmbarqueTable';

export default function EmbarquesDashboard() {
  const [data, setData] = useState<{
    embarques: any[];
    statusCounts: any;
    alertas: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterEstatus, setFilterEstatus] = useState('');
  const [seeding, setSeeding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/embarques');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching embarques:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch('/api/embarques/seed', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Error seeding:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white border border-zinc-100 group-hover:scale-105 transition-transform">
              <Image src={muelleIcon} alt="Muelle Icon" className="w-full h-full object-cover" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">MUELLE</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium text-slate-500 tracking-tight">
            <Link href="/" className="hover:text-slate-900 transition-colors">Inicio</Link>
            <Link href="/embarques" className="text-slate-900 font-bold">Embarques</Link>
            <Link href="/automator" className="hover:text-slate-900 transition-colors">Automator</Link>
          </div>
          <Link
            href="/embarques/nuevo"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-[13px] hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Embarque
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm mb-4">
                <Anchor className="w-3 h-3 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Panel Operativo</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                Embarques
              </h1>
              <p className="text-slate-400 font-medium mt-2">
                Gestión centralizada de todos tus embarques activos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-bold text-slate-500 transition-all disabled:opacity-50"
                title="Cargar datos de ejemplo"
              >
                <Database className="w-3.5 h-3.5" />
                {seeding ? 'Cargando...' : 'Demo Data'}
              </button>
              <button
                onClick={() => { setLoading(true); fetchData(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold text-slate-500 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refrescar
              </button>
            </div>
          </div>

          {loading ? (
            /* Loading State */
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-zinc-100 rounded-3xl p-6 animate-pulse">
                    <div className="w-11 h-11 bg-zinc-100 rounded-2xl mb-4"></div>
                    <div className="h-8 bg-zinc-100 rounded-lg w-16 mb-2"></div>
                    <div className="h-4 bg-zinc-50 rounded w-24"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-zinc-100 rounded-3xl p-8 animate-pulse">
                <div className="h-4 bg-zinc-100 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 bg-zinc-50 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : data ? (
            <>
              {/* Status Cards */}
              <StatusCards counts={data.statusCounts} />

              {/* Alertas */}
              <AlertsPanel alertas={data.alertas} />

              {/* Tabla de Embarques */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Todos los Embarques</h2>
                <EmbarqueTable
                  embarques={data.embarques}
                  filterEstatus={filterEstatus}
                  onFilterChange={setFilterEstatus}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Anchor className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
              <div className="text-slate-400 font-medium">Error al cargar datos</div>
              <button onClick={fetchData} className="mt-4 text-blue-600 text-sm font-bold hover:underline">
                Reintentar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
