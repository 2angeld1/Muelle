/**
 * Factory de servicios de navieras.
 * 
 * Selecciona la implementación correcta para cada naviera.
 * HOY: todas usan ManualNavieraService.
 * MAÑANA: se cambia aquí para usar ApiService o ScrapingService por naviera.
 */

import type { NavieraName } from "@/lib/naviera-config";
import type { INavieraService, IntegrationMethod } from "./types";
import { ManualNavieraService } from "./manual";

// Configuración de qué método usa cada naviera
const INTEGRATION_CONFIG: Record<NavieraName, IntegrationMethod> = {
  COSCO: "manual",
  EVERGREEN: "manual",
  MSC: "manual",
  SEABOARD: "manual",
};

/**
 * Obtiene el servicio de integración para una naviera específica.
 */
export function getNavieraService(naviera: NavieraName): INavieraService {
  const method = INTEGRATION_CONFIG[naviera];

  switch (method) {
    case "api":
      console.log(`⚠️ API para ${naviera} aún no implementada, usando modo manual`);
      return new ManualNavieraService(naviera);

    case "scraping":
      console.log(`⚠️ Scraping para ${naviera} aún no implementado, usando modo manual`);
      return new ManualNavieraService(naviera);

    case "manual":
    default:
      return new ManualNavieraService(naviera);
  }
}

/**
 * Verifica el estado de disponibilidad de todos los servicios.
 */
export async function getIntegrationStatus(): Promise<
  Record<NavieraName, { method: IntegrationMethod; available: boolean }>
> {
  const results: Record<string, { method: IntegrationMethod; available: boolean }> = {};

  for (const naviera of Object.keys(INTEGRATION_CONFIG) as NavieraName[]) {
    const service = getNavieraService(naviera);
    const available = await service.isAvailable();
    results[naviera] = {
      method: INTEGRATION_CONFIG[naviera],
      available,
    };
  }

  return results as Record<NavieraName, { method: IntegrationMethod; available: boolean }>;
}
