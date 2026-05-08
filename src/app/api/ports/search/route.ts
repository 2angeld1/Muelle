import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Port from "@/models/Port";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MIN_LOCAL_RESULTS = 3; // Si hay menos de 3 en DB, buscamos en la API

/**
 * Convierte un resultado de Nominatim a nuestro formato de Port
 */
function nominatimToPort(item: any): any {
  // Determinar tipo basado en la categoría de OSM
  let type = "city";
  const osmType = (item.type || "").toLowerCase();
  const osmClass = (item.class || "").toLowerCase();
  
  if (osmType.includes("port") || osmType.includes("harbour") || osmType.includes("marina")) {
    type = "port";
  } else if (osmType.includes("terminal") || osmType.includes("industrial")) {
    type = "terminal";
  } else if (osmType.includes("warehouse") || osmType.includes("depot")) {
    type = "depot";
  }

  // Extraer región y país del display_name
  const parts = (item.display_name || "").split(", ");
  const name = parts[0] || item.name || "";
  const region = parts[1] || "";
  const country = parts[parts.length - 1] || "";

  // Generar un código pseudo-LOCODE basado en el país y nombre
  const countryCode = (item.address?.country_code || "").toUpperCase() || "XX";
  const nameCode = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
  const code = `${countryCode}${nameCode}`;

  return {
    name,
    code,
    country,
    countryCode,
    type,
    region,
    coordinates: {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    },
    _fromApi: true, // Marca para saber que vino de la API
  };
}

/**
 * Busca en Nominatim y cachea resultados nuevos en MongoDB
 */
async function searchAndCache(query: string): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      q: `${query} port`,
      format: "json",
      limit: "8",
      addressdetails: "1",
      "accept-language": "en",
    });

    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        "User-Agent": "MuelleApp/1.0 (logistics platform)",
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const ports = data.map(nominatimToPort);

    // Guardar en MongoDB los que no existan
    for (const port of ports) {
      const { _fromApi, ...portData } = port;
      try {
        await Port.updateOne(
          { name: portData.name, countryCode: portData.countryCode },
          { $setOnInsert: portData },
          { upsert: true }
        );
      } catch {
        // Si falla el upsert (ej: duplicado), lo ignoramos
      }
    }

    return ports;
  } catch (err) {
    console.error("⚠️ Error consultando Nominatim:", err);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  await connectDB();

  // 1. Buscar primero en nuestra DB (cache local)
  const regex = new RegExp(q, "i");
  const localResults = await Port.find({
    $or: [
      { name: regex },
      { region: regex },
      { country: regex },
      { code: regex },
    ],
  })
    .select("name code country countryCode type region coordinates")
    .limit(8)
    .lean();

  // 2. Si hay suficientes resultados locales, los devolvemos directo
  if (localResults.length >= MIN_LOCAL_RESULTS) {
    return NextResponse.json(localResults);
  }

  // 3. Si no, buscamos en la API y cacheamos
  const apiResults = await searchAndCache(q);

  // 4. Combinar resultados (DB primero, luego API, sin duplicados)
  const seen = new Set(localResults.map((r: any) => `${r.name}-${r.countryCode}`));
  const combined = [...localResults];

  for (const port of apiResults) {
    const key = `${port.name}-${port.countryCode}`;
    if (!seen.has(key) && combined.length < 8) {
      seen.add(key);
      combined.push(port);
    }
  }

  return NextResponse.json(combined);
}
