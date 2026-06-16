import { type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Exportacion from "@/models/Exportacion";
import { BANDERAS_PAIS } from "@/lib/constants";

// GET /api/exportaciones — Listar exportaciones con filtros
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const estatus = searchParams.get("estatus");
    const cliente = searchParams.get("cliente");
    const pais = searchParams.get("pais");

    const filter: Record<string, string> = {};
    if (estatus) filter.estatus = estatus;
    if (cliente) filter.clienteNombre = cliente;
    if (pais) filter.paisDestino = pais;

    const exportaciones = await Exportacion.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    return Response.json({
      exportaciones: JSON.parse(JSON.stringify(exportaciones)),
    });
  } catch (error: any) {
    console.error("❌ Error listando exportaciones:", error);
    return Response.json(
      { error: "Error al obtener exportaciones" },
      { status: 500 }
    );
  }
}

// POST /api/exportaciones — Crear nueva exportación
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      clienteNombre,
      paisDestino,
      puerto,
      naviera,
      notas,
    } = body;

    if (!clienteNombre || !paisDestino || !puerto) {
      return Response.json(
        { error: "Cliente, país destino y puerto son obligatorios" },
        { status: 400 }
      );
    }

    // Auto-generate código
    const year = new Date().getFullYear();
    const count = await Exportacion.countDocuments({
      codigo: { $regex: `^EXP-${year}` },
    });
    const codigo = `EXP-${year}-${String(count + 1).padStart(3, "0")}`;

    // Obtener bandera
    const bandera = BANDERAS_PAIS[paisDestino] || "🏳️";

    // Crear documentos por defecto (checklist)
    const documentosPorDefecto = [
      { tipo: "FACTURA" as const, estado: "PENDIENTE" as const },
      { tipo: "PACKING_LIST" as const, estado: "PENDIENTE" as const },
      { tipo: "BL" as const, estado: "PENDIENTE" as const },
      { tipo: "CERTIFICADO_ORIGEN" as const, estado: "PENDIENTE" as const },
    ];

    const exportacion = await Exportacion.create({
      codigo,
      clienteNombre: clienteNombre.toUpperCase(),
      paisDestino,
      banderaPais: bandera,
      puerto,
      naviera: naviera || "",
      notas: notas || "",
      documentos: documentosPorDefecto,
      estatus: "EN_PREPARACION",
      fechaSolicitud: new Date(),
    });

    return Response.json(
      {
        success: true,
        exportacion: JSON.parse(JSON.stringify(exportacion)),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creando exportación:", error);
    return Response.json(
      { error: error.message || "Error al crear exportación" },
      { status: 500 }
    );
  }
}
