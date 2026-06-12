import mongoose, { Schema, Document, models } from "mongoose";

// Re-export from client-safe config (no mongoose dependency)
export { NAVIERAS, NAVIERA_CONFIG } from "@/lib/naviera-config";
export type { NavieraName } from "@/lib/naviera-config";

import { NAVIERAS, type NavieraName } from "@/lib/naviera-config";

export interface INaviera extends Document {
  nombre: NavieraName;
  ejecutivoCuenta: string;
  emailEjecutivo: string;
  telefono: string;
  notas?: string;
}

const NavieraSchema = new Schema<INaviera>(
  {
    nombre: {
      type: String,
      required: true,
      enum: NAVIERAS,
      unique: true,
    },
    ejecutivoCuenta: {
      type: String,
      default: "",
      trim: true,
    },
    emailEjecutivo: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      default: "",
      trim: true,
    },
    notas: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Naviera =
  models.Naviera || mongoose.model<INaviera>("Naviera", NavieraSchema);

export default Naviera;
