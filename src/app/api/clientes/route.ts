import { type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Cliente from "@/models/Cliente";

// GET /api/clientes — Listar todos los clientes activos
export async function GET() {
  try {
    await connectDB();
    const clientes = await Cliente.find({ activo: true })
      .sort({ nombre: 1 })
      .lean();

    return Response.json({
      clientes: JSON.parse(JSON.stringify(clientes)),
    });
  } catch (error: any) {
    console.error("❌ Error listando clientes:", error);
    return Response.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// POST /api/clientes — Crear un nuevo cliente
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { nombre, contactoEmail, contactoTelefono, pais, direccion } = body;
    if (!nombre || !contactoEmail) {
      return Response.json(
        { error: "Nombre y correo de contacto son obligatorios" },
        { status: 400 }
      );
    }

    const cliente = await Cliente.create({
      nombre,
      contactoEmail,
      contactoTelefono: contactoTelefono || "",
      pais: pais || "",
      direccion: direccion || "",
    });

    return Response.json(
      { success: true, cliente: JSON.parse(JSON.stringify(cliente)) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creando cliente:", error);
    return Response.json(
      { error: error.message || "Error al crear cliente" },
      { status: 500 }
    );
  }
}
