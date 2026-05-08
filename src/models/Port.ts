import mongoose, { Schema } from "mongoose";

export interface IPort {
  name: string;        // "Los Angeles"
  code: string;        // "USLAX" (UN/LOCODE)
  country: string;     // "United States"
  countryCode: string; // "US"
  type: "port" | "city" | "terminal" | "depot";
  region: string;      // "California"
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const PortSchema = new Schema<IPort>({
  name:        { type: String, required: true },
  code:        { type: String, required: true, unique: true },
  country:     { type: String, required: true },
  countryCode: { type: String, required: true },
  type:        { type: String, enum: ["port", "city", "terminal", "depot"], default: "port" },
  region:      { type: String, default: "" },
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

// Índice de texto para búsqueda fuzzy
PortSchema.index({ name: "text", region: "text", country: "text", code: "text" });

export default mongoose.models.Port || mongoose.model<IPort>("Port", PortSchema);
