import connectDB from "@/lib/db";
import Exportacion from "@/models/Exportacion";

// GET /api/dashboard — KPIs y datos del dashboard
export async function GET() {
  try {
    await connectDB();

    // Contar por estatus
    const counts = await Exportacion.aggregate([
      { $group: { _id: "$estatus", count: { $sum: 1 } } },
    ]);

    const statusCounts = {
      EN_PREPARACION: 0,
      EN_TRANSITO: 0,
      EN_ADUANA: 0,
      ENTREGADA: 0,
    };

    counts.forEach((c) => {
      if (c._id in statusCounts) {
        statusCounts[c._id as keyof typeof statusCounts] = c.count;
      }
    });

    const totalExportaciones =
      statusCounts.EN_PREPARACION +
      statusCounts.EN_TRANSITO +
      statusCounts.EN_ADUANA;

    // Contar contenedores en tránsito
    const contenedoresEnTransito = await Exportacion.aggregate([
      { $unwind: "$contenedores" },
      {
        $match: {
          "contenedores.estado": { $in: ["EN_TRANSITO", "CARGADO"] },
        },
      },
      { $count: "total" },
    ]);

    // Total contenedores
    const totalContenedores = await Exportacion.aggregate([
      { $unwind: "$contenedores" },
      { $count: "total" },
    ]);

    // Documentos pendientes
    const docsPendientes = await Exportacion.aggregate([
      { $unwind: "$documentos" },
      { $match: { "documentos.estado": "PENDIENTE" } },
      { $count: "total" },
    ]);

    // Clientes únicos activos
    const clientesActivos = await Exportacion.distinct("clienteNombre", {
      estatus: { $ne: "ENTREGADA" },
    });

    // Exportaciones por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const exportacionesPorMes = await Exportacion.aggregate([
      { $match: { fechaSolicitud: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$fechaSolicitud" },
            month: { $month: "$fechaSolicitud" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Próximos embarques (los 5 más cercanos)
    const proximosEmbarques = await Exportacion.find({
      estatus: { $in: ["EN_PREPARACION", "EN_TRANSITO", "EN_ADUANA"] },
      fechaEmbarque: { $ne: null },
    })
      .sort({ fechaEmbarque: 1 })
      .limit(5)
      .lean();

    // Alertas
    const now = new Date();
    const in72Hours = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    // Documentos por vencer (exportaciones próximas con docs pendientes)
    const exportacionesConDocsPendientes = await Exportacion.find({
      estatus: { $in: ["EN_PREPARACION", "EN_TRANSITO"] },
      "documentos.estado": "PENDIENTE",
    })
      .sort({ fechaEmbarque: 1 })
      .limit(5)
      .lean();

    const alertas = [];

    // Alerta de documentos pendientes
    const totalDocsPendientes =
      docsPendientes.length > 0 ? docsPendientes[0].total : 0;
    if (totalDocsPendientes > 0) {
      alertas.push({
        tipo: "warning",
        titulo: `${totalDocsPendientes} documentos por vencer`,
        descripcion: `BL de ${Math.min(totalDocsPendientes, 3)} embarques vencen en los próximos 3 días.`,
      });
    }

    // Alerta de embarques sin zarpe
    const sinZarpe = await Exportacion.countDocuments({
      estatus: "EN_PREPARACION",
      fechaEmbarque: null,
    });
    if (sinZarpe > 0) {
      alertas.push({
        tipo: "info",
        titulo: `${sinZarpe} contenedores sin zarpe`,
        descripcion: "Requieren confirmación de la naviera.",
      });
    }

    // Próximo embarque mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const embarqueMañana = await Exportacion.findOne({
      fechaEmbarque: { $gte: tomorrow, $lt: dayAfter },
    }).lean();

    if (embarqueMañana) {
      alertas.push({
        tipo: "urgent",
        titulo: "Próximo embarque mañana",
        descripcion: `${(embarqueMañana as any).codigo} tiene zarpe programado.`,
      });
    }

    return Response.json({
      kpis: {
        exportacionesActivas: totalExportaciones,
        contenedoresTransito:
          contenedoresEnTransito.length > 0
            ? contenedoresEnTransito[0].total
            : 0,
        documentosPendientes: totalDocsPendientes,
        clientesActivos: clientesActivos.length,
        totalContenedores:
          totalContenedores.length > 0 ? totalContenedores[0].total : 0,
      },
      statusCounts,
      exportacionesPorMes: JSON.parse(JSON.stringify(exportacionesPorMes)),
      proximosEmbarques: JSON.parse(JSON.stringify(proximosEmbarques)),
      alertas,
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo dashboard:", error);
    return Response.json(
      { error: "Error al obtener dashboard" },
      { status: 500 }
    );
  }
}
