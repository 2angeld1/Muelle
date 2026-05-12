'use client';

import { useState, useRef } from 'react';
import { createSearchAction, parseLogisticsDocumentAction } from "../actions/search";

export function useSearchForm(onResults?: (data: any) => void, onSearchStart?: () => void) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setIsParsingDoc(true);
      setMessage(`👁️ Caitlyn Vision está leyendo ${file.name}...`);
      setStatus("idle");
      
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const result = await parseLogisticsDocumentAction(base64String);
          
          setIsParsingDoc(false);
          if (result.success && result.data) {
            setMessage(`✨ ¡Magia! Extraído: ${result.data.origen || '...'} a ${result.data.destino || '...'}`);
            setStatus("success");
            
            const originInput = document.querySelector('[name="origen"]') as HTMLInputElement;
            const destInput = document.querySelector('[name="destino"]') as HTMLInputElement;
            
            if (originInput && result.data.origen) {
              originInput.value = result.data.origen;
              originInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (destInput && result.data.destino) {
              destInput.value = result.data.destino;
              destInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          } else {
            setMessage(`❌ ${result.error || 'No se pudo extraer la info del documento.'}`);
            setStatus("error");
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setIsParsingDoc(false);
        setMessage("❌ Error al procesar el archivo.");
        setStatus("error");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearchStart) onSearchStart();
    setLoading(true);
    setMessage("🤖 Caitlyn está despertando a las navieras...");
    setStatus("idle");

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/caitlyn';
    socketRef.current = new WebSocket(socketUrl);
    
    socketRef.current.onmessage = (event) => {
      setMessage(event.data);
    };

    const formData = new FormData(e.currentTarget);
    try {
      const result = await createSearchAction(formData);

      if (result?.error) {
        setMessage(`❌ Error: ${result.error}`);
        setStatus("error");
      } else if (result?.success) {
        setMessage(`✅ ¡Misión cumplida! Se encontraron ${result.data?.itineraries?.length || 0} opciones.`);
        setStatus("success");
        if (onResults) {
          onResults({
            itineraries: result.data?.itineraries || [],
            origin: formData.get("origen") as string,
            destination: formData.get("destino") as string
          });
        }
      }
    } catch (err) {
      setMessage("❌ Error de conexión con el servidor.");
      setStatus("error");
    } finally {
      setLoading(false);
      if (socketRef.current) {
        socketRef.current.close();
      }
    }
  };

  return {
    loading,
    message,
    status,
    isDragging,
    isParsingDoc,
    handleDrag,
    handleDrop,
    handleSubmit,
  };
}
