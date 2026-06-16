import connectDB from "@/lib/db";
import Exportacion from "@/models/Exportacion";
import { BANDERAS_PAIS } from "@/lib/constants";
import Cliente from "@/models/Cliente";

const SEED_CLIENTES = [
  { nombre: "CLIENTE A", contactoEmail: "clientea@empresa.com", pais: "Colombia", contactoTelefono: "+57 300 123 4567" },
  { nombre: "CLIENTE B", contactoEmail: "clienteb@empresa.com", pais: "México", contactoTelefono: "+52 55 1234 5678" },
  { nombre: "CLIENTE C", contactoEmail: "clientec@empresa.com", pais: "Chile", contactoTelefono: "+56 9 1234 5678" },
  { nombre: "SKECHERS", contactoEmail: "logistics@skechers.com", pais: "Estados Unidos", contactoTelefono: "+1 310 555 1234" },
  { nombre: "EXPORTADORA DEL SUR", contactoEmail: "ventas@exportsur.com", pais: "Perú", contactoTelefono: "+51 1 234 5678" },
  { nombre: "GLOBAL TRADE CO", contactoEmail: "ops@globaltrade.com", pais: "Costa Rica", contactoTelefono: "+506 2222 3333" },
];

const NAVIERAS = ["COSCO", "MSC", "MAERSK", "HAPAG-LLOYD", "EVERGREEN", "SEABOARD", "CMA CGM"];
const PUERTOS_DESTINO: Record<string, string[]> = {
  Colombia: ["Puerto de Cartagena", "Buenaventura", "Santa Marta"],
  México: ["Manzanillo", "Veracruz", "Lázaro Cárdenas"],
  Chile: ["San Antonio", "Valparaíso"],
  "Estados Unidos": ["Los Angeles", "Miami", "Houston"],
  Perú: ["Callao"],
  "Costa Rica": ["Puerto Limón", "Caldera"],
};
const TIPOS_CONTENEDOR = ["20ST", "40ST", "40HC", "45HC"];

function randomEl<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startDaysAgo: number, endDaysAgo: number): Date {
  const now = Date.now();
  const start = now - startDaysAgo * 86400000;
  const end = now - endDaysAgo * 86400000;
  return new Date(start + Math.random() * (end - start));
}

function futureDate(daysFromNow: number, variance: number = 5): Date {
  const days = daysFromNow + Math.floor(Math.random() * variance) - Math.floor(variance / 2);
  return new Date(Date.now() + days * 86400000);
}

