'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Filter, Package, RefreshCw, ChevronRight,
  Loader2, ArrowUpDown, Anchor, MapPin
} from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';

const ESTATUS_LABELS: Record<string, string> = {
  EN_PREPARACION: 'En preparación',
  EN_TRANSITO: 'En tránsito',
  EN_ADUANA: 'En aduana',
  ENTREGADA: 'Entregada',
};

const ESTATUS_BADGE: Record<string, string> = {
  EN_PREPARACION: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/50',
  EN_TRANSITO: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50',
  EN_ADUANA: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50',
  ENTREGADA: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50',
};

const FILTER_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'EN_PREPARACION', label: 'En preparación' },
  { value: 'EN_TRANSITO', label: 'En tránsito' },
  { value: 'EN_ADUANA', label: 'En aduana' },
  { value: 'ENTREGADA', label: 'Entregada' },
];

export default function ExportacionesPage() {
  const [exportaciones, setExportaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstatus, setFilterEstatus] = useState('');

  // SlideOver state
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ clienteNombre: '', paisDestino: '', puerto: '', naviera: '', notas: '' });

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterEstatus) params.set('estatus', filterEstatus);
      const res = await fetch(`/api/exportaciones?${params}`);
      const json = await res.json();
      setExportaciones(json.exportaciones || []);
    } catch (err) {
      console.error('Error fetching:', err);
    } finally {
      setLoading(false);
    }
  }, [filterEstatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        setIsSlideOpen(false);
        setForm({ clienteNombre: '', paisDestino: '', puerto: '', naviera: '', notas: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = exportaciones.filter((exp) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      exp.codigo.toLowerCase().includes(term) ||
      exp.clienteNombre.toLowerCase().includes(term) ||
      exp.paisDestino.toLowerCase().includes(term) ||
      (exp.naviera && exp.naviera.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Exportaciones</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Gestión de todas tus exportaciones activas y completadas
          </p>
        </div>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-nexo-500/20"
        >
          <Plus className="w-4 h-4" />
          Nueva Exportación
        </button>
      </div>

      {/* SlideOver for New Export */}
      <SlideOver
        isOpen={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title="Nueva Exportación"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Cliente *</label>
            <input 
              type="text" 
              required
              value={form.clienteNombre} 
              onChange={(e) => setForm({ ...form, clienteNombre: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
              placeholder="Ej. Comercializadora Global"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">País Destino *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input 
                type="text" 
                required
                value={form.paisDestino} 
                onChange={(e) => setForm({ ...form, paisDestino: e.target.value })}
                className="w-full h-11 pl-9 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
                placeholder="Ej. España"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Puerto de Destino *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Anchor className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input 
                type="text" 
                required
                value={form.puerto} 
                onChange={(e) => setForm({ ...form, puerto: e.target.value })}
                className="w-full h-11 pl-9 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
                placeholder="Ej. Puerto de Valencia"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Naviera</label>
            <input 
              type="text" 
              value={form.naviera} 
              onChange={(e) => setForm({ ...form, naviera: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
              placeholder="Ej. Maersk, MSC..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Notas Internas</label>
            <textarea 
              value={form.notas} 
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className="w-full h-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all resize-none" 
              placeholder="Información adicional sobre la carga..."
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => setIsSlideOpen(false)} 
              className="px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="px-6 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md shadow-nexo-500/20"
            >
              {saving ? 'Guardando...' : 'Crear Exportación'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por código, cliente o país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <select
            value={filterEstatus}
            onChange={(e) => { setFilterEstatus(e.target.value); setLoading(true); }}
            className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm text-slate-700 dark:text-slate-200 shadow-sm appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-nexo-500/20"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm"
          title="Refrescar"
        >
          <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-slate-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-nexo-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-400 dark:text-slate-500">No se encontraron exportaciones</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300">
                    Código <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Destino</th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Naviera</th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contenedores</th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map((exp) => (
                <Link
                  key={exp._id}
                  href={`/dashboard/exportaciones/${exp._id}`}
                  className="table-row hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-5">
                    <span className="text-sm font-bold text-nexo-700 dark:text-nexo-400">{exp.codigo}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{exp.clienteNombre}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{exp.banderaPais}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{exp.paisDestino}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{exp.naviera || '—'}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {exp.contenedores?.length || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${ESTATUS_BADGE[exp.estatus] || ''}`}>
                      {ESTATUS_LABELS[exp.estatus] || exp.estatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(exp.fechaSolicitud).toLocaleDateString('es-PA', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-nexo-500 transition-colors" />
                  </td>
                </Link>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
