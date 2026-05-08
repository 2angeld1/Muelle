import { NextResponse } from 'next/server';

// Esta es una ruta de backend (API Route) en Next.js.
// No corre en el navegador del usuario, corre en el servidor Node.js de Next.
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      message: 'Muelle Backend (Next.js Puro) funcionando al 100% 🚢',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
