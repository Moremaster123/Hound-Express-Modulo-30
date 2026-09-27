// src/types/types.ts

export type GuideStatus = 'Pendiente' | 'En tránsito' | 'Entregada';
export type ServicioTipo = 'nacional' | 'express' | 'internacional';

export interface HistoryEntry {
  estado: GuideStatus;
  fecha: string;
}

export interface Guide {
  destinatario: string;
  numero: string;
  origen: string;
  destino: string;
  fecha: string;
  estado: GuideStatus;
  historial: HistoryEntry[];
}

export interface Servicio {
  id: ServicioTipo;
  nombre: string;
  descripcion: string;
}
