import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Por favor define la variable MONGODB_URI dentro del archivo .env"
  );
}

/**
 * Usamos el objeto global para mantener en caché la conexión de Mongoose.
 * En desarrollo, Next.js reinicia constantemente los archivos al guardar,
 * si no hacemos esto, agotaríamos todas las conexiones de MongoDB al instante.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Si ya tenemos una conexión abierta, la reutilizamos (súper rápido)
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay conexión, la creamos
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("🚢 MongoDB Conectado a NexoExport exitosamente");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
