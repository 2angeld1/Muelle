/**
 * Seed de Puertos Logísticos - Muelle
 * 
 * Ejecutar: npx ts-node --compiler-options '{"module":"commonjs"}' src/scripts/seed-ports.ts
 * O:        npx tsx src/scripts/seed-ports.ts
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/muelle";

const ports = [
  // === ESTADOS UNIDOS ===
  { name: "Los Angeles", code: "USLAX", country: "United States", countryCode: "US", type: "port", region: "California", coordinates: { lat: 33.74, lng: -118.27 } },
  { name: "Long Beach", code: "USLGB", country: "United States", countryCode: "US", type: "port", region: "California", coordinates: { lat: 33.76, lng: -118.19 } },
  { name: "Oakland", code: "USOAK", country: "United States", countryCode: "US", type: "port", region: "California", coordinates: { lat: 37.79, lng: -122.28 } },
  { name: "San Francisco", code: "USSFO", country: "United States", countryCode: "US", type: "city", region: "California", coordinates: { lat: 37.77, lng: -122.41 } },
  { name: "Miami", code: "USMIA", country: "United States", countryCode: "US", type: "port", region: "Florida", coordinates: { lat: 25.76, lng: -80.18 } },
  { name: "Port Everglades", code: "USPEF", country: "United States", countryCode: "US", type: "port", region: "Florida", coordinates: { lat: 26.09, lng: -80.12 } },
  { name: "Jacksonville", code: "USJAX", country: "United States", countryCode: "US", type: "port", region: "Florida", coordinates: { lat: 30.33, lng: -81.66 } },
  { name: "New York / New Jersey", code: "USNYC", country: "United States", countryCode: "US", type: "port", region: "New York", coordinates: { lat: 40.68, lng: -74.04 } },
  { name: "Houston", code: "USHOU", country: "United States", countryCode: "US", type: "port", region: "Texas", coordinates: { lat: 29.76, lng: -95.36 } },
  { name: "Savannah", code: "USSAV", country: "United States", countryCode: "US", type: "port", region: "Georgia", coordinates: { lat: 32.08, lng: -81.09 } },
  { name: "Charleston", code: "USCHS", country: "United States", countryCode: "US", type: "port", region: "South Carolina", coordinates: { lat: 32.78, lng: -79.93 } },
  { name: "Norfolk", code: "USORF", country: "United States", countryCode: "US", type: "port", region: "Virginia", coordinates: { lat: 36.85, lng: -76.29 } },
  { name: "Seattle", code: "USSEA", country: "United States", countryCode: "US", type: "port", region: "Washington", coordinates: { lat: 47.60, lng: -122.33 } },
  { name: "Tacoma", code: "USTCM", country: "United States", countryCode: "US", type: "port", region: "Washington", coordinates: { lat: 47.25, lng: -122.44 } },
  { name: "New Orleans", code: "USMSY", country: "United States", countryCode: "US", type: "port", region: "Louisiana", coordinates: { lat: 29.95, lng: -90.07 } },
  { name: "Baltimore", code: "USBAL", country: "United States", countryCode: "US", type: "port", region: "Maryland", coordinates: { lat: 39.29, lng: -76.61 } },

  // === PANAMÁ ===
  { name: "Balboa", code: "PABLB", country: "Panama", countryCode: "PA", type: "port", region: "Panama City", coordinates: { lat: 8.95, lng: -79.56 } },
  { name: "Cristóbal / Colón", code: "PACFZ", country: "Panama", countryCode: "PA", type: "port", region: "Colón", coordinates: { lat: 9.35, lng: -79.90 } },
  { name: "Manzanillo International Terminal", code: "PAMIT", country: "Panama", countryCode: "PA", type: "terminal", region: "Colón", coordinates: { lat: 9.36, lng: -79.88 } },
  { name: "Colon Free Zone", code: "PACZF", country: "Panama", countryCode: "PA", type: "depot", region: "Colón", coordinates: { lat: 9.36, lng: -79.90 } },
  { name: "Panama Pacifico", code: "PAPTX", country: "Panama", countryCode: "PA", type: "terminal", region: "Howard", coordinates: { lat: 8.93, lng: -79.60 } },
  { name: "Howard", code: "PAHOW", country: "Panama", countryCode: "PA", type: "depot", region: "Panama Pacifico", coordinates: { lat: 8.92, lng: -79.60 } },
  { name: "Rodman", code: "PARODM", country: "Panama", countryCode: "PA", type: "port", region: "Panama City", coordinates: { lat: 8.95, lng: -79.59 } },
  { name: "PSA Panama", code: "PAPSA", country: "Panama", countryCode: "PA", type: "terminal", region: "Panama City", coordinates: { lat: 8.93, lng: -79.55 } },

  // === COLOMBIA ===
  { name: "Cartagena", code: "COCTG", country: "Colombia", countryCode: "CO", type: "port", region: "Bolívar", coordinates: { lat: 10.39, lng: -75.51 } },
  { name: "Buenaventura", code: "COBUN", country: "Colombia", countryCode: "CO", type: "port", region: "Valle del Cauca", coordinates: { lat: 3.88, lng: -77.02 } },
  { name: "Barranquilla", code: "COBAQ", country: "Colombia", countryCode: "CO", type: "port", region: "Atlántico", coordinates: { lat: 10.96, lng: -74.78 } },
  { name: "Santa Marta", code: "COSMR", country: "Colombia", countryCode: "CO", type: "port", region: "Magdalena", coordinates: { lat: 11.24, lng: -74.20 } },

  // === MÉXICO ===
  { name: "Manzanillo", code: "MXZLO", country: "Mexico", countryCode: "MX", type: "port", region: "Colima", coordinates: { lat: 19.05, lng: -104.31 } },
  { name: "Lázaro Cárdenas", code: "MXLZC", country: "Mexico", countryCode: "MX", type: "port", region: "Michoacán", coordinates: { lat: 17.94, lng: -102.20 } },
  { name: "Veracruz", code: "MXVER", country: "Mexico", countryCode: "MX", type: "port", region: "Veracruz", coordinates: { lat: 19.18, lng: -96.13 } },
  { name: "Altamira", code: "MXATM", country: "Mexico", countryCode: "MX", type: "port", region: "Tamaulipas", coordinates: { lat: 22.43, lng: -97.86 } },
  { name: "Ensenada", code: "MXENS", country: "Mexico", countryCode: "MX", type: "port", region: "Baja California", coordinates: { lat: 31.87, lng: -116.62 } },

  // === ASIA ===
  { name: "Shanghai", code: "CNSHA", country: "China", countryCode: "CN", type: "port", region: "Shanghai", coordinates: { lat: 31.23, lng: 121.47 } },
  { name: "Shenzhen / Yantian", code: "CNYAN", country: "China", countryCode: "CN", type: "port", region: "Guangdong", coordinates: { lat: 22.58, lng: 114.28 } },
  { name: "Ningbo-Zhoushan", code: "CNNGB", country: "China", countryCode: "CN", type: "port", region: "Zhejiang", coordinates: { lat: 29.87, lng: 121.55 } },
  { name: "Qingdao", code: "CNTAO", country: "China", countryCode: "CN", type: "port", region: "Shandong", coordinates: { lat: 36.07, lng: 120.38 } },
  { name: "Guangzhou / Nansha", code: "CNCAN", country: "China", countryCode: "CN", type: "port", region: "Guangdong", coordinates: { lat: 22.74, lng: 113.60 } },
  { name: "Hong Kong", code: "HKHKG", country: "Hong Kong", countryCode: "HK", type: "port", region: "Hong Kong", coordinates: { lat: 22.30, lng: 114.17 } },
  { name: "Busan", code: "KRPUS", country: "South Korea", countryCode: "KR", type: "port", region: "Busan", coordinates: { lat: 35.10, lng: 129.03 } },
  { name: "Tokyo / Yokohama", code: "JPYOK", country: "Japan", countryCode: "JP", type: "port", region: "Kanto", coordinates: { lat: 35.44, lng: 139.64 } },
  { name: "Singapore", code: "SGSIN", country: "Singapore", countryCode: "SG", type: "port", region: "Singapore", coordinates: { lat: 1.26, lng: 103.84 } },
  { name: "Kaohsiung", code: "TWKHH", country: "Taiwan", countryCode: "TW", type: "port", region: "Kaohsiung", coordinates: { lat: 22.61, lng: 120.27 } },

  // === EUROPA ===
  { name: "Rotterdam", code: "NLRTM", country: "Netherlands", countryCode: "NL", type: "port", region: "South Holland", coordinates: { lat: 51.92, lng: 4.48 } },
  { name: "Antwerp", code: "BEANR", country: "Belgium", countryCode: "BE", type: "port", region: "Flanders", coordinates: { lat: 51.22, lng: 4.40 } },
  { name: "Hamburg", code: "DEHAM", country: "Germany", countryCode: "DE", type: "port", region: "Hamburg", coordinates: { lat: 53.55, lng: 9.99 } },
  { name: "Barcelona", code: "ESBCN", country: "Spain", countryCode: "ES", type: "port", region: "Catalonia", coordinates: { lat: 41.39, lng: 2.17 } },
  { name: "Valencia", code: "ESVLC", country: "Spain", countryCode: "ES", type: "port", region: "Valencia", coordinates: { lat: 39.47, lng: -0.38 } },
  { name: "Algeciras", code: "ESALG", country: "Spain", countryCode: "ES", type: "port", region: "Andalusia", coordinates: { lat: 36.13, lng: -5.45 } },
  { name: "Le Havre", code: "FRLEH", country: "France", countryCode: "FR", type: "port", region: "Normandy", coordinates: { lat: 49.49, lng: 0.12 } },
  { name: "Felixstowe", code: "GBFXT", country: "United Kingdom", countryCode: "GB", type: "port", region: "Suffolk", coordinates: { lat: 51.96, lng: 1.35 } },
  { name: "Piraeus", code: "GRPIR", country: "Greece", countryCode: "GR", type: "port", region: "Attica", coordinates: { lat: 37.94, lng: 23.65 } },
  { name: "Genova", code: "ITGOA", country: "Italy", countryCode: "IT", type: "port", region: "Liguria", coordinates: { lat: 44.41, lng: 8.93 } },

  // === CENTROAMÉRICA Y CARIBE ===
  { name: "Puerto Limón", code: "CRLIO", country: "Costa Rica", countryCode: "CR", type: "port", region: "Limón", coordinates: { lat: 10.00, lng: -83.03 } },
  { name: "Puerto Cortés", code: "HNPCR", country: "Honduras", countryCode: "HN", type: "port", region: "Cortés", coordinates: { lat: 15.83, lng: -87.95 } },
  { name: "Santo Tomás de Castilla", code: "GTSTC", country: "Guatemala", countryCode: "GT", type: "port", region: "Izabal", coordinates: { lat: 15.70, lng: -88.62 } },
  { name: "Kingston", code: "JMKIN", country: "Jamaica", countryCode: "JM", type: "port", region: "Kingston", coordinates: { lat: 17.97, lng: -76.79 } },
  { name: "Freeport", code: "BSFPO", country: "Bahamas", countryCode: "BS", type: "port", region: "Grand Bahama", coordinates: { lat: 26.53, lng: -78.65 } },
  { name: "Caucedo", code: "DOCAU", country: "Dominican Republic", countryCode: "DO", type: "port", region: "Santo Domingo", coordinates: { lat: 18.43, lng: -69.63 } },

  // === SUDAMÉRICA ===
  { name: "Callao", code: "PECLL", country: "Peru", countryCode: "PE", type: "port", region: "Lima", coordinates: { lat: -12.05, lng: -77.13 } },
  { name: "Guayaquil", code: "ECGYE", country: "Ecuador", countryCode: "EC", type: "port", region: "Guayas", coordinates: { lat: -2.19, lng: -79.89 } },
  { name: "Santos", code: "BRSSZ", country: "Brazil", countryCode: "BR", type: "port", region: "São Paulo", coordinates: { lat: -23.96, lng: -46.33 } },
  { name: "Buenos Aires", code: "ARBUE", country: "Argentina", countryCode: "AR", type: "port", region: "Buenos Aires", coordinates: { lat: -34.60, lng: -58.38 } },
  { name: "Valparaíso / San Antonio", code: "CLSAI", country: "Chile", countryCode: "CL", type: "port", region: "Valparaíso", coordinates: { lat: -33.59, lng: -71.61 } },
];

async function seed() {
  console.log("🚢 Conectando a MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const col = mongoose.connection.collection("ports");
  
  // Limpiar colección existente
  await col.deleteMany({});
  console.log("🧹 Colección limpiada");

  // Insertar puertos
  await col.insertMany(ports);
  console.log(`✅ ${ports.length} puertos insertados correctamente`);

  // Crear índices
  await col.createIndex({ name: "text", region: "text", country: "text", code: "text" });
  console.log("📇 Índices de texto creados");

  await mongoose.disconnect();
  console.log("👋 Listo!");
}

seed().catch(console.error);
