import { configureStore } from '@reduxjs/toolkit';
import guidesReducer from './guidesSlice';
import type { Guide, GuideStatus } from '../types/types';

const storageKey = 'hound-express-guides';
const guideStatuses: GuideStatus[] = ['Pendiente', 'En tránsito', 'Entregada'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isGuideStatus = (value: unknown): value is GuideStatus =>
  guideStatuses.some((status) => status === value);

const isGuide = (value: unknown): value is Guide =>
  isRecord(value) &&
  typeof value.destinatario === 'string' &&
  typeof value.numero === 'string' &&
  typeof value.origen === 'string' &&
  typeof value.destino === 'string' &&
  typeof value.fecha === 'string' &&
  isGuideStatus(value.estado) &&
  Array.isArray(value.historial) &&
  value.historial.every((entry: unknown) =>
    isRecord(entry) &&
    isGuideStatus(entry.estado) &&
    typeof entry.fecha === 'string',
  );

const loadGuides = (): Guide[] => {
  if (typeof window === 'undefined') return [];

  try {
    const storedGuides = window.localStorage.getItem(storageKey);
    if (storedGuides === null) return [];

    const parsed: unknown = JSON.parse(storedGuides);
    if (!Array.isArray(parsed) || !parsed.every(isGuide)) {
      throw new Error('Los datos guardados no tienen un formato válido.');
    }

    return parsed;
  } catch (error) {
    console.error('No fue posible cargar las guías guardadas.', error);
    return [];
  }
};

export const store = configureStore({
  reducer: {
    guides: guidesReducer,
  },
  preloadedState: {
    guides: { guides: loadGuides() },
  },
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(store.getState().guides.guides));
    } catch (error) {
      console.error('No fue posible guardar las guías en este navegador.', error);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;