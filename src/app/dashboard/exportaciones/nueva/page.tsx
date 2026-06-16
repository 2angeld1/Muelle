'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Package, Loader2, Plus,
} from 'lucide-react';
import { BANDERAS_PAIS } from '@/lib/constants';

const PAISES = Object.keys(BANDERAS_PAIS);

export default function NuevaExportacionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    clienteNombre: '',
    paisDestino: '',
    puerto: '',
    naviera: '',
    notas: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteNombre || !form.paisDestino || !form.puerto) return;

    setSaving(true);
    try {
      const res = await fetch('/api/exportaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/exportaciones/${data.exportacion._id}`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/exportaciones"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-nexo-500 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a exportaciones
      </Link>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-nexo-50 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-nexo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Nueva Exportación</h1>
            <p className="text-xs text-slate-400">Se generará un código automáticamente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cliente */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Cliente *
            </label>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={form.clienteNombre}
              onChange={(e) => setForm({ ...form, clienteNombre: e.target.value })}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
              required
            />
          </div>

          {/* País Destino */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              País destino *
            </label>
            <select
              value={form.paisDestino}
              onChange={(e) => setForm({ ...form, paisDestino: e.target.value })}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-900 transition-all appearance-none cursor-pointer"
              required
            >
              <option value="">Seleccionar país</option>
              {PAISES.map((pais) => (
                <option key={pais} value={pais}>
                  {BANDERAS_PAIS[pais]} {pais}
                </option>
              ))}
            </select>
          </div>

          {/* Puerto */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Puerto de destino *
            </label>
            <input
              type="text"
              placeholder="Ej: Puerto de Cartagena"
              value={form.puerto}
              onChange={(e) => setForm({ ...form, puerto: e.target.value })}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all"
              required
            />
          </div>

          {/* Naviera */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Naviera (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: COSCO, MSC, MAERSK"
              value={form.naviera}
              onChange={(e) => setForm({ ...form, naviera: e.target.value })}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Notas (opcional)
            </label>
            <textarea
              placeholder="Observaciones adicionales..."
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/dashboard/exportaciones"
              className="flex-1 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving || !form.clienteNombre || !form.paisDestino || !form.puerto}
              className="flex-1 h-12 flex items-center justify-center gap-2 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-nexo-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Crear Exportación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
