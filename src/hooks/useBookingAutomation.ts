'use client';

import { useState } from 'react';

interface Log {
  id: number;
  text: string;
  type: 'info' | 'success' | 'process';
}

export function useBookingAutomation() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bookingNumber, setBookingNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'draft' | 'sent'>('idle');
  const [logs, setLogs] = useState<Log[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (text: string, type: 'info' | 'success' | 'process') => {
    setLogs(prev => [...prev, { id: Date.now(), text, type }]);
  };

  const startAutomation = () => {
    if (!bookingNumber || !username || !password) return;
    setStatus('running');
    setLogs([]);
    setProgress(0);

    const sequence = [
      { time: 500, text: `Iniciando sesión segura en portal de la naviera...`, type: 'process' },
      { time: 1500, text: `Login exitoso. Bypass de captcha superado.`, type: 'success' },
      { time: 2500, text: `Buscando Booking ${bookingNumber}...`, type: 'process' },
      { time: 3500, text: `Booking localizado. Extrayendo Vessel (MSC ANNA) y ETA (14-May)...`, type: 'info' },
      { time: 5000, text: `Descargando Bill of Lading (B/L) y Factura Comercial...`, type: 'process' },
      { time: 6500, text: `Cruzando datos con la base de clientes (Caitlyn Vision)...`, type: 'process' },
      { time: 7500, text: `Validación aduanera OK. Sin discrepancias.`, type: 'success' },
      { time: 8500, text: `Generando borrador de declaración en PDF...`, type: 'info' },
    ];

    sequence.forEach((step, idx) => {
      setTimeout(() => {
        addLog(step.text, step.type as any);
        setProgress(((idx + 1) / sequence.length) * 100);
        
        if (idx === sequence.length - 1) {
          setTimeout(() => setStatus('draft'), 1000);
        }
      }, step.time);
    });
  };

  const reset = () => {
    setStatus('idle');
    setBookingNumber('');
    setLogs([]);
    setProgress(0);
  };

  const approve = () => {
    setStatus('sent');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    bookingNumber,
    setBookingNumber,
    status,
    logs,
    progress,
    startAutomation,
    reset,
    approve,
  };
}
