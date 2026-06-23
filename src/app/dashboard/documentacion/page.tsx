'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText, Plus, Search, Filter, Download, Trash2,
  UploadCloud, Loader2, File, Image as ImageIcon,
  Table, X, CheckCircle,
} from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';
import toast from 'react-hot-toast';

const TIPOS_DOC = [
  { value: '', label: 'Todos los tipos' },
  { value: 'FACTURA', label: 'Factura Comercial' },
  { value: 'BL', label: 'Bill of Lading (BL)' },
  { value: 'PACKING_LIST', label: 'Packing List' },
  { value: 'CERTIFICADO_ORIGEN', label: 'Certificado de Origen' },
  { value: 'DECLARACION_ADUANERA', label: 'Declaración Aduanera' },
  { value: 'SEGURO', label: 'Seguro' },
  { value: 'ORDEN_COMPRA', label: 'Orden de Compra' },
  { value: 'OTRO', label: 'Otro' },
];

const TIPO_LABELS: Record<string, string> = {
  FACTURA: 'Factura',
  BL: 'Bill of Lading',
  PACKING_LIST: 'Packing List',
  CERTIFICADO_ORIGEN: 'Cert. Origen',
  DECLARACION_ADUANERA: 'Dec. Aduanera',
  SEGURO: 'Seguro',
  ORDEN_COMPRA: 'Orden Compra',
  OTRO: 'Otro',
};

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function getFileIcon(formato: string) {
  const images = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const spreadsheets = ['xlsx', 'xls', 'csv'];
  if (images.includes(formato)) return { icon: ImageIcon, bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-500' };
  if (spreadsheets.includes(formato)) return { icon: Table, bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-500' };
  return { icon: FileText, bg: 'bg-red-50 dark:bg-red-900/20', color: 'text-red-500' };
}

export default function DocumentacionPage() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tipoDoc, setTipoDoc] = useState('OTRO');
  const [exportacionCodigo, setExportacionCodigo] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterTipo) params.set('tipo', filterTipo);
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetch(`/api/documentos?${params}`);
      const data = await res.json();
      setDocumentos(data.documentos || []);
    } catch (err) {
      console.error('Error fetching docs:', err);
    } finally {
      setLoading(false);
    }
  }, [filterTipo, searchTerm]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tipo', tipoDoc);
      formData.append('exportacionCodigo', exportacionCodigo);

      setUploadProgress(40);

      const res = await fetch('/api/documentos/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUploadProgress(100);
      toast.success('Documento subido exitosamente');
      setIsSlideOpen(false);
      setSelectedFile(null);
      setTipoDoc('OTRO');
      setExportacionCodigo('');
      fetchDocs();
    } catch (err: any) {
      toast.error(err.message || 'Error al subir el documento');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;
    setDeleting(id);
    try {
      const res = await fetch('/api/documentos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Documento eliminado');
      fetchDocs();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Documentación</h1>
          <p className="text-base text-slate-400 dark:text-slate-500 mt-1">Gestor centralizado de archivos y certificados</p>
        </div>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-base font-bold transition-all shadow-md shadow-nexo-500/20"
        >
          <Plus className="w-4 h-4" />
          Subir Documento
        </button>
      </div>

      {/* Upload SlideOver */}
      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Subir Nuevo Documento">
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-nexo-500 bg-nexo-50/50 dark:bg-nexo-900/20'
                : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-800'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp"
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="text-base font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">{formatSize(selectedFile.size)}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="text-sm text-red-500 hover:text-red-600 font-medium mt-1"
                >
                  Cambiar archivo
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-nexo-500 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Haz clic o arrastra un archivo aquí
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  PDF, Excel, CSV, Word o imágenes (Max. 10MB)
                </p>
              </>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Subiendo...</span>
                <span className="text-nexo-500 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-nexo-500 rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Tipo de Documento
            </label>
            <select
              value={tipoDoc}
              onChange={(e) => setTipoDoc(e.target.value)}
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white"
            >
              {TIPOS_DOC.filter(t => t.value).map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Export Code */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Asociar a Exportación (opcional)
            </label>
            <input
              type="text"
              value={exportacionCodigo}
              onChange={(e) => setExportacionCodigo(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-base focus:outline-none focus:ring-2 focus:ring-nexo-500/20 text-slate-900 dark:text-white"
              placeholder="Ej. EXP-2026-001"
            />
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setIsSlideOpen(false); setSelectedFile(null); }}
              className="px-4 py-2.5 text-base font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-6 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-base font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Subir a la nube
                </>
              )}
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
            placeholder="Buscar por nombre o exportación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-base shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nexo-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <select
            value={filterTipo}
            onChange={(e) => { setFilterTipo(e.target.value); setLoading(true); }}
            className="h-11 px-3 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-base text-slate-700 dark:text-slate-200 shadow-sm appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-nexo-500/20"
          >
            {TIPOS_DOC.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-nexo-500" />
          </div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-20">
            <File className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-base text-slate-400 dark:text-slate-500">No se encontraron documentos</p>
            <button
              onClick={() => setIsSlideOpen(true)}
              className="mt-3 text-base text-nexo-500 hover:text-nexo-600 font-semibold"
            >
              Subir tu primer documento →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Documento</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Exportación</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tamaño</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {documentos.map((doc: any) => {
                const fileStyle = getFileIcon(doc.formato);
                const FileIcon = fileStyle.icon;
                return (
                  <tr key={doc._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${fileStyle.bg} flex items-center justify-center ${fileStyle.color}`}>
                          <FileIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[250px]">
                            {doc.nombre}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 uppercase">
                            .{doc.formato}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {TIPO_LABELS[doc.tipo] || doc.tipo}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      {doc.exportacionCodigo ? (
                        <span className="text-sm font-bold text-nexo-600 dark:text-nexo-400 bg-nexo-50 dark:bg-nexo-900/20 px-2 py-1 rounded-md">
                          {doc.exportacionCodigo}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-base text-slate-500 dark:text-slate-400">
                        {formatSize(doc.tamano)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-base text-slate-500 dark:text-slate-400">
                        {new Date(doc.createdAt).toLocaleDateString('es-PA', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={doc.cloudinaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-nexo-500 transition-colors"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          disabled={deleting === doc._id}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deleting === doc._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
