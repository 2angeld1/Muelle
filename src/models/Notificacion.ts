import mongoose from "mongoose";

const NotificacionSchema = new mongoose.Schema(
  {
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: false },
    titulo: { type: String, required: true },
    mensaje: { type: String, required: true },
    tipo: { type: String, enum: ["info", "warning", "success", "error"], default: "info" },
    leida: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notificacion || mongoose.model("Notificacion", NotificacionSchema);
