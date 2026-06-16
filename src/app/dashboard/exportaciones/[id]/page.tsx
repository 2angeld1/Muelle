'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Package, MapPin, Ship, FileText, Container,
  Clock, CheckCircle2, AlertTriangle, Trash2, Loader2,
  Edit3, Save, X, Calendar,
} from 'lucide-react';

const ESTATUS_LABELS: Record<string, string> = {
  EN_PREPARACION: 'En preparación',
  EN_TRANSITO: 'En tránsito',
  EN_ADUANA: 'En aduana',
  ENTREGADA: 'Entregada',
};

const ESTATUS_BADGE: Record<string, string> = {
  EN_PREPARACION: 'bg-blue-100 text-blue-800',
  EN_TRANSITO: 'bg-indigo-100 text-indigo-800',
  EN_ADUANA: 'bg-amber-100 text-amber-800',
  ENTREGADA: 'bg-emerald-100 text-emerald-800',
};

const DOC_LABELS: Record<string, string> = {
  FACTURA: 'Factura Comercial',
  PACKING_LIST: 'Packing List',
  BL: 'Bill of Lading (BL)',
  CERTIFICADO_ORIGEN: 'Certificado de Origen',
  DECLARACION_ADUANERA: 'Declaración Aduanera',
  SEGURO: 'Seguro',
  ORDEN_COMPRA: 'Orden de Compra',
  OTRO: 'Otro',
};

const ESTATUS_DOC_ICON: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  PENDIENTE: { icon: AlertTriangle, color: 'text-amber-500' },
  RECIBIDO: { icon: Clock, color: 'text-blue-500' },
  VERIFICADO: { icon: CheckCircle2, color: 'text-emerald-500' },
};

const CONTENEDOR_LABELS: Record<string, string> = {
  EN_PATIO: 'En patio',
  CARGADO: 'Cargado',
  EN_TRANSITO: 'En tránsito',
  EN_DESTINO: 'En destino',
  ENTREGADO: 'Entregado',
};

const ESTATUS_FLOW = ['EN_PREPARACION', 'EN_TRANSITO', 'EN_ADUANA', 'ENTREGADA'] as const;

