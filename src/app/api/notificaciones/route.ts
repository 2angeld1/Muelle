import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Notificacion from "@/models/Notificacion";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("auth-token")?.value;

    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;

    const notificaciones = await Notificacion.find({
      $or: [{ usuarioId: userId }, { usuarioId: { $exists: false } }, { usuarioId: null }],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ notificaciones: JSON.parse(JSON.stringify(notificaciones)) });
  } catch (error: any) {
    console.error("Error obteniendo notificaciones:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await Notificacion.findByIdAndUpdate(id, { leida: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
