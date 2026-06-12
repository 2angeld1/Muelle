import { type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Embarque from "@/models/Embarque";
import { NAVIERA_CONFIG } from "@/models/Naviera";
import type { NavieraName } from "@/models/Naviera";

// GET /api/embarques — Listar embarques con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const estatus = searchParams.get("estatus");
    const naviera = searchParams.get("naviera");
    const cliente = searchParams.get("cliente");

    const filter: Record<string, string> = {};
    if (estatus) filter.estatus = estatus;
    if (naviera) filter.naviera = naviera;
    if (cliente) filter.cliente = cliente;

    const embarques = await Embarque.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    // Contar por estatus para las tarjetas del dashboard
    const counts = await Embarque.aggregate([
      { $group: { _id: "$estatus", count: { $sum: 1 } } },
    ]);

    const statusCounts = {
      SOLICITADO: 0,
      CONFIRMADO: 0,
      CIERRE_DOCUMENTAL: 0,
      COMPLETADO: 0,
    };

    counts.forEach((c) => {
      if (c._id in statusCounts) {
        statusCounts[c._id as keyof typeof statusCounts] = c.count;
      }
    });

    // Encontrar embarques con alerta (fecha corte < 48 horas)
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const alertas = await Embarque.find({
      estatus: { $in: ["CONFIRMADO", "CIERRE_DOCUMENTAL"] },
      fechaCorteDocumental: { $ne: null, $lte: in48Hours },
    })
      .sort({ fechaCorteDocumental: 1 })
      .lean();

    return Response.json({
      embarques: JSON.parse(JSON.stringify(embarques)),
      statusCounts,
      alertas: JSON.parse(JSON.stringify(alertas)),
    });
  } catch (error: any) {
    console.error("❌ Error listando embarques:", error);
    return Response.json(
      { error: "Error al obtener embarques" },
      { status: 500 }
    );
  }
}

// POST /api/embarques — Crear un nuevo embarque
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { cliente, naviera, origen, destino, tipoCarga, notasOperador } = body;

    if (!cliente || !naviera || !origen || !destino) {
      return Response.json(
        { error: "Cliente, naviera, origen y destino son obligatorios" },
        { status: 400 }
      );
    }

    // Determinar si requiere carta de retiro basado en la naviera
    const config = NAVIERA_CONFIG[naviera as NavieraName];
    if (!config) {
      return Response.json(
        { error: "Naviera no válida" },
        { status: 400 }
      );
    }

    const embarque = await Embarque.create({
      cliente: cliente.toUpperCase(),
      naviera,
      origen,
      destino,
      tipoCarga: tipoCarga || "",
      notasOperador: notasOperador || "",
      requiereCartaRetiro: config.requiereCartaRetiro,
      estatus: "SOLICITADO",
      fechaSolicitud: new Date(),
    });

    return Response.json(
      { success: true, embarque: JSON.parse(JSON.stringify(embarque)) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creando embarque:", error);
    return Response.json(
      { error: error.message || "Error al crear embarque" },
      { status: 500 }
    );
  }
}
