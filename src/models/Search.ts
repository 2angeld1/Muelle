import mongoose, { Schema, Document, models } from "mongoose";

// Esta interfaz es de TypeScript, nos ayuda a tener autocompletado y evitar errores tontos.
export interface ISearch extends Document {
  origen: string;
  destino: string;
  fecha: Date;
  status?: string; // Campo para actualizaciones de progreso
}

// Este es el esquema real para la base de datos de MongoDB
const SearchSchema = new Schema<ISearch>(
  {
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
    status: {
      type: String,
      default: "Iniciando misión...",
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Esto es magia pura: le dice a Mongoose que agregue automáticamente
    // los campos 'createdAt' (cuando se creó) y 'updatedAt' (última vez que se modificó).
    timestamps: true,
  }
);

/**
 * ¿Por qué esta línea rara de `models.Search || mongoose.model`?
 * Al guardar archivos en desarrollo (Next.js Fast Refresh), el archivo se vuelve a ejecutar.
 * Si Mongoose intenta crear un modelo que ya existe, explota. 
 * Así le decimos: "Usa el que ya existe, y si no existe, créalo".
 */
const Search = models.Search || mongoose.model<ISearch>("Search", SearchSchema);

export default Search;
