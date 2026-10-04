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
