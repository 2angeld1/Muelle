import mongoose, { Schema, Document, models } from "mongoose";
import { NAVIERAS, type NavieraName } from "./Naviera";

export const ESTATUS_EMBARQUE = [
  "SOLICITADO",
  "CONFIRMADO",
  "CIERRE_DOCUMENTAL",
  "COMPLETADO",
] as const;

export type EstatusEmbarque = (typeof ESTATUS_EMBARQUE)[number];

export interface IEmbarque extends Document {
  // Relaciones
  cliente: string; // Nombre del cliente (ej: "SKECHERS")
  naviera: NavieraName;

  // Datos del Booking
  numeroBooking: string;
  numeroContenedor?: string;
  tipoContenedor?: string; // "20ST", "40ST", "40HC", etc.
  numeroSello?: string;

  // Ruta
  origen: string;
  destino: string;
  tipoCarga?: string;

  // Fechas críticas
  fechaSolicitud: Date;
  fechaConfirmacion?: Date;
  fechaCorteDocumental?: Date;
  fechaCorteCarga?: Date;
  fechaEstimadaLlegada?: Date;

  // Estado
  estatus: EstatusEmbarque;
  requiereCartaRetiro: boolean;

  // Documentos y notas
  detalleContenedores?: string;
  bookingPdfUrl?: string;
  instruccionEnviada: boolean;
  notasOperador?: string;

  // Historial de cambios de estado
  historialEstatus: {
    estatus: EstatusEmbarque;
    fecha: Date;
    nota?: string;
  }[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const EmbarqueSchema = new Schema<IEmbarque>(
  {
    // Relaciones
    cliente: {
      type: String,
      required: [true, "El cliente es obligatorio"],
      trim: true,
      uppercase: true,
    },
    naviera: {
      type: String,
      required: [true, "La naviera es obligatoria"],
      enum: NAVIERAS,
    },

    // Datos del Booking
    numeroBooking: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },
    numeroContenedor: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },
    tipoContenedor: {
      type: String,
      default: "40HC",
      trim: true,
    },
    numeroSello: {
      type: String,
      default: "",
      trim: true,
    },

    // Ruta
    origen: {
      type: String,
      required: [true, "El origen es obligatorio"],
      trim: true,
    },
    destino: {
      type: String,
      required: [true, "El destino es obligatorio"],
      trim: true,
    },
    tipoCarga: {
      type: String,
      default: "",
      trim: true,
    },

    // Fechas críticas
    fechaSolicitud: {
      type: Date,
      default: Date.now,
    },
    fechaConfirmacion: {
      type: Date,
      default: null,
    },
    fechaCorteDocumental: {
      type: Date,
      default: null,
    },
    fechaCorteCarga: {
      type: Date,
      default: null,
    },
    fechaEstimadaLlegada: {
      type: Date,
      default: null,
    },

    // Estado
    estatus: {
      type: String,
      enum: ESTATUS_EMBARQUE,
      default: "SOLICITADO",
    },
    requiereCartaRetiro: {
      type: Boolean,
      default: true,
    },

    // Documentos y notas
    detalleContenedores: {
      type: String,
      default: "",
    },
    bookingPdfUrl: {
      type: String,
      default: "",
    },
    instruccionEnviada: {
      type: Boolean,
      default: false,
    },
    notasOperador: {
      type: String,
      default: "",
    },

    // Historial
    historialEstatus: [
      {
        estatus: { type: String, enum: ESTATUS_EMBARQUE },
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
EmbarqueSchema.index({ estatus: 1 });
EmbarqueSchema.index({ naviera: 1 });
EmbarqueSchema.index({ cliente: 1 });
EmbarqueSchema.index({ fechaCorteDocumental: 1 });

// Middleware: al crear, registrar el primer estado en historial
EmbarqueSchema.pre("save", function () {
  if (this.isNew && this.historialEstatus.length === 0) {
    this.historialEstatus.push({
      estatus: this.estatus,
      fecha: new Date(),
      nota: "Embarque creado",
    });
  }
});

const Embarque =
  models.Embarque || mongoose.model<IEmbarque>("Embarque", EmbarqueSchema);

export default Embarque;
