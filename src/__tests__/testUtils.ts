import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import guidesReducer from '../store/guidesSlice';
import type { Guide } from '../types/types';

// Crea una guía de prueba; se puede sobrescribir cualquier campo
export const crearGuia = (overrides: Partial<Guide> = {}): Guide => {
  const estado = overrides.estado ?? 'Pendiente';
  return {
    destinatario: 'Juan Pérez',
    numero: 'HE-001',
    origen: 'Puebla',
    destino: 'Ciudad de México',
    fecha: '2026-10-04',
    estado,
    historial: [{ estado, fecha: '4/10/2026, 10:00:00' }],
    ...overrides,
  };
};

// Crea un store nuevo por prueba, opcionalmente con guías ya registradas
export const crearStore = (guides: Guide[] = []) =>
  configureStore({
    reducer: { guides: guidesReducer },
    preloadedState: { guides: { guides } },
  });

// Renderiza un componente conectado a un store de prueba
export const renderConStore = (ui: ReactElement, guides: Guide[] = []) => {
  const store = crearStore(guides);
  return { store, ...render(createElement(Provider, { store, children: ui })) };
};
