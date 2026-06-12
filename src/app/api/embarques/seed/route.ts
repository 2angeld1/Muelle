import connectDB from "@/lib/db";
import Embarque from "@/models/Embarque";
import Cliente from "@/models/Cliente";

/**
 * POST /api/embarques/seed — Crear datos de ejemplo para testing
 * SOLO para desarrollo. Eliminar en producción.
 */
export async function POST() {
  try {
    await connectDB();

    // Crear cliente de ejemplo si no existe
    const clienteExistente = await Cliente.findOne({ nombre: "SKECHERS" });
    if (!clienteExistente) {
      await Cliente.create({
        nombre: "SKECHERS",
        contactoEmail: "trafico@skechers.com.pa",
        contactoTelefono: "+507 300-0000",
        direccion: "Panamá City, Panamá",
      });
    }

    // Datos de ejemplo que simulan el flujo real
    const now = new Date();
    const seedData = [
      {
        cliente: "SKECHERS",
        naviera: "COSCO",
        numeroBooking: "COSU6321459870",
        numeroContenedor: "CSXU8492047",
        tipoContenedor: "40HC",
        origen: "Ningbo, China (CNNGB)",
        destino: "Manzanillo, Panamá (PAMIT)",
        tipoCarga: "Calzado deportivo",
        estatus: "CONFIRMADO",
        requiereCartaRetiro: true,
        fechaSolicitud: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        fechaConfirmacion: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        fechaCorteDocumental: new Date(now.getTime() + 20 * 60 * 60 * 1000), // 20h desde ahora (ALERTA!)
        fechaCorteCarga: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        historialEstatus: [
          { estatus: "SOLICITADO", fecha: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), nota: "Embarque creado" },
          { estatus: "CONFIRMADO", fecha: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), nota: "Booking confirmado por COSCO" },
        ],
      },
      {
        cliente: "SKECHERS",
        naviera: "EVERGREEN",
        numeroBooking: "EGLV1234567890",
        origen: "Shanghai, China (CNSHA)",
        destino: "Manzanillo, Panamá (PAMIT)",
        tipoCarga: "Calzado casual",
        estatus: "SOLICITADO",
        requiereCartaRetiro: true,
        fechaSolicitud: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        historialEstatus: [
          { estatus: "SOLICITADO", fecha: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), nota: "Embarque creado" },
        ],
      },
      {
        cliente: "SKECHERS",
        naviera: "MSC",
        numeroBooking: "MEDUX4590123",
        numeroContenedor: "MSCU7654321",
        tipoContenedor: "40HC",
        numeroSello: "MSC-SEAL-2026-001",
        origen: "Yantian, China (CNYTN)",
        destino: "Manzanillo, Panamá (PAMIT)",
        tipoCarga: "Calzado industrial",
        estatus: "CIERRE_DOCUMENTAL",
        requiereCartaRetiro: true,
        fechaSolicitud: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        fechaConfirmacion: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        fechaCorteDocumental: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6h desde ahora (URGENTE!)
        fechaCorteCarga: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        instruccionEnviada: false,
        historialEstatus: [
          { estatus: "SOLICITADO", fecha: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), nota: "Embarque creado" },
          { estatus: "CONFIRMADO", fecha: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), nota: "Booking confirmado por MSC" },
          { estatus: "CIERRE_DOCUMENTAL", fecha: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), nota: "Próximo a vencer" },
        ],
      },
      {
        cliente: "SKECHERS",
        naviera: "SEABOARD",
        numeroBooking: "SML-PAN-2026-044",
        numeroContenedor: "SMLU4477889",
        tipoContenedor: "40ST",
        origen: "Miami, USA (USMIA)",
        destino: "Manzanillo, Panamá (PAMIT)",
        tipoCarga: "Accesorios deportivos",
        estatus: "COMPLETADO",
        requiereCartaRetiro: false,
        fechaSolicitud: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        fechaConfirmacion: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        fechaCorteDocumental: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        fechaCorteCarga: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
        instruccionEnviada: true,
        historialEstatus: [
          { estatus: "SOLICITADO", fecha: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), nota: "Embarque creado" },
          { estatus: "CONFIRMADO", fecha: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000), nota: "Booking confirmado" },
          { estatus: "CIERRE_DOCUMENTAL", fecha: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), nota: "Documentos enviados" },
          { estatus: "COMPLETADO", fecha: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), nota: "Embarque en tránsito" },
        ],
      },
      {
        cliente: "SKECHERS",
        naviera: "COSCO",
        origen: "Qingdao, China (CNTAO)",
        destino: "Manzanillo, Panamá (PAMIT)",
        tipoCarga: "Calzado deportivo premium",
        estatus: "SOLICITADO",
        requiereCartaRetiro: true,
        fechaSolicitud: new Date(),
        historialEstatus: [
          { estatus: "SOLICITADO", fecha: new Date(), nota: "Embarque creado" },
        ],
      },
    ];

    // Limpiar embarques existentes de seed
    await Embarque.deleteMany({});
    const created = await Embarque.insertMany(seedData);

    return Response.json({
      success: true,
      message: `Se crearon ${created.length} embarques de ejemplo`,
      count: created.length,
    });
  } catch (error: any) {
    console.error("❌ Error en seed:", error);
    return Response.json(
      { error: error.message || "Error en seed" },
      { status: 500 }
    );
  }
}