// POST /api/exportaciones/seed — Generar datos demo realistas
export async function POST() {
  try {
    await connectDB();

    // Limpiar datos existentes
    await Exportacion.deleteMany({});
    await Cliente.deleteMany({});

    // Crear clientes
    const clientesDocs = await Cliente.insertMany(SEED_CLIENTES);

    // Generar 16 exportaciones (como mencionó la esposa del usuario)
    const exportaciones = [];
    const year = new Date().getFullYear();

    const estatusDist = [
      ...Array(3).fill("EN_PREPARACION"),   // 3 en preparación (~18%)
      ...Array(8).fill("EN_TRANSITO"),       // 8 en tránsito (~50%)
      ...Array(3).fill("EN_ADUANA"),         // 3 en aduana (~20%)
      ...Array(2).fill("ENTREGADA"),         // 2 entregadas (~12%)
    ] as const;

    for (let i = 0; i < 16; i++) {
      const cliente = randomEl(SEED_CLIENTES);
      const pais = cliente.pais || "Colombia";
      const puertos = PUERTOS_DESTINO[pais] || ["Puerto de Colón"];
      const estatus = estatusDist[i];
      const naviera = randomEl(NAVIERAS);

      const numContenedores = Math.random() > 0.5 ? 2 : 1;
      const contenedores = [];
      for (let c = 0; c < numContenedores; c++) {
        const prefix = ["MSKU", "CSXU", "TGHU", "BMOU", "FCIU", "TCKU"][Math.floor(Math.random() * 6)];
        const num = String(Math.floor(Math.random() * 9000000) + 1000000);
        let estadoContenedor: string;
        if (estatus === "EN_PREPARACION") estadoContenedor = Math.random() > 0.5 ? "EN_PATIO" : "CARGADO";
        else if (estatus === "EN_TRANSITO") estadoContenedor = "EN_TRANSITO";
        else if (estatus === "EN_ADUANA") estadoContenedor = "EN_DESTINO";
        else estadoContenedor = "ENTREGADO";

        contenedores.push({
          numero: `${prefix}${num}`,
          tipo: randomEl(TIPOS_CONTENEDOR),
          sello: `SL${Math.floor(Math.random() * 90000) + 10000}`,
          estado: estadoContenedor,
        });
      }

      // Documentos con estados variados según el estatus de la exportación
      const docEstados = () => {
        if (estatus === "EN_PREPARACION") return randomEl(["PENDIENTE", "PENDIENTE", "RECIBIDO"]);
        if (estatus === "EN_TRANSITO") return randomEl(["RECIBIDO", "VERIFICADO", "PENDIENTE"]);
        if (estatus === "EN_ADUANA") return randomEl(["VERIFICADO", "RECIBIDO"]);
        return "VERIFICADO";
      };

      const documentos = [
        { tipo: "FACTURA" as const, estado: docEstados() as any, fechaRecibido: docEstados() !== "PENDIENTE" ? randomDate(30, 5) : null },
        { tipo: "PACKING_LIST" as const, estado: docEstados() as any, fechaRecibido: docEstados() !== "PENDIENTE" ? randomDate(28, 3) : null },
        { tipo: "BL" as const, estado: docEstados() as any, fechaRecibido: docEstados() !== "PENDIENTE" ? randomDate(20, 1) : null },
        { tipo: "CERTIFICADO_ORIGEN" as const, estado: docEstados() as any, fechaRecibido: docEstados() !== "PENDIENTE" ? randomDate(25, 2) : null },
      ];

      const fechaSolicitud = randomDate(120, 5);
      let fechaEmbarque = null;
      let fechaEstimadaLlegada = null;

      if (estatus !== "EN_PREPARACION") {
        fechaEmbarque = new Date(fechaSolicitud.getTime() + (Math.random() * 15 + 5) * 86400000);
        fechaEstimadaLlegada = new Date(fechaEmbarque.getTime() + (Math.random() * 20 + 10) * 86400000);
      } else {
        // Algunos en preparación tienen fecha futura programada
        if (Math.random() > 0.3) {
          fechaEmbarque = futureDate(7, 10);
          fechaEstimadaLlegada = new Date(fechaEmbarque.getTime() + 20 * 86400000);
        }
      }

      const historial: any[] = [
        { estatus: "EN_PREPARACION", fecha: fechaSolicitud, nota: "Exportación creada" },
      ];

      if (["EN_TRANSITO", "EN_ADUANA", "ENTREGADA"].includes(estatus)) {
        historial.push({
          estatus: "EN_TRANSITO",
          fecha: new Date(fechaSolicitud.getTime() + 7 * 86400000),
          nota: `Embarcado con ${naviera}`,
        });
      }
      if (["EN_ADUANA", "ENTREGADA"].includes(estatus)) {
        historial.push({
          estatus: "EN_ADUANA",
          fecha: new Date(fechaSolicitud.getTime() + 25 * 86400000),
          nota: "Llegó a puerto destino, en proceso aduanero",
        });
      }
      if (estatus === "ENTREGADA") {
        historial.push({
          estatus: "ENTREGADA",
          fecha: new Date(fechaSolicitud.getTime() + 30 * 86400000),
          nota: "Entregada al cliente",
        });
      }

      exportaciones.push({
        codigo: `EXP-${year}-${String(i + 1).padStart(3, "0")}`,
        clienteNombre: cliente.nombre,
        paisDestino: pais,
        banderaPais: BANDERAS_PAIS[pais] || "🏳️",
        puerto: randomEl(puertos),
        naviera,
        numeroBooking: `${naviera.substring(0, 3)}${Math.floor(Math.random() * 9000000) + 1000000}`,
        contenedores,
        documentos,
        estatus,
        fechaSolicitud,
        fechaEmbarque,
        fechaEstimadaLlegada,
        notas: "",
        historial,
      });
    }

    await Exportacion.insertMany(exportaciones);

    return Response.json({
      success: true,
      message: `Seed completado: ${SEED_CLIENTES.length} clientes y ${exportaciones.length} exportaciones creadas`,
      counts: {
        clientes: SEED_CLIENTES.length,
        exportaciones: exportaciones.length,
      },
    });
  } catch (error: any) {
    console.error("❌ Error en seed:", error);
    return Response.json(
      { error: error.message || "Error al ejecutar seed" },
      { status: 500 }
    );
  }
}
