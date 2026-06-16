import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Usuario from "@/models/Usuario";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function checkAdmin(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.rol === "ADMIN";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    await connectDB();
    const usuarios = await Usuario.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ usuarios });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    await connectDB();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Falta ID" }, { status: 400 });

    await Usuario.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
