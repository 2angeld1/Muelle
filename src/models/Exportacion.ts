import mongoose, { Schema, Document, models } from "mongoose";

export const ESTATUS_EXPORTACION = [
  "EN_PREPARACION",
  "EN_TRANSITO",
  "EN_ADUANA",
  "ENTREGADA",
] as const;

export type EstatusExportacion = (typeof ESTATUS_EXPORTACION)[number];

export const TIPOS_DOCUMENTO = [
  "FACTURA",
  "PACKING_LIST",
  "BL",
  "CERTIFICADO_ORIGEN",
  "DECLARACION_ADUANERA",
  "SEGURO",
  "ORDEN_COMPRA",
  "OTRO",
] as const;

export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];

export const ESTATUS_DOCUMENTO = [
  "PENDIENTE",
  "RECIBIDO",
  "VERIFICADO",
] as const;

export type EstatusDocumento = (typeof ESTATUS_DOCUMENTO)[number];

export const ESTATUS_CONTENEDOR = [
  "EN_PATIO",
  "CARGADO",
  "EN_TRANSITO",
  "EN_DESTINO",
  "ENTREGADO",
] as const;

export type EstatusContenedor = (typeof ESTATUS_CONTENEDOR)[number];

// Banderas de países importadas de constants

export const ESTATUS_LABELS: Record<EstatusExportacion, string> = {
  EN_PREPARACION: "En preparación",
  EN_TRANSITO: "En tránsito",
  EN_ADUANA: "En aduana",
  ENTREGADA: "Entregada",
};

export const ESTATUS_COLORS: Record<EstatusExportacion, { bg: string; text: string }> = {
  EN_PREPARACION: { bg: "bg-blue-50", text: "text-blue-700" },
  EN_TRANSITO: { bg: "bg-indigo-50", text: "text-indigo-700" },
  EN_ADUANA: { bg: "bg-amber-50", text: "text-amber-700" },
  ENTREGADA: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

export interface IDocumentoExportacion {
  tipo: TipoDocumento;
  estado: EstatusDocumento;
  archivo?: string;
  fechaRecibido?: Date;
  notas?: string;
}

export interface IContenedorExportacion {
  numero: string;
  tipo: string; // "20ST", "40ST", "40HC", "45HC"
  sello?: string;
  estado: EstatusContenedor;
}

export interface IExportacion extends Document {
  // Identificación
  codigo: string; // "EXP-2026-001"

  // Cliente
  clienteNombre: string;
  clienteId?: mongoose.Types.ObjectId;

  // Destino
  paisDestino: string;
  banderaPais: string;
  puerto: string;

  // Naviera/Transportista
  naviera?: string;
  numeroBooking?: string;

  // Contenedores
  contenedores: IContenedorExportacion[];

  // Documentos
  documentos: IDocumentoExportacion[];

  // Estado
  estatus: EstatusExportacion;

  // Fechas
  fechaSolicitud: Date;
  fechaEmbarque?: Date;
  fechaEstimadaLlegada?: Date;

  // Notas
  notas?: string;

  // Historial de cambios
  historial: {
    estatus: EstatusExportacion;
    fecha: Date;
    nota?: string;
  }[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const DocumentoSchema = new Schema<IDocumentoExportacion>(
  {
    tipo: { type: String, enum: TIPOS_DOCUMENTO, required: true },
    estado: { type: String, enum: ESTATUS_DOCUMENTO, default: "PENDIENTE" },
    archivo: { type: String, default: "" },
    fechaRecibido: { type: Date, default: null },
    notas: { type: String, default: "" },
  },
  { _id: false }
);

const ContenedorSchema = new Schema<IContenedorExportacion>(
  {
    numero: { type: String, required: true, uppercase: true, trim: true },
    tipo: { type: String, default: "40HC" },
    sello: { type: String, default: "" },
    estado: { type: String, enum: ESTATUS_CONTENEDOR, default: "EN_PATIO" },
  },
  { _id: false }
);

const ExportacionSchema = new Schema<IExportacion>(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    clienteNombre: {
      type: String,
      required: [true, "El cliente es obligatorio"],
      trim: true,
      uppercase: true,
    },
    clienteId: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
      default: null,
    },
    paisDestino: {
      type: String,
      required: [true, "El país destino es obligatorio"],
      trim: true,
    },
    banderaPais: {
      type: String,
      default: "🏳️",
    },
    puerto: {
      type: String,
      required: [true, "El puerto es obligatorio"],
      trim: true,
    },
    naviera: {
      type: String,
      default: "",
      trim: true,
    },
    numeroBooking: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },
    contenedores: [ContenedorSchema],
    documentos: [DocumentoSchema],
    estatus: {
      type: String,
      enum: ESTATUS_EXPORTACION,
      default: "EN_PREPARACION",
    },
    fechaSolicitud: {
      type: Date,
      default: Date.now,
    },
    fechaEmbarque: {
      type: Date,
      default: null,
    },
    fechaEstimadaLlegada: {
      type: Date,
      default: null,
    },
    notas: {
      type: String,
      default: "",
    },
    historial: [
      {
        estatus: { type: String, enum: ESTATUS_EXPORTACION },
        fecha: { type: Date, default: Date.now },
        nota: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Índices para consultas rápidas
ExportacionSchema.index({ estatus: 1 });
ExportacionSchema.index({ clienteNombre: 1 });
ExportacionSchema.index({ paisDestino: 1 });
ExportacionSchema.index({ codigo: 1 });
ExportacionSchema.index({ fechaSolicitud: -1 });

// Middleware: registrar primer estado en historial
ExportacionSchema.pre("save", function () {
  if (this.isNew && this.historial.length === 0) {
    this.historial.push({
      estatus: this.estatus,
      fecha: new Date(),
      nota: "Exportación creada",
    });
  }
});

const Exportacion =
  models.Exportacion ||
  mongoose.model<IExportacion>("Exportacion", ExportacionSchema);

export default Exportacion;
