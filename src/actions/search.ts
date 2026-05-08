"use server"; // ¡Esto le dice a Next.js que esta función SOLO se ejecuta en Node.js!

import connectDB from "../lib/db";
import Search from "../models/Search";

export async function createSearchAction(formData: FormData) {
  try {
    // 1. Extraemos los datos que vienen del formulario
    const origen = formData.get("origen") as string;
    const destino = formData.get("destino") as string;
    const arrivalDate = formData.get("arrivalDate") as string;

    if (!origen || !destino || !arrivalDate) {
      return { error: "Todos los campos (origen, destino y fecha) son obligatorios." };
    }

    // 2. Nos conectamos a Mongoose
    await connectDB();

    // 3. Guardamos el registro en la colección
    const newSearch = await Search.create({
      origen,
      destino,
    });

    // 4. Conectamos con el Microservicio de Python (Caitlyn AI)
    let caitlynMessage = "Guardado localmente, pero Caitlyn está fuera de línea.";
    
    let itineraries: any[] = [];
    
    try {
      const pythonUrl = process.env.PYTHON_SERVICE_URL || "http://localhost:8000";
      // Llamamos al nuevo servicio de "caza" de itinerarios
      const response = await fetch(`${pythonUrl}/agent/logistics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: origen,
          destination: destino,
          arrival_date: arrivalDate
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        caitlynMessage = aiData.message;
        itineraries = aiData.itineraries || [];
        console.log(`🧩 Caitlyn encontró ${itineraries.length} itinerarios.`);
      }
    } catch (error) {
      console.error("❌ No se pudo contactar con el microservicio Python:", error);
    }

    // 5. Respondemos al frontend con todo el combo: datos + respuesta de IA
    return { 
      success: true, 
      data: {
        id: newSearch._id.toString(),
        origen: newSearch.origen,
        destino: newSearch.destino,
        analysis: caitlynMessage,
        itineraries: itineraries
      } 
    };

  } catch (error: any) {
    console.error("🔥 Error en la Server Action:", error);
    return { error: "Hubo un error al contactar la base de datos." };
  }
}
