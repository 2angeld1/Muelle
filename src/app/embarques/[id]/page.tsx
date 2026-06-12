'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Ship, MapPin, Calendar, Package, FileText, Send,
  AlertTriangle, ExternalLink, Download, Loader2, Clock, CheckCircle2,
  Trash2, Info
} from 'lucide-react';
import muelleIcon from '../../icon.png';
import StateStepper from '@/components/embarques/StateStepper';
import CutoffTimer from '@/components/embarques/CutoffTimer';
import { NAVIERA_CONFIG } from '@/lib/naviera-config';
import type { NavieraName } from '@/lib/naviera-config';

export default function EmbarqueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [embarque, setEmbarque] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({
    numeroBooking: '',
    fechaCorteDocumental: '',
    fechaCorteCarga: '',
    numeroContenedor: '',
    tipoContenedor: '40HC',
  });

  const fetchEmbarque = useCallback(async () => {
    try {
      const res = await fetch(`/api/embarques/${params.id}`);
      const data = await res.json();
      if (data.embarque) {
        setEmbarque(data.embarque);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchEmbarque();
  }, [fetchEmbarque]);

  const changeStatus = async (nuevoEstatus: string, datosConfirmacion?: any) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/embarques/${params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstatus, datosConfirmacion }),
      });
      const data = await res.json();
      if (data.success) {
        setEmbarque(data.embarque);
        setShowConfirmModal(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const updateField = async (field: string, value: any) => {
    try {
      const res = await fetch(`/api/embarques/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (data.success) setEmbarque(data.embarque);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEmbarque = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este embarque?')) return;
    try {
      await fetch(`/api/embarques/${params.id}`, { method: 'DELETE' });
      router.push('/embarques');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!embarque) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center">
        <Ship className="w-12 h-12 text-zinc-200 mb-4" />
        <p className="text-slate-400 font-medium">Embarque no encontrado</p>
        <Link href="/embarques" className="mt-4 text-blue-600 text-sm font-bold hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  const navConfig = NAVIERA_CONFIG[embarque.naviera as NavieraName];

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white border border-zinc-100">
              <Image src={muelleIcon} alt="Muelle Icon" className="w-full h-full object-cover" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">MUELLE</span>
          </Link>
          <Link
            href="/embarques"
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header con badge de naviera */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="px-4 py-1.5 rounded-full text-white text-xs font-black"
                  style={{ backgroundColor: navConfig?.colorHex }}
                >
                  {embarque.naviera}
                </div>
                <span className="text-slate-400 text-sm font-medium">{embarque.cliente}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">
                {embarque.numeroBooking || 'Booking Pendiente'}
              </h1>
              <p className="text-slate-400 font-medium mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {embarque.origen} → {embarque.destino}
              </p>
            </div>
            <button
              onClick={deleteEmbarque}
              className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Eliminar embarque"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* State Stepper */}
          <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
            <StateStepper
              currentStatus={embarque.estatus}
              historial={embarque.historialEstatus}
            />
          </div>

          {/* Grid Principal */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Columna Izquierda - Info + Acciones */}
            <div className="lg:col-span-2 space-y-6">
              {/* Acciones por Estado */}
              <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6">Acciones Disponibles</h3>

                {embarque.estatus === 'SOLICITADO' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      Cuando la naviera confirme el booking, presiona el botón para registrar la confirmación.
                    </p>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={updating}
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Registrar Confirmación de Booking
                    </button>
                  </div>
                )}

                {embarque.estatus === 'CONFIRMADO' && (
                  <div className="space-y-4">
                    {/* Lógica por Naviera */}
                    {navConfig?.requiereCartaRetiro && embarque.naviera !== 'MSC' && (
                      <button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20">
                        <Download className="w-5 h-5" />
                        Generar Carta de Retiro ({embarque.naviera})
                      </button>
                    )}

                    {embarque.naviera === 'MSC' && (
                      <a
                        href="https://www.msc.com/en/ebusiness"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Abrir Portal MyMSC — Carta de Sellos
                      </a>
                    )}

                    {embarque.naviera === 'SEABOARD' && (
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-amber-900">Sin carta requerida</div>
                          <div className="text-xs text-amber-700 mt-1">
                            Seaboard no requiere carta de retiro. Utiliza el Booking PDF para liberación del contenedor.
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => changeStatus('CIERRE_DOCUMENTAL')}
                      disabled={updating}
                      className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3"
                    >
                      {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertTriangle className="w-5 h-5" />}
                      Mover a Cierre Documental
                    </button>
                  </div>
                )}

                {embarque.estatus === 'CIERRE_DOCUMENTAL' && (
                  <div className="space-y-4">
                    {!embarque.instruccionEnviada && (
                      <button
                        onClick={() => updateField('instruccionEnviada', true)}
                        className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-rose-600/20 animate-pulse"
                      >
                        <Send className="w-5 h-5" />
                        Generar Instrucción Preliminar (Emergencia)
                      </button>
                    )}

                    {embarque.instruccionEnviada && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">Instrucción enviada ✓</span>
                      </div>
                    )}

                    <button
                      onClick={() => changeStatus('COMPLETADO')}
                      disabled={updating}
                      className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20"
                    >
                      {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Ship className="w-5 h-5" />}
                      Marcar como Completado
                    </button>
                  </div>
                )}

                {embarque.estatus === 'COMPLETADO' && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                    <div className="text-lg font-bold text-emerald-900">Embarque Completado</div>
                    <div className="text-sm text-emerald-600 mt-1">
                      Este embarque ha sido cerrado exitosamente
                    </div>
                  </div>
                )}
              </div>

              {/* Detalles del Booking */}
              <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Detalles del Embarque
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoCard label="Booking" value={embarque.numeroBooking || '—'} />
                  <InfoCard label="Contenedor" value={embarque.numeroContenedor || '—'} />
                  <InfoCard label="Tipo" value={embarque.tipoContenedor || '—'} />
                  <InfoCard label="Sello" value={embarque.numeroSello || '—'} />
                  <InfoCard label="Carga" value={embarque.tipoCarga || '—'} />
                  <InfoCard
                    label="Carta de Retiro"
                    value={embarque.requiereCartaRetiro ? 'Requerida' : 'No aplica'}
                    accent={embarque.requiereCartaRetiro}
                  />
                </div>
              </div>

              {/* Historial */}
              <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Historial de Cambios
                </h3>
                <div className="space-y-3">
                  {[...embarque.historialEstatus].reverse().map((h: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 px-4 py-3 bg-zinc-50 rounded-2xl">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 w-28 shrink-0">
                        {new Date(h.fecha).toLocaleDateString('es-PA', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{h.estatus.replace('_', ' ')}</div>
                        {h.nota && <div className="text-xs text-slate-400 mt-0.5">{h.nota}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Timer + Info Naviera */}
            <div className="space-y-6">
              {/* Cutoff Timer */}
              <CutoffTimer
                fechaCorte={embarque.fechaCorteDocumental}
                label="Corte Documental"
              />

              {embarque.fechaCorteCarga && (
                <CutoffTimer
                  fechaCorte={embarque.fechaCorteCarga}
                  label="Corte de Carga"
                />
              )}

              {/* Info Naviera */}
              <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Info Naviera</h3>
                <div
                  className="w-full p-4 rounded-2xl text-white text-center mb-4"
                  style={{ backgroundColor: navConfig?.colorHex }}
                >
                  <div className="text-lg font-black">{embarque.naviera}</div>
                  <div className="text-[11px] opacity-70 mt-1">{navConfig?.metodoCartaRetiro}</div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-zinc-50">
                    <span className="text-slate-400">API Oficial</span>
                    <span className="font-bold">{navConfig?.tieneApiOficial ? '🟢 Sí' : '🟡 No'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-50">
                    <span className="text-slate-400">Carta Retiro</span>
                    <span className="font-bold">{navConfig?.requiereCartaRetiro ? 'Requerida' : 'No aplica'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Integración</span>
                    <span className="font-bold text-amber-600">Manual</span>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {embarque.notasOperador && (
                <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Notas</h3>
                  <p className="text-sm text-slate-500">{embarque.notasOperador}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Confirmación de Booking */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Confirmar Booking</h3>
            <p className="text-sm text-slate-500 mb-6">
              Ingresa los datos de confirmación proporcionados por la naviera.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Número de Booking *
                </label>
                <input
                  type="text"
                  placeholder="Ej: COSU6321459870"
                  value={confirmData.numeroBooking}
                  onChange={(e) => setConfirmData({ ...confirmData, numeroBooking: e.target.value.toUpperCase() })}
                  className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm font-bold text-slate-900 uppercase focus:border-slate-900 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Corte Documental
                  </label>
                  <input
                    type="datetime-local"
                    value={confirmData.fechaCorteDocumental}
                    onChange={(e) => setConfirmData({ ...confirmData, fechaCorteDocumental: e.target.value })}
                    className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Corte de Carga
                  </label>
                  <input
                    type="datetime-local"
                    value={confirmData.fechaCorteCarga}
                    onChange={(e) => setConfirmData({ ...confirmData, fechaCorteCarga: e.target.value })}
                    className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Contenedor
                  </label>
                  <input
                    type="text"
                    placeholder="CSXU8492047"
                    value={confirmData.numeroContenedor}
                    onChange={(e) => setConfirmData({ ...confirmData, numeroContenedor: e.target.value.toUpperCase() })}
                    className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 uppercase focus:border-slate-900 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Tipo
                  </label>
                  <select
                    value={confirmData.tipoContenedor}
                    onChange={(e) => setConfirmData({ ...confirmData, tipoContenedor: e.target.value })}
                    className="h-14 w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm text-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all appearance-none"
                  >
                    <option value="20ST">20&apos; Standard</option>
                    <option value="40ST">40&apos; Standard</option>
                    <option value="40HC">40&apos; High Cube</option>
                    <option value="45HC">45&apos; High Cube</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-14 bg-zinc-100 hover:bg-zinc-200 text-slate-900 rounded-2xl font-bold text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => changeStatus('CONFIRMADO', confirmData)}
                disabled={!confirmData.numeroBooking || updating}
                className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${accent ? 'bg-blue-50 border-blue-100' : 'bg-zinc-50 border-zinc-100'}`}>
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${accent ? 'text-blue-500' : 'text-slate-400'}`}>
        {label}
      </div>
      <div className={`text-sm font-bold ${accent ? 'text-blue-700' : 'text-slate-900'}`}>
        {value}
      </div>
    </div>
  );
}
