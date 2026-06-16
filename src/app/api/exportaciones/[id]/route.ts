import { type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Exportacion from "@/models/Exportacion";

// GET /api/exportaciones/[id] — Obtener detalle de exportación
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const exportacion = await Exportacion.findById(id).lean();
    if (!exportacion) {
      return Response.json(
        { error: "Exportación no encontrada" },
        { status: 404 }
      );
    }

    return Response.json({
      exportacion: JSON.parse(JSON.stringify(exportacion)),
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo exportación:", error);
    return Response.json(
      { error: "Error al obtener exportación" },
      { status: 500 }
    );
  }
}

// PUT /api/exportaciones/[id] — Actualizar exportación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Si cambia el estatus, registrar en historial
    if (body.estatus) {
      const exportacion = await Exportacion.findById(id);
      if (!exportacion) {
        return Response.json(
          { error: "Exportación no encontrada" },
          { status: 404 }
        );
      }
      exportacion.historial.push({
        estatus: body.estatus,
        fecha: new Date(),
        nota: body.notaHistorial || `Estado cambiado a ${body.estatus}`,
      });
      Object.assign(exportacion, body);
      delete (exportacion as any).notaHistorial;
      await exportacion.save();

      return Response.json({
        success: true,
        exportacion: JSON.parse(JSON.stringify(exportacion)),
      });
    }

    const exportacion = await Exportacion.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!exportacion) {
      return Response.json(
        { error: "Exportación no encontrada" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      exportacion: JSON.parse(JSON.stringify(exportacion)),
    });
  } catch (error: any) {
    console.error("❌ Error actualizando exportación:", error);
    return Response.json(
      { error: error.message || "Error al actualizar exportación" },
      { status: 500 }
    );
  }
}

// DELETE /api/exportaciones/[id] — Eliminar exportación
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    await Exportacion.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error eliminando exportación:", error);
    return Response.json(
      { error: "Error al eliminar exportación" },
      { status: 500 }
    );
  }
}
