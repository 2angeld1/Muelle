'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Siren } from 'lucide-react';

interface CutoffTimerProps {
  fechaCorte: string | null;
  label?: string;
}

export default function CutoffTimer({ fechaCorte, label = 'Corte Documental' }: CutoffTimerProps) {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isUrgent: false,    // < 24h
    isCritical: false,  // < 6h
    totalMs: 0,
  });

  useEffect(() => {
    if (!fechaCorte) return;

    const update = () => {
      const now = Date.now();
      const target = new Date(fechaCorte).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeData({
          days: 0, hours: 0, minutes: 0, seconds: 0,
          isExpired: true, isUrgent: true, isCritical: true, totalMs: 0,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeData({
        days, hours, minutes, seconds,
        isExpired: false,
        isUrgent: diff < 24 * 60 * 60 * 1000,
        isCritical: diff < 6 * 60 * 60 * 1000,
        totalMs: diff,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [fechaCorte]);

  if (!fechaCorte) {
    return (
      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Sin fecha de corte asignada</span>
        </div>
      </div>
    );
  }

  const bgClass = timeData.isExpired
    ? 'bg-red-600 border-red-700'
    : timeData.isCritical
    ? 'bg-rose-500 border-rose-600'
    : timeData.isUrgent
    ? 'bg-amber-500 border-amber-600'
    : 'bg-white border-zinc-100';

  const textClass = timeData.isUrgent || timeData.isExpired ? 'text-white' : 'text-slate-900';
  const subTextClass = timeData.isUrgent || timeData.isExpired ? 'text-white/70' : 'text-slate-400';

  return (
    <div className={`${bgClass} border rounded-2xl p-5 transition-all ${
      timeData.isCritical ? 'animate-pulse shadow-2xl shadow-rose-500/30' : ''
    }`}>
      {/* Label */}
      <div className={`flex items-center gap-2 mb-3 ${subTextClass}`}>
        {timeData.isExpired ? (
          <Siren className="w-4 h-4" />
        ) : timeData.isUrgent ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      </div>

      {/* Timer */}
      {timeData.isExpired ? (
        <div className={`text-2xl font-black ${textClass} tracking-tight`}>
          ⚠️ ¡FECHA VENCIDA!
        </div>
      ) : (
        <div className="flex gap-3">
          {timeData.days > 0 && (
            <TimeUnit value={timeData.days} label="días" textClass={textClass} subTextClass={subTextClass} />
          )}
          <TimeUnit value={timeData.hours} label="hrs" textClass={textClass} subTextClass={subTextClass} />
          <TimeUnit value={timeData.minutes} label="min" textClass={textClass} subTextClass={subTextClass} />
          {timeData.isUrgent && (
            <TimeUnit value={timeData.seconds} label="seg" textClass={textClass} subTextClass={subTextClass} />
          )}
        </div>
      )}

      {/* Fecha legible */}
      <div className={`mt-3 text-[11px] font-medium ${subTextClass}`}>
        {new Date(fechaCorte).toLocaleDateString('es-PA', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}

function TimeUnit({ value, label, textClass, subTextClass }: {
  value: number; label: string; textClass: string; subTextClass: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-black ${textClass} tracking-tighter tabular-nums`}>
        {String(value).padStart(2, '0')}
      </div>
      <div className={`text-[10px] font-bold uppercase tracking-wider ${subTextClass}`}>
        {label}
      </div>
    </div>
  );
}
