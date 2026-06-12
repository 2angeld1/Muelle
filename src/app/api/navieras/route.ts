import connectDB from "@/lib/db";
import Naviera, { NAVIERAS, NAVIERA_CONFIG } from "@/models/Naviera";
import { getIntegrationStatus } from "@/lib/navieras";

// GET /api/navieras — Listar navieras con config + estado de integración
export async function GET() {
  try {
    await connectDB();

    // Obtener datos de contacto de la BD
    const navierasDB = await Naviera.find().lean();

    // Obtener estado de integración (manual/api/scraping)
    const integrationStatus = await getIntegrationStatus();

    // Combinar config estática + datos de BD + estado de integración
    const navieras = NAVIERAS.map((nombre) => {
      const dbData = navierasDB.find((n) => n.nombre === nombre);
      const config = NAVIERA_CONFIG[nombre];
      const integration = integrationStatus[nombre];

      return {
        nombre,
        ...config,
        ejecutivoCuenta: dbData?.ejecutivoCuenta || "",
        emailEjecutivo: dbData?.emailEjecutivo || "",
        telefono: dbData?.telefono || "",
        notas: dbData?.notas || "",
        integracion: integration,
      };
    });

    return Response.json({ navieras });
  } catch (error: any) {
    console.error("❌ Error listando navieras:", error);
    return Response.json(
      { error: "Error al obtener navieras" },
      { status: 500 }
    );
  }
}
