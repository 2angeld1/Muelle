import mongoose, { Schema, Document, models } from "mongoose";

export interface IDocumento extends Document {
  nombre: string;
  tipo: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  exportacionId?: mongoose.Types.ObjectId;
  exportacionCodigo?: string;
  tamano: number;
  formato: string;
  subidoPor?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentoSchema = new Schema<IDocumento>(
  {
    nombre: { type: String, required: true, trim: true },
    tipo: {
      type: String,
      required: true,
      enum: [
        "FACTURA",
        "PACKING_LIST",
        "BL",
        "CERTIFICADO_ORIGEN",
        "DECLARACION_ADUANERA",
        "SEGURO",
        "ORDEN_COMPRA",
        "OTRO",
      ],
      default: "OTRO",
    },
    cloudinaryUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    exportacionId: {
      type: Schema.Types.ObjectId,
      ref: "Exportacion",
      default: null,
    },
    exportacionCodigo: { type: String, default: "" },
    tamano: { type: Number, default: 0 },
    formato: { type: String, default: "" },
    subidoPor: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },
  },
  { timestamps: true }
);

DocumentoSchema.index({ tipo: 1 });
DocumentoSchema.index({ exportacionCodigo: 1 });
DocumentoSchema.index({ createdAt: -1 });

const Documento =
  models.Documento || mongoose.model<IDocumento>("Documento", DocumentoSchema);

export default Documento;
