'use client';

import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Loader2, Anchor, ArrowUpDown } from 'lucide-react';

export default function ContenedoresPage() {
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Extraer contenedores de las exportaciones
    const fetchContenedores = async () => {
      try {
        const res = await fetch('/api/exportaciones');
        const json = await res.json();
        const exportaciones = json.exportaciones || [];
        
        let allContenedores: any[] = [];
        exportaciones.forEach((exp: any) => {
          if (exp.contenedores && exp.contenedores.length > 0) {
            exp.contenedores.forEach((cont: any) => {
              allContenedores.push({
                ...cont,
                exportacionCodigo: exp.codigo,
                clienteNombre: exp.clienteNombre,
                naviera: exp.naviera,
                estatusExp: exp.estatus
              });
            });
          }
        });
        
        // Simular algunos si no hay para el MVP
        if (allContenedores.length === 0) {
          allContenedores = [
            { numero: 'MSCU1234567', tipo: '40ft HC', sello: 'SL-987654', peso: 24500, exportacionCodigo: 'EXP-2026-001', clienteNombre: 'Comercializadora Global', naviera: 'MSC', estatusExp: 'EN_TRANSITO' },
            { numero: 'HLBU9876543', tipo: '20ft', sello: 'SL-123456', peso: 18200, exportacionCodigo: 'EXP-2026-002', clienteNombre: 'Importadora Sur', naviera: 'Hapag-Lloyd', estatusExp: 'EN_ADUANA' },
            { numero: 'CMAU5555555', tipo: '40ft NOR', sello: 'SL-555555', peso: 22100, exportacionCodigo: 'EXP-2026-003', clienteNombre: 'Distribuidora Este', naviera: 'CMA CGM', estatusExp: 'EN_PREPARACION' },
          ];
        }

        setContenedores(allContenedores);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContenedores();
  }, []);

  const filtered = contenedores.filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return c.numero.toLowerCase().includes(term) || 
           c.exportacionCodigo.toLowerCase().includes(term) ||
           c.naviera?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contenedores</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Inventario y seguimiento de unidades físicas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por número de contenedor, naviera o exportación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nexo-500/20"
          />
        </div>
        <button className="h-11 px-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-medium">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      {/* Grid view for Containers */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-nexo-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm">
          <Package className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 dark:text-slate-500 font-medium">No hay contenedores registrados</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cont, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{cont.numero}</div>
                    <div className="text-xs font-bold text-nexo-600 dark:text-nexo-400">{cont.tipo}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                  {cont.estatusExp}
                </span>
              </div>
              
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Exportación</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cont.exportacionCodigo}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Naviera</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Anchor className="w-3 h-3 text-slate-400" /> {cont.naviera || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Sello</span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">{cont.sello || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Peso Bruto</span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">{cont.peso ? `${cont.peso} kg` : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
