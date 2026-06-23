'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Plus, Search, Mail, Phone, Loader2,
} from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // SlideOver state
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: '', contactoEmail: '', contactoTelefono: '', pais: '' });

  const fetchClientes = useCallback(async () => {
    try {
      const res = await fetch('/api/clientes');
      const json = await res.json();
      setClientes(json.clientes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.contactoEmail) return;
    setSaving(true);
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsSlideOpen(false);
        setForm({ nombre: '', contactoEmail: '', contactoTelefono: '', pais: '' });
        fetchClientes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = clientes.filter((c) => {
    if (!searchTerm) return true;
    return c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactoEmail.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Clientes</h1>
          <p className="text-base text-slate-400 dark:text-slate-500 mt-1">Gestión de tu cartera de clientes</p>
        </div>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-nexo-500/20"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* SlideOver for New Client */}
      <SlideOver
        isOpen={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title="Crear Nuevo Cliente"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Nombre del cliente *</label>
            <input 
              type="text" 
              required
              value={form.nombre} 
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
              placeholder="Empresa SA"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Email de contacto *</label>
            <input 
              type="email" 
              required
              value={form.contactoEmail} 
              onChange={(e) => setForm({ ...form, contactoEmail: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
              placeholder="contacto@empresa.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Teléfono</label>
            <input 
              type="text" 
              value={form.contactoTelefono} 
              onChange={(e) => setForm({ ...form, contactoTelefono: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
              placeholder="+1 234 567 890"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">País</label>
            <input 
              type="text" 
              value={form.pais} 
              onChange={(e) => setForm({ ...form, pais: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 text-slate-900 dark:text-white transition-all" 
              placeholder="Ej. México"
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => setIsSlideOpen(false)} 
              className="px-4 py-2.5 text-base font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="px-6 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md shadow-nexo-500/20"
            >
              {saving ? 'Guardando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input 
          type="text" 
          placeholder="Buscar clientes..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nexo-500/20 focus:border-nexo-500 transition-all" 
        />
      </div>

      {/* Client Cards */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-nexo-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-base text-slate-400 dark:text-slate-500">No se encontraron clientes</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cliente) => (
            <div key={cliente._id} className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-nexo-500 to-nexo-700 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                  {cliente.nombre.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-slate-900 dark:text-white truncate">{cliente.nombre}</div>
                  {cliente.pais && <div className="text-xs text-slate-400 dark:text-slate-500">{cliente.pais}</div>}
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />{cliente.contactoEmail}</div>
                {cliente.contactoTelefono && (
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />{cliente.contactoTelefono}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
