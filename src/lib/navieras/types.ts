/**
 * Capa de abstracción para integración con navieras.
 * 
 * HOY: Los datos se ingresan manualmente por el operador.
 * MAÑANA: Se conecta a APIs oficiales (Evergreen ShipmentLink, COSCO SynCon Hub)
 *         o a Caitlyn AI para scraping (MSC eBusiness, Seaboard).
 * 
 * Las pantallas NUNCA cambian — solo se cambia la implementación aquí.
 */

import { NavieraName } from "@/lib/naviera-config";

// === TIPOS DE DATOS QUE DEVUELVEN LAS NAVIERAS ===

export interface BookingStatus {
  bookingNumber: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  confirmationDate?: string;
  vesselName?: string;
  voyageNumber?: string;
}

export interface TrackingInfo {
  containerNumber: string;
  currentLocation: string;
  status: string;
  estimatedArrival?: string;
  lastUpdate: string;
  events: {
    date: string;
    location: string;
    description: string;
  }[];
}

export interface CutoffDates {
  bookingNumber: string;
  documentaryCutoff?: string; // Fecha corte documental
  cargoCutoff?: string;       // Fecha corte de carga
  vgmCutoff?: string;         // Fecha corte VGM
}

export interface SealLetter {
  available: boolean;
  downloadUrl?: string;
  sealNumber?: string;
  message: string;
}

// === INTERFAZ DEL SERVICIO ===

export interface INavieraService {
  /** Nombre de la naviera que implementa */
  carrierName: NavieraName;

  /** Consulta el estado de un booking */
  getBookingStatus(bookingNumber: string): Promise<BookingStatus>;

  /** Obtiene info de tracking de un contenedor */
  getTrackingInfo(containerNumber: string): Promise<TrackingInfo>;

  /** Obtiene las fechas de corte de un booking */
  getCutoffDates(bookingNumber: string): Promise<CutoffDates>;

  /** Obtiene la carta de sellos / retiro (si aplica) */
  getSealLetter(bookingNumber: string): Promise<SealLetter>;

  /** Indica si el servicio está disponible (API online o Caitlyn activa) */
  isAvailable(): Promise<boolean>;
}

// === TIPO PARA EL MÉTODO DE INTEGRACIÓN ===

export type IntegrationMethod = "manual" | "api" | "scraping";

export interface NavieraServiceConfig {
  naviera: NavieraName;
  method: IntegrationMethod;
  apiBaseUrl?: string;
  apiKey?: string;
  scrapingEndpoint?: string; // URL de Caitlyn para scraping
}
