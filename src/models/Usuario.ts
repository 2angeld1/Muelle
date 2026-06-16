import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);
