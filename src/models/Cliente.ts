import mongoose, { Schema, Document, models } from "mongoose";

export interface ICliente extends Document {
  nombre: string;          // "SKECHERS", "CLIENTE B", etc.
  contactoEmail: string;
  contactoTelefono?: string;
  direccion?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClienteSchema = new Schema<ICliente>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      trim: true,
      uppercase: true,
    },
    contactoEmail: {
      type: String,
      required: [true, "El correo de contacto es obligatorio"],
      trim: true,
      lowercase: true,
    },
    contactoTelefono: {
      type: String,
      trim: true,
      default: "",
    },
    direccion: {
      type: String,
      trim: true,
      default: "",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cliente =
  models.Cliente || mongoose.model<ICliente>("Cliente", ClienteSchema);

export default Cliente;
