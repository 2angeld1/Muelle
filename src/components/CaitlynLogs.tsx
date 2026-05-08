"use client";

import React, { useEffect, useState, useRef } from 'react';

const CaitlynLogs = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [connected, setConnected] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Conexión al socket de Caitlyn
        const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/caitlyn';
        const socket = new WebSocket(socketUrl);

        socket.onopen = () => {
            setConnected(true);
            setLogs(prev => [...prev, "📡 Conectado al centro de control de Caitlyn AI..."]);
        };

        socket.onmessage = (event) => {
            setLogs(prev => {
                // Mantener solo los últimos 50 logs para no saturar la memoria
                const newLogs = [...prev, event.data];
                return newLogs.slice(-50);
            });
        };

        socket.onclose = () => {
            setConnected(false);
            setLogs(prev => [...prev, "❌ Conexión perdida con Caitlyn."]);
        };

        return () => {
            socket.close();
        };
    }, []);

    // Auto-scroll al final cuando llega un log nuevo
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (logs.length === 0 && !connected) return null;

    return (
        <div className="mt-8 w-full max-w-4xl mx-auto">
            <div className="bg-[#0f172a] rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
                {/* Header de la terminal */}
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                        Caitlyn Live Intelligence System
                    </span>
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                </div>

                {/* Cuerpo de los logs */}
                <div 
                    ref={scrollRef}
                    className="p-4 h-64 overflow-y-auto font-mono text-sm space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700"
                >
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-slate-500 shrink-0 select-none">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                            <span className={`${
                                log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : 
                                log.includes('✅') || log.includes('🎯') ? 'text-emerald-400' : 
                                'text-slate-300'
                            }`}>
                                {log}
                            </span>
                        </div>
                    ))}
                    {connected && (
                        <div className="flex gap-2 items-center text-emerald-500/50">
                            <span className="animate-pulse">_</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaitlynLogs;
