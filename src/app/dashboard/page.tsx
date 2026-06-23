'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Package, Ship, FileText, Users, TrendingUp, TrendingDown,
  Calendar, ChevronDown, ArrowRight, AlertTriangle, Bell, Clock,
  Loader2, Database, ChevronRight,
} from 'lucide-react';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const ESTATUS_LABELS: Record<string, string> = {
  EN_PREPARACION: 'En preparación',
  EN_TRANSITO: 'En tránsito',
  EN_ADUANA: 'En aduana',
  ENTREGADA: 'Entregada',
};

const ESTATUS_BADGE: Record<string, string> = {
  EN_PREPARACION: 'bg-blue-50 text-blue-700 border-blue-100',
  EN_TRANSITO: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  EN_ADUANA: 'bg-amber-50 text-amber-700 border-amber-100',
  ENTREGADA: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const DONUT_COLORS = ['#1E6FD9', '#3B82F6', '#F59E0B', '#10B981'];

interface DashboardData {
  kpis: {
    exportacionesActivas: number;
    contenedoresTransito: number;
    documentosPendientes: number;
    clientesActivos: number;
  };
  statusCounts: Record<string, number>;
  exportacionesPorMes: { _id: { year: number; month: number }; count: number }[];
  proximosEmbarques: any[];
  alertas: { tipo: string; titulo: string; descripcion: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(console.error);
  }, [fetchData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch('/api/exportaciones/seed', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Error seeding:', err);
    } finally {
      setSeeding(false);
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-PA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-nexo-500 mx-auto mb-3" />
          <p className="text-base text-slate-400">Cargando NexoExport...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !data || data.kpis.exportacionesActivas === 0 && data.kpis.clientesActivos === 0;

  // Build chart data
  const chartData = buildChartData(data?.exportacionesPorMes || []);
  const maxBar = Math.max(...chartData.map((d) => d.count), 1);

  // Donut data
  const donutData = data
    ? [
        { label: 'En preparación', value: data.statusCounts.EN_PREPARACION || 0, color: DONUT_COLORS[0] },
        { label: 'En tránsito', value: data.statusCounts.EN_TRANSITO || 0, color: DONUT_COLORS[1] },
        { label: 'En aduana', value: data.statusCounts.EN_ADUANA || 0, color: DONUT_COLORS[2] },
        { label: 'Entregadas', value: data.statusCounts.ENTREGADA || 0, color: DONUT_COLORS[3] },
      ]
    : [];
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white animate-fade-in">
            Bienvenido, {user?.nombre || 'Usuario'} 👋
          </h1>
          <p className="text-base text-slate-400 dark:text-slate-500 mt-1">
            Aquí tienes el resumen de tu operación de exportaciones.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEmpty && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-nexo-500 hover:bg-nexo-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-md shadow-nexo-500/20"
              id="seed-data-btn"
            >
              <Database className="w-3.5 h-3.5" />
              {seeding ? 'Cargando...' : 'Cargar Datos Demo'}
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-base text-slate-600 dark:text-slate-300 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="capitalize">{dateStr}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Package className="w-5 h-5" />}
          iconBg="bg-blue-50"
          iconColor="text-nexo-500"
          label="Exportaciones activas"
          value={data?.kpis.exportacionesActivas ?? 0}
          change="+2 vs mes anterior"
          positive
          delay={0}
        />
        <KpiCard
          icon={<Ship className="w-5 h-5" />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          label="Contenedores en tránsito"
          value={data?.kpis.contenedoresTransito ?? 0}
          change="+5 vs mes anterior"
          positive
          delay={1}
        />
        <KpiCard
          icon={<FileText className="w-5 h-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Documentos pendientes"
          value={data?.kpis.documentosPendientes ?? 0}
          change="-2 vs mes anterior"
          positive={false}
          delay={2}
        />
        <KpiCard
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Clientes activos"
          value={data?.kpis.clientesActivos ?? 0}
          change="+4 vs mes anterior"
          positive
          delay={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm animate-fade-in delay-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Exportaciones por mes</h3>
            <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400">
              {new Date().getFullYear()} <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-[200px] px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-nexo-700">{d.count}</span>
                <div className="w-full relative" style={{ height: '160px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-nexo-600 to-nexo-400 rounded-t-lg bar-animate"
                    style={{
                      height: `${(d.count / maxBar) * 100}%`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm animate-fade-in delay-300">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Estado de exportaciones</h3>
          <div className="flex items-center gap-8">
            {/* SVG Donut */}
            <div className="relative w-[160px] h-[160px] flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {donutData.map((segment, i) => {
                  const circumference = 2 * Math.PI * 38;
                  const pct = donutTotal > 0 ? segment.value / donutTotal : 0;
                  const offset = donutData
                    .slice(0, i)
                    .reduce((s, d) => s + (donutTotal > 0 ? d.value / donutTotal : 0), 0);

                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="12"
                      strokeDasharray={`${pct * circumference} ${circumference}`}
                      strokeDashoffset={`${-offset * circumference}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{donutTotal}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 flex-1">
              {donutData.map((d, i) => {
                const pct = donutTotal > 0 ? Math.round((d.value / donutTotal) * 100) : 0;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-base text-slate-600 dark:text-slate-400">{d.label}</span>
                    </div>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Próximos embarques */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm animate-fade-in delay-400">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Próximos embarques</h3>
            <Link href="/dashboard/exportaciones" className="text-sm font-semibold text-nexo-500 hover:text-nexo-600 flex items-center gap-1">
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.proximosEmbarques && data.proximosEmbarques.length > 0 ? (
              data.proximosEmbarques.map((exp: any, i: number) => (
                <Link
                  key={exp._id}
                  href={`/dashboard/exportaciones/${exp._id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                >
                  <div className="text-center w-12 flex-shrink-0">
                    <div className="text-lg font-black text-nexo-700 dark:text-nexo-400 leading-none">
                      {exp.fechaEmbarque
                        ? new Date(exp.fechaEmbarque).getDate().toString().padStart(2, '0')
                        : '--'}
                    </div>
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                      {exp.fechaEmbarque
                        ? MESES[new Date(exp.fechaEmbarque).getMonth()]
                        : '---'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900 dark:text-white">{exp.codigo}</span>
                    </div>
                    <div className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                      {exp.clienteNombre} · {exp.banderaPais} {exp.paisDestino}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${ESTATUS_BADGE[exp.estatus] || ''}`}>
                    {ESTATUS_LABELS[exp.estatus] || exp.estatus}
                  </span>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-base text-slate-400">
                <Ship className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                No hay embarques próximos
              </div>
            )}
          </div>
        </div>

        {/* Alertas importantes */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm animate-fade-in delay-500">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Alertas importantes</h3>
            <Link href="/dashboard/alertas" className="text-sm font-semibold text-nexo-500 hover:text-nexo-600 flex items-center gap-1">
              Ver todas <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.alertas && data.alertas.length > 0 ? (
              data.alertas.map((alerta, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alerta.tipo === 'urgent'
                      ? 'bg-red-50 text-red-500'
                      : alerta.tipo === 'warning'
                        ? 'bg-amber-50 text-amber-500'
                        : 'bg-blue-50 text-blue-500'
                  }`}>
                    {alerta.tipo === 'urgent' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : alerta.tipo === 'warning' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-slate-800 dark:text-slate-200">{alerta.titulo}</div>
                    <div className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{alerta.descripcion}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base text-slate-400">
                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                No hay alertas pendientes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KpiCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  change,
  positive,
  delay,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  change: string;
  positive: boolean;
  delay: number;
}) {
  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div className={`w-10 h-10 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-slate-900 dark:text-white animate-count-up" style={{ animationDelay: `${delay * 100 + 200}ms` }}>
        {value}
      </div>
      <div className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5">{label}</div>
      <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-amber-600'}`}>
        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    </div>
  );
}

// Helper: build 6-month chart data
function buildChartData(raw: { _id: { year: number; month: number }; count: number }[]) {
  const result = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const found = raw.find((r) => r._id.year === year && r._id.month === month);
    result.push({
      label: MESES[d.getMonth()],
      count: found?.count || 0,
    });
  }

  return result;
}
