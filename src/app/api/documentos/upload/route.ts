import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import Documento from "@/models/Documento";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tipo = (formData.get("tipo") as string) || "OTRO";
    const exportacionCodigo = (formData.get("exportacionCodigo") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
    const resourceType = isImage ? "image" : "raw";

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "nexoexport/documentos",
            resource_type: resourceType as any,
            public_id: `${Date.now()}_${file.name.replace(/\.[^.]+$/, "")}`,
            format: ext,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Save to MongoDB
    const documento = await Documento.create({
      nombre: file.name,
      tipo,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      exportacionCodigo,
      tamano: file.size,
      formato: ext,
    });

    return NextResponse.json({ success: true, documento }, { status: 201 });
  } catch (error: any) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: error.message || "Error al subir el documento" },
      { status: 500 }
    );
  }
}
