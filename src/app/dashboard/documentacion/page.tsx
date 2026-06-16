'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Download, MoreVertical, UploadCloud } from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';

// Mock data para el MVP
const MOCK_DOCS = [
  { id: 1, nombre: 'Factura_Comercial_EXP001.pdf', tipo: 'FACTURA', exportacion: 'EXP-2026-001', size: '1.2 MB', fecha: '2026-06-15' },
  { id: 2, nombre: 'Bill_of_Lading_MSC.pdf', tipo: 'BL', exportacion: 'EXP-2026-001', size: '2.5 MB', fecha: '2026-06-14' },
  { id: 3, nombre: 'Certificado_Origen.pdf', tipo: 'CERTIFICADO', exportacion: 'EXP-2026-002', size: '0.8 MB', fecha: '2026-06-12' },
  { id: 4, nombre: 'Packing_List_Final.xlsx', tipo: 'PACKING_LIST', exportacion: 'EXP-2026-003', size: '54 KB', fecha: '2026-06-10' },
];

export default function DocumentacionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filtered = MOCK_DOCS.filter(d => 
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.exportacion.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documentación</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Gestor centralizado de archivos y certificados</p>
        </div>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-nexo-500/20"
        >
          <Plus className="w-4 h-4" />
          Subir Documento
        </button>
      </div>

      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Subir Nuevo Documento">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <UploadCloud className="w-10 h-10 text-nexo-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Haz clic o arrastra un archivo aquí</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, Excel o Word (Max. 10MB)</p>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Tipo de Documento</label>
            <select className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white">
              <option>Factura Comercial</option>
              <option>Bill of Lading (BL)</option>
              <option>Packing List</option>
              <option>Certificado de Origen</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Asociar a Exportación</label>
            <input 
              type="text" 
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white" 
              placeholder="Buscar código EXP-..."
            />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={() => setIsSlideOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Cancelar
            </button>
            <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50">
              {uploading ? 'Subiendo...' : 'Guardar en Nube'}
            </button>
          </div>
        </form>
      </SlideOver>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o exportación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nexo-500/20"
          />
        </div>
        <button className="h-11 px-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-medium">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Documento</th>
              <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Exportación</th>
              <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tamaño</th>
              <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fecha</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{doc.nombre}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{doc.tipo}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5">
                  <span className="text-xs font-bold text-nexo-600 dark:text-nexo-400 bg-nexo-50 dark:bg-nexo-900/20 px-2 py-1 rounded-md">
                    {doc.exportacion}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{doc.size}</span>
                </td>
                <td className="py-3.5 px-5">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{doc.fecha}</span>
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
