import { type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Embarque from "@/models/Embarque";

// GET /api/embarques/[id] — Obtener un embarque por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const embarque = await Embarque.findById(id).lean();

    if (!embarque) {
      return Response.json(
        { error: "Embarque no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({
      embarque: JSON.parse(JSON.stringify(embarque)),
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo embarque:", error);
    return Response.json(
      { error: "Error al obtener embarque" },
      { status: 500 }
    );
  }
}

// PUT /api/embarques/[id] — Actualizar un embarque
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const embarque = await Embarque.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!embarque) {
      return Response.json(
        { error: "Embarque no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      embarque: JSON.parse(JSON.stringify(embarque)),
    });
  } catch (error: any) {
    console.error("❌ Error actualizando embarque:", error);
    return Response.json(
      { error: error.message || "Error al actualizar embarque" },
      { status: 500 }
    );
  }
}

// DELETE /api/embarques/[id] — Eliminar un embarque
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const embarque = await Embarque.findByIdAndDelete(id);

    if (!embarque) {
      return Response.json(
        { error: "Embarque no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error eliminando embarque:", error);
    return Response.json(
      { error: "Error al eliminar embarque" },
      { status: 500 }
    );
  }
}
