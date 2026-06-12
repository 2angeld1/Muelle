/**
 * Implementación "manual" del servicio de navieras.
 * 
 * En este modo, todos los datos son ingresados por el operador humano.
 * Los métodos devuelven respuestas vacías o placeholders, porque la info
 * real viene del formulario de la UI.
 * 
 * Cuando las APIs o Caitlyn estén listas, se crea una nueva implementación
 * (ej: CoscoApiService, EvergreenApiService, MscScrapingService)
 * y se registra en el factory (index.ts).
 */

import { NavieraName } from "@/lib/naviera-config";
import type {
  INavieraService,
  BookingStatus,
  TrackingInfo,
  CutoffDates,
  SealLetter,
} from "./types";

export class ManualNavieraService implements INavieraService {
  carrierName: NavieraName;

  constructor(naviera: NavieraName) {
    this.carrierName = naviera;
  }

  async getBookingStatus(bookingNumber: string): Promise<BookingStatus> {
    // En modo manual, el operador ingresa el status directamente en el formulario
    return {
      bookingNumber,
      status: "pending",
      confirmationDate: undefined,
      vesselName: undefined,
      voyageNumber: undefined,
    };
  }

  async getTrackingInfo(containerNumber: string): Promise<TrackingInfo> {
    return {
      containerNumber,
      currentLocation: "Pendiente de ingreso manual",
      status: "Sin tracking automático",
      lastUpdate: new Date().toISOString(),
      events: [],
    };
  }

  async getCutoffDates(bookingNumber: string): Promise<CutoffDates> {
    return {
      bookingNumber,
      documentaryCutoff: undefined,
      cargoCutoff: undefined,
    };
  }

  async getSealLetter(bookingNumber: string): Promise<SealLetter> {
    return {
      available: false,
      message: `Modo manual: Carta de retiro/sellos para ${this.carrierName} debe gestionarse manualmente.`,
    };
  }

  async isAvailable(): Promise<boolean> {
    // El modo manual siempre está "disponible"
    return true;
  }
}
