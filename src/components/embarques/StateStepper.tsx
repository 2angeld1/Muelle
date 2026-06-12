'use client';

import React from 'react';
import { Check, Circle, AlertTriangle, Ship } from 'lucide-react';

interface StateStepperProps {
  currentStatus: string;
  historial?: {
    estatus: string;
    fecha: string;
    nota?: string;
  }[];
}

const steps = [
  { key: 'SOLICITADO', label: 'Solicitado', icon: Circle, description: 'Espera de confirmación de la naviera' },
  { key: 'CONFIRMADO', label: 'Confirmado', icon: Check, description: 'Booking confirmado, esperando retiro de equipo' },
  { key: 'CIERRE_DOCUMENTAL', label: 'Cierre Documental', icon: AlertTriangle, description: 'Fecha límite para instrucciones de embarque' },
  { key: 'COMPLETADO', label: 'Completado', icon: Ship, description: 'Embarque cerrado y/o en tránsito' },
];

const stepOrder = ['SOLICITADO', 'CONFIRMADO', 'CIERRE_DOCUMENTAL', 'COMPLETADO'];

export default function StateStepper({ currentStatus, historial = [] }: StateStepperProps) {
  const currentIdx = stepOrder.indexOf(currentStatus);

  return (
    <div className="w-full">
      {/* Steps Desktop */}
      <div className="hidden md:flex items-center gap-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;
          const historialItem = historial.find((h) => h.estatus === step.key);
          const Icon = step.icon;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1 relative group">
                {/* Círculo */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-110'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-zinc-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  {historialItem && (
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(historialItem.fecha).toLocaleDateString('es-PA', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Línea conectora */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 -mx-2 mt-[-24px] relative">
                  <div className="absolute inset-0 bg-zinc-100 rounded-full"></div>
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                      idx < currentIdx ? 'bg-emerald-500 w-full' : 'bg-transparent w-0'
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Steps Mobile (vertical) */}
      <div className="md:hidden space-y-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const historialItem = historial.find((h) => h.estatus === step.key);
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Línea vertical + círculo */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-slate-900 text-white'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[32px] ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-100'}`}></div>
                )}
              </div>

              {/* Contenido */}
              <div className="pb-6">
                <div className={`text-sm font-bold ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-zinc-400'}`}>
                  {step.label}
                </div>
                <div className="text-[11px] text-slate-400">{step.description}</div>
                {historialItem && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(historialItem.fecha).toLocaleDateString('es-PA', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {historialItem.nota && ` — ${historialItem.nota}`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
