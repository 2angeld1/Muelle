'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ship, MapPin, Package, FileText, Loader2 } from 'lucide-react';
import muelleIcon from '../../icon.png';
import NavieraSelector from '@/components/embarques/NavieraSelector';
import type { NavieraName } from '@/lib/naviera-config';

export default function NuevoEmbarque() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    cliente: 'SKECHERS',
    naviera: '' as NavieraName | '',
    origen: '',
    destino: '',
    tipoCarga: '',
    notasOperador: '',
  });

  useEffect(() => {
    fetch('/api/clientes')
      .then((res) => res.json())
      .then((data) => {
        if (data.clientes?.length > 0) {
          setClientes(data.clientes);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.naviera || !formData.origen || !formData.destino) return;

    setLoading(true);
    try {
      const res = await fetch('/api/embarques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/embarques/${data.embarque._id}`);
      } else {
        alert(data.error || 'Error al crear embarque');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.naviera && formData.origen && formData.destino && formData.cliente;

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white border border-zinc-100">
              <Image src={muelleIcon} alt="Muelle Icon" className="w-full h-full object-cover" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">MUELLE</span>
          </Link>
          <Link
            href="/embarques"
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Embarques
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white border border-zinc-100 shadow-xl mb-6">
              <Ship className="w-8 h-8 text-slate-900" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
              Nuevo Embarque
            </h1>
            <p className="text-slate-400 font-medium">
              Registra una nueva solicitud de carga
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cliente */}
            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Cliente
              </h3>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Seleccionar Cliente
                </label>
                <select
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 font-bold focus:border-slate-900 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="SKECHERS">SKECHERS</option>
                  {clientes.filter(c => c.nombre !== 'SKECHERS').map((c) => (
                    <option key={c._id} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Naviera */}
            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Ship className="w-4 h-4 text-blue-600" />
                Naviera
              </h3>
              <NavieraSelector
                value={formData.naviera}
                onChange={(naviera) => setFormData({ ...formData, naviera })}
              />
            </div>

            {/* Ruta */}
            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Ruta de Embarque
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Origen
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Ningbo, China (CNNGB)"
                      value={formData.origen}
                      onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                      className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Destino
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Manzanillo, Panamá (PAMIT)"
                      value={formData.destino}
                      onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                      className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Tipo de Carga
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Calzado deportivo"
                    value={formData.tipoCarga}
                    onChange={(e) => setFormData({ ...formData, tipoCarga: e.target.value })}
                    className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Notas del Operador
              </h3>
              <textarea
                placeholder="Notas adicionales sobre este embarque..."
                value={formData.notasOperador}
                onChange={(e) => setFormData({ ...formData, notasOperador: e.target.value })}
                rows={3}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed shadow-2xl shadow-slate-900/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creando...
                </>
              ) : (
                <>
                  <Ship className="w-5 h-5" /> Crear Embarque
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
