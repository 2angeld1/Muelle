'use client';

import React, { useState } from 'react';
import { BarChart, Plus, Search, Filter, Download, MoreVertical, UploadCloud } from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';

const MOCK_REPORTS = [
  { id: 1, nombre: 'Reporte_Mensual_Junio_2026.pdf', tipo: 'OPERATIVO', size: '3.4 MB', fecha: '2026-06-01' },
  { id: 2, nombre: 'Costos_Aduana_Q2.xlsx', tipo: 'FINANCIERO', size: '1.1 MB', fecha: '2026-05-15' },
  { id: 3, margin: 'Tiempos_Transito_Anual.pdf', nombre: 'Tiempos_Transito_Anual.pdf', tipo: 'ANALÍTICO', size: '5.2 MB', fecha: '2026-01-10' },
];

export default function ReportesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filtered = MOCK_REPORTS.filter(d => 
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setIsSlideOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reportes</h1>
          <p className="text-base text-slate-400 dark:text-slate-500 mt-1">Gestor de reportes operativos y analíticos generados</p>
        </div>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-nexo-500/20"
        >
          <Plus className="w-4 h-4" />
          Subir Reporte
        </button>
      </div>

      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Subir Nuevo Reporte">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <UploadCloud className="w-10 h-10 text-nexo-500 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-900 dark:text-white">Sube tu reporte Excel o PDF</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Max. 20MB</p>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Tipo de Reporte</label>
            <select className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white">
              <option>Operativo</option>
              <option>Financiero</option>
              <option>Analítico</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={() => setIsSlideOpen(false)} className="px-4 py-2.5 text-base font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Cancelar
            </button>
            <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50">
              {uploading ? 'Subiendo...' : 'Guardar Reporte'}
            </button>
          </div>
        </form>
      </SlideOver>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar reporte por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nexo-500/20"
          />
        </div>
        <button className="h-11 px-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm flex items-center gap-2 text-base text-slate-700 dark:text-slate-200 font-medium">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Reporte</th>
              <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tipo</th>
              <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tamaño</th>
              <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fecha Generación</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
                      <BarChart className="w-4 h-4" />
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">{doc.nombre}</div>
                  </div>
                </td>
                <td className="py-3.5 px-5">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
                    {doc.tipo}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <span className="text-base text-slate-500 dark:text-slate-400">{doc.size}</span>
                </td>
                <td className="py-3.5 px-5">
                  <span className="text-base text-slate-500 dark:text-slate-400">{doc.fecha}</span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-nexo-500 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
