/**
 * Configuración estática de navieras.
 * Este archivo NO importa mongoose, así que puede usarse en Client Components.
 */

export const NAVIERAS = ["COSCO", "EVERGREEN", "MSC", "SEABOARD"] as const;
export type NavieraName = (typeof NAVIERAS)[number];

/**
 * Configuración por naviera: define qué reglas de negocio aplica cada una.
 */
export const NAVIERA_CONFIG: Record<
  NavieraName,
  {
    requiereCartaRetiro: boolean;
    tieneApiOficial: boolean;
    colorHex: string;
    colorBg: string;
    metodoCartaRetiro: string;
  }
> = {
  COSCO: {
    requiereCartaRetiro: true,
    tieneApiOficial: true,
    colorHex: "#1e40af",
    colorBg: "#dbeafe",
    metodoCartaRetiro: "Genera carta de retiro interna desde la app",
  },
  EVERGREEN: {
    requiereCartaRetiro: true,
    tieneApiOficial: true,
    colorHex: "#15803d",
    colorBg: "#dcfce7",
    metodoCartaRetiro: "Genera carta de retiro interna desde la app",
  },
  MSC: {
    requiereCartaRetiro: true,
    tieneApiOficial: false,
    colorHex: "#1e293b",
    colorBg: "#f1f5f9",
    metodoCartaRetiro: "Redirigir al portal MyMSC para Carta de Sellos oficial",
  },
  SEABOARD: {
    requiereCartaRetiro: false,
    tieneApiOficial: false,
    colorHex: "#b91c1c",
    colorBg: "#fee2e2",
    metodoCartaRetiro: "No requiere carta. Utilizar Booking PDF para liberación",
  },
};
