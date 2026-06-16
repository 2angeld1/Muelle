'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Loader2, Trash2, Shield, Mail } from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';
import { ModalConfirm } from '@/components/ui/ModalConfirm';
import toast from 'react-hot-toast';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // SlideOver form
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Modal Confirm state
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data.usuarios || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar si es ADMIN
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.rol === 'ADMIN') {
          setIsAdmin(true);
          fetchUsuarios();
        } else {
          setLoading(false);
        }
      });
  }, []);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const rol = formData.get('rol');

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, rol }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear usuario');

      toast.success('Usuario creado. Se ha enviado un correo con su contraseña temporal.');
      formElement.reset();
      fetchUsuarios();
      setIsSlideOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await fetch('/api/usuarios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userToDelete })
      });
      setUserToDelete(null);
      fetchUsuarios();
      toast.success('Usuario eliminado correctamente');
    } catch (err) {
      toast.error('Error al eliminar usuario');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-nexo-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Acceso Denegado</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Esta sección es exclusiva para Administradores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-nexo-500" /> Gestión de Usuarios
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Añade y administra los accesos al sistema</p>
        </div>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-nexo-500/20"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* SlideOver Create User */}
      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Añadir Nuevo Usuario">
        <form onSubmit={handleCreateUser} className="space-y-5">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl flex gap-3 text-sm text-blue-700 dark:text-blue-300">
            <Mail className="w-5 h-5 shrink-0" />
            <p>Se generará automáticamente una contraseña aleatoria de 8 caracteres que será enviada al correo del usuario.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Nombre Completo</label>
            <input 
              name="nombre"
              type="text" 
              required
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white" 
              placeholder="Ej. Carlos Martínez"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white" 
              placeholder="correo@nexoexport.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Rol de Acceso</label>
            <select 
              name="rol"
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white"
            >
              <option value="USER">Usuario (Visualizador/Operador)</option>
              <option value="ADMIN">Administrador (Control Total)</option>
            </select>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={() => setIsSlideOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Cancelar
            </button>
            <button type="submit" disabled={formLoading} className="px-6 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50">
              {formLoading ? 'Enviando invitación...' : 'Invitar Usuario'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden">
        {usuarios.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-400 dark:text-slate-500">No hay usuarios registrados</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Usuario</th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Correo</th>
                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rol</th>
                <th className="text-right py-3.5 px-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {usuarios.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nexo-500 to-nexo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {u.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{u.nombre}</div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="text-sm text-slate-500 dark:text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${u.rol === 'ADMIN' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button 
                      onClick={() => setUserToDelete(u._id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors rounded-xl opacity-0 group-hover:opacity-100"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ModalConfirm
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar Usuario"
        description="¿Estás seguro que deseas eliminar este usuario de forma permanente? Perderá acceso inmediato a todo el sistema."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </div>
  );
}
