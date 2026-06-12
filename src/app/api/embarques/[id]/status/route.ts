import { type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Embarque, { type EstatusEmbarque, ESTATUS_EMBARQUE } from "@/models/Embarque";

/**
 * PATCH /api/embarques/[id]/status — Cambiar el estado de un embarque
 * 
 * Esta es la ruta más importante del sistema. Contiene la lógica de negocio:
 * - Valida transiciones válidas entre estados
 * - Registra el cambio en el historial
 * - En el futuro: disparará correos automáticos y acciones por naviera
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { nuevoEstatus, nota, datosConfirmacion } = body;

    if (!nuevoEstatus || !ESTATUS_EMBARQUE.includes(nuevoEstatus)) {
      return Response.json(
        { error: `Estatus inválido. Opciones: ${ESTATUS_EMBARQUE.join(", ")}` },
        { status: 400 }
      );
    }

    const embarque = await Embarque.findById(id);
    if (!embarque) {
      return Response.json(
        { error: "Embarque no encontrado" },
        { status: 404 }
      );
    }

    // Validar transición de estado
    const transicionesValidas: Record<string, EstatusEmbarque[]> = {
      SOLICITADO: ["CONFIRMADO"],
      CONFIRMADO: ["CIERRE_DOCUMENTAL", "COMPLETADO"],
      CIERRE_DOCUMENTAL: ["COMPLETADO"],
      COMPLETADO: [], // Estado final
    };

    const permitidas = transicionesValidas[embarque.estatus] || [];
    if (!permitidas.includes(nuevoEstatus)) {
      return Response.json(
        {
          error: `No se puede pasar de ${embarque.estatus} a ${nuevoEstatus}. Transiciones permitidas: ${permitidas.join(", ") || "ninguna (estado final)"}`,
        },
        { status: 400 }
      );
    }

    // Aplicar lógica según el nuevo estado
    const updates: Record<string, any> = {
      estatus: nuevoEstatus,
    };

    switch (nuevoEstatus) {
      case "CONFIRMADO":
        // Al confirmar, se requieren datos del booking
        if (datosConfirmacion) {
          if (datosConfirmacion.numeroBooking) {
            updates.numeroBooking = datosConfirmacion.numeroBooking.toUpperCase();
          }
          if (datosConfirmacion.fechaCorteDocumental) {
            updates.fechaCorteDocumental = new Date(datosConfirmacion.fechaCorteDocumental);
          }
          if (datosConfirmacion.fechaCorteCarga) {
            updates.fechaCorteCarga = new Date(datosConfirmacion.fechaCorteCarga);
          }
          if (datosConfirmacion.numeroContenedor) {
            updates.numeroContenedor = datosConfirmacion.numeroContenedor.toUpperCase();
          }
          if (datosConfirmacion.tipoContenedor) {
            updates.tipoContenedor = datosConfirmacion.tipoContenedor;
          }
        }
        updates.fechaConfirmacion = new Date();

        // ═══════════════════════════════════════════════════════════════
        // 🔮 FUTURO: Aquí se dispararía el correo automático #2
        //    "CONFIRMACIÓN DE BOOKING // SKECHERS - Naviera: {naviera}"
        //    Y se consultaría getNavieraService(naviera).getCutoffDates()
        // ═══════════════════════════════════════════════════════════════
        break;

      case "CIERRE_DOCUMENTAL":
        // ═══════════════════════════════════════════════════════════════
        // 🔮 FUTURO: Aquí se dispararía la alerta de 48h/24h
        //    y el correo al cliente pidiendo datos finales
        // ═══════════════════════════════════════════════════════════════
        break;

      case "COMPLETADO":
        // ═══════════════════════════════════════════════════════════════
        // 🔮 FUTURO: Correo final de confirmación y cierre
        // ═══════════════════════════════════════════════════════════════
        break;
    }

    // Registrar en historial
    embarque.historialEstatus.push({
      estatus: nuevoEstatus,
      fecha: new Date(),
      nota: nota || `Estado cambiado a ${nuevoEstatus}`,
    });

    // Aplicar updates
    Object.assign(embarque, updates);
    await embarque.save();

    return Response.json({
      success: true,
      embarque: JSON.parse(JSON.stringify(embarque)),
      // Info para el frontend sobre qué acciones tomar
      acciones: getAccionesPorEstado(nuevoEstatus, embarque.naviera),
    });
  } catch (error: any) {
    console.error("❌ Error cambiando estado:", error);
    return Response.json(
      { error: error.message || "Error al cambiar estado" },
      { status: 500 }
    );
  }
}

/**
 * Retorna las acciones disponibles según el estado y la naviera.
 * El frontend usa esto para saber qué botones mostrar.
 */
function getAccionesPorEstado(estatus: string, naviera: string) {
  const acciones: { tipo: string; label: string; habilitado: boolean; mensaje?: string }[] = [];

  switch (estatus) {
    case "CONFIRMADO":
      if (naviera === "COSCO" || naviera === "EVERGREEN") {
        acciones.push({
          tipo: "GENERAR_CARTA_RETIRO",
          label: "Generar Carta de Retiro",
          habilitado: true,
        });
      } else if (naviera === "MSC") {
        acciones.push({
          tipo: "ABRIR_PORTAL_MSC",
          label: "Abrir Portal MyMSC para Carta de Sellos",
          habilitado: true,
        });
      } else if (naviera === "SEABOARD") {
        acciones.push({
          tipo: "INFO_SEABOARD",
          label: "Sin carta requerida",
          habilitado: false,
          mensaje: "Seaboard no requiere carta de retiro. Utilizar el Booking PDF para liberación.",
        });
      }
      break;

    case "CIERRE_DOCUMENTAL":
      acciones.push({
        tipo: "GENERAR_INSTRUCCION_PRELIMINAR",
        label: "Generar Instrucción Preliminar",
        habilitado: true,
      });
      break;
  }

  return acciones;
}
