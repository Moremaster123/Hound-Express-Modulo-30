import type { Guide, GuideStatus } from '../types/types';

// Orden definido del flujo de estados de una guía
export const STATUS_ORDER: GuideStatus[] = ['Pendiente', 'En tránsito', 'Entregada'];

export type GuidesAction =
  | { type: 'addGuide'; payload: Guide }
  | { type: 'updateGuideStatus'; payload: { numero: string; fecha: string } };

export const addGuide = (guide: Guide): GuidesAction => ({
  type: 'addGuide',
  payload: guide,
});

export const updateGuideStatus = (
  numero: string,
  fecha: string = new Date().toLocaleString()
): GuidesAction => ({
  type: 'updateGuideStatus',
  payload: { numero, fecha },
});

// Devuelve el siguiente estado del flujo; 'Entregada' es el estado final
export const getNextStatus = (estado: GuideStatus): GuideStatus => {
  const index = STATUS_ORDER.indexOf(estado);
  return STATUS_ORDER[Math.min(index + 1, STATUS_ORDER.length - 1)];
};

export const guidesReducer = (state: Guide[], action: GuidesAction): Guide[] => {
  switch (action.type) {
    case 'addGuide': {
      const guiaRepetida = state.some((guia) => guia.numero === action.payload.numero);
      if (guiaRepetida) return state;
      return [...state, action.payload];
    }
    case 'updateGuideStatus': {
      const { numero, fecha } = action.payload;
      return state.map((guia) => {
        if (guia.numero !== numero) return guia;

        const nuevoEstado = getNextStatus(guia.estado);
        if (nuevoEstado === guia.estado) return guia;

        return {
          ...guia,
          estado: nuevoEstado,
          historial: [...guia.historial, { estado: nuevoEstado, fecha }],
        };
      });
    }
    default:
      return state;
  }
};
