import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import Documento from "@/models/Documento";

// GET: List all documents with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo");
    const exportacion = searchParams.get("exportacion");
    const search = searchParams.get("search");

    const query: any = {};
    if (tipo) query.tipo = tipo;
    if (exportacion) query.exportacionCodigo = exportacion;
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { exportacionCodigo: { $regex: search, $options: "i" } },
      ];
    }

    const documentos = await Documento.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ documentos });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: error.message || "Error al obtener documentos" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a document from Cloudinary and MongoDB
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "ID del documento requerido" },
        { status: 400 }
      );
    }

    const doc = await Documento.findById(id);
    if (!doc) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      doc.formato
    );
    try {
      await cloudinary.uploader.destroy(doc.cloudinaryPublicId, {
        resource_type: isImage ? "image" : "raw",
      });
    } catch (cloudErr) {
      console.error("Error deleting from Cloudinary:", cloudErr);
    }

    // Delete from MongoDB
    await Documento.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar documento" },
      { status: 500 }
    );
  }
}