export default function ExportacionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exportacion, setExportacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('documentos');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/exportaciones/${params.id}`);
      const json = await res.json();
      if (json.exportacion) setExportacion(json.exportacion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeStatus = async (nuevoEstatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/exportaciones/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estatus: nuevoEstatus,
          notaHistorial: `Estado cambiado a ${ESTATUS_LABELS[nuevoEstatus]}`,
        }),
      });
      const data = await res.json();
      if (data.success) setExportacion(data.exportacion);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const deleteExportacion = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta exportación?')) return;
    try {
      await fetch(`/api/exportaciones/${params.id}`, { method: 'DELETE' });
      router.push('/dashboard/exportaciones');
    } catch (err) {
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

  if (!exportacion) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Package className="w-12 h-12 text-slate-200 mb-4" />
        <p className="text-slate-400 font-medium">Exportación no encontrada</p>
        <Link href="/dashboard/exportaciones" className="mt-4 text-nexo-500 text-sm font-bold hover:underline">
          Volver a exportaciones
        </Link>
      </div>
    );
  }

  const currentIdx = ESTATUS_FLOW.indexOf(exportacion.estatus);
  const nextStatus = currentIdx < ESTATUS_FLOW.length - 1 ? ESTATUS_FLOW[currentIdx + 1] : null;

  const docsPendientes = exportacion.documentos?.filter((d: any) => d.estado === 'PENDIENTE').length || 0;
  const docsTotal = exportacion.documentos?.length || 0;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/exportaciones"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-nexo-500 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a exportaciones
      </Link>

      {/* Header */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${ESTATUS_BADGE[exportacion.estatus]}`}>
                {ESTATUS_LABELS[exportacion.estatus]}
              </span>
              <span className="text-xs text-slate-400">{exportacion.naviera}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {exportacion.codigo}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {exportacion.banderaPais} {exportacion.paisDestino} — {exportacion.puerto}
              </span>
              <span className="flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-slate-400" />
                {exportacion.clienteNombre}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {nextStatus && (
              <button
                onClick={() => changeStatus(nextStatus)}
                disabled={updating}
                className="flex items-center gap-2 px-5 py-2.5 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-nexo-500/20 disabled:opacity-50"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Mover a {ESTATUS_LABELS[nextStatus]}
              </button>
            )}
            <button
              onClick={deleteExportacion}
              className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="mt-6 flex items-center gap-0">
          {ESTATUS_FLOW.map((status, i) => {
            const reached = i <= currentIdx;
            const isCurrent = status === exportacion.estatus;
            return (
              <React.Fragment key={status}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    reached
                      ? isCurrent
                        ? 'bg-nexo-500 text-white shadow-md shadow-nexo-500/30'
                        : 'bg-nexo-100 text-nexo-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {reached && !isCurrent ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${reached ? 'text-nexo-700' : 'text-slate-400'}`}>
                    {ESTATUS_LABELS[status]}
                  </span>
                </div>
                {i < ESTATUS_FLOW.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentIdx ? 'bg-nexo-400' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={<Container className="w-4 h-4" />} label="Contenedores" value={String(exportacion.contenedores?.length || 0)} />
        <InfoCard icon={<FileText className="w-4 h-4" />} label="Documentos" value={`${docsTotal - docsPendientes}/${docsTotal}`} accent={docsPendientes > 0} />
        <InfoCard
          icon={<Calendar className="w-4 h-4" />}
          label="Embarque"
          value={exportacion.fechaEmbarque
            ? new Date(exportacion.fechaEmbarque).toLocaleDateString('es-PA', { day: '2-digit', month: 'short' })
            : 'Pendiente'}
        />
        <InfoCard
          icon={<MapPin className="w-4 h-4" />}
          label="ETA"
          value={exportacion.fechaEstimadaLlegada
            ? new Date(exportacion.fechaEstimadaLlegada).toLocaleDateString('es-PA', { day: '2-digit', month: 'short' })
            : 'Pendiente'}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {[
            { id: 'documentos', label: 'Documentos', icon: FileText },
            { id: 'contenedores', label: 'Contenedores', icon: Container },
            { id: 'historial', label: 'Historial', icon: Clock },
            { id: 'notas', label: 'Notas', icon: Edit3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-nexo-500 text-nexo-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Documentos Tab */}
          {activeTab === 'documentos' && (
            <div className="space-y-3">
              {exportacion.documentos?.map((doc: any, i: number) => {
                const iconCfg = ESTATUS_DOC_ICON[doc.estado] || ESTATUS_DOC_ICON.PENDIENTE;
                const Icon = iconCfg.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${iconCfg.color}`} />
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {DOC_LABELS[doc.tipo] || doc.tipo}
                        </div>
                        <div className="text-xs text-slate-400">
                          {doc.estado === 'PENDIENTE'
                            ? 'Pendiente de recibir'
                            : doc.estado === 'RECIBIDO'
                              ? `Recibido ${doc.fechaRecibido ? new Date(doc.fechaRecibido).toLocaleDateString('es-PA') : ''}`
                              : 'Verificado ✓'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      doc.estado === 'VERIFICADO'
                        ? 'bg-emerald-50 text-emerald-700'
                        : doc.estado === 'RECIBIDO'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}>
                      {doc.estado}
                    </span>
                  </div>
                );
              })}
              {(!exportacion.documentos || exportacion.documentos.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-8">No hay documentos registrados</p>
              )}
            </div>
          )}

          {/* Contenedores Tab */}
          {activeTab === 'contenedores' && (
            <div className="space-y-3">
              {exportacion.contenedores?.map((cont: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-nexo-50 rounded-xl flex items-center justify-center">
                      <Container className="w-5 h-5 text-nexo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{cont.numero}</div>
                      <div className="text-xs text-slate-400">{cont.tipo} · Sello: {cont.sello || '—'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {CONTENEDOR_LABELS[cont.estado] || cont.estado}
                  </span>
                </div>
              ))}
              {(!exportacion.contenedores || exportacion.contenedores.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-8">No hay contenedores registrados</p>
              )}
            </div>
          )}

          {/* Historial Tab */}
          {activeTab === 'historial' && (
            <div className="space-y-3">
              {[...(exportacion.historial || [])].reverse().map((h: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80">
                  <div className="w-8 h-8 bg-nexo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-nexo-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      {ESTATUS_LABELS[h.estatus] || h.estatus}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {h.nota}
                    </div>
                    <div className="text-[10px] text-slate-300 mt-1">
                      {new Date(h.fecha).toLocaleDateString('es-PA', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notas Tab */}
          {activeTab === 'notas' && (
            <div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {exportacion.notas || 'Sin notas para esta exportación.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${accent ? 'bg-amber-50/50 border-amber-100' : 'bg-white border-slate-200/60'} shadow-sm`}>
      <div className={`flex items-center gap-2 text-xs font-medium mb-1 ${accent ? 'text-amber-600' : 'text-slate-400'}`}>
        {icon} {label}
      </div>
      <div className={`text-lg font-bold ${accent ? 'text-amber-800' : 'text-slate-900'}`}>{value}</div>
    </div>
  );
}
