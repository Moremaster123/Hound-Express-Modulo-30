import {
  guidesReducer,
  addGuide,
  updateGuideStatus,
  getNextStatus,
  STATUS_ORDER,
} from '../reducers/guidesReducer';
import type { GuidesAction } from '../reducers/guidesReducer';
import type { Guide } from '../types/types';
import { crearGuia } from './testUtils';

describe('guidesReducer', () => {
  describe('addGuide', () => {
    test('añade una guía a un estado vacío', () => {
      const guia = crearGuia();

      const state = guidesReducer([], addGuide(guia));

      expect(state).toHaveLength(1);
      expect(state[0]).toEqual(guia);
    });

    test('añade la guía al final conservando las existentes', () => {
      const primera = crearGuia({ numero: 'HE-001' });
      const segunda = crearGuia({ numero: 'HE-002', destinatario: 'Ana López' });

      const state = guidesReducer([primera], addGuide(segunda));

      expect(state.map((g) => g.numero)).toEqual(['HE-001', 'HE-002']);
      expect(state[0]).toBe(primera);
    });

    test('no muta el estado anterior', () => {
      const inicial: Guide[] = [crearGuia({ numero: 'HE-001' })];

      const state = guidesReducer(inicial, addGuide(crearGuia({ numero: 'HE-002' })));

      expect(state).not.toBe(inicial);
      expect(inicial).toHaveLength(1);
    });

    test('ignora una guía con un número que ya existe', () => {
      const inicial = [crearGuia({ numero: 'HE-001' })];

      const state = guidesReducer(inicial, addGuide(crearGuia({ numero: 'HE-001', destinatario: 'Otro' })));

      expect(state).toBe(inicial);
      expect(state[0].destinatario).toBe('Juan Pérez');
    });
  });

  describe('updateGuideStatus', () => {
    test('pasa de Pendiente a En tránsito', () => {
      const state = guidesReducer([crearGuia()], updateGuideStatus('HE-001'));

      expect(state[0].estado).toBe('En tránsito');
    });

    test('pasa de En tránsito a Entregada', () => {
      const inicial = [crearGuia({ estado: 'En tránsito' })];

      const state = guidesReducer(inicial, updateGuideStatus('HE-001'));

      expect(state[0].estado).toBe('Entregada');
    });

    test('una guía Entregada ya no cambia de estado', () => {
      const inicial = [crearGuia({ estado: 'Entregada' })];

      const state = guidesReducer(inicial, updateGuideStatus('HE-001'));

      expect(state[0]).toBe(inicial[0]);
      expect(state[0].historial).toHaveLength(1);
    });

    test('recorre el flujo completo respetando el orden definido', () => {
      let state = [crearGuia()];
      const recorrido = [state[0].estado];

      for (let i = 0; i < 4; i++) {
        state = guidesReducer(state, updateGuideStatus('HE-001'));
        recorrido.push(state[0].estado);
      }

      expect(recorrido).toEqual(['Pendiente', 'En tránsito', 'Entregada', 'Entregada', 'Entregada']);
    });

    test('registra cada cambio en el historial con su fecha', () => {
      const fecha = '5/10/2026, 12:30:00';

      const state = guidesReducer([crearGuia()], updateGuideStatus('HE-001', fecha));

      expect(state[0].historial).toEqual([
        { estado: 'Pendiente', fecha: '4/10/2026, 10:00:00' },
        { estado: 'En tránsito', fecha },
      ]);
    });

    test('solo actualiza la guía indicada', () => {
      const inicial = [crearGuia({ numero: 'HE-001' }), crearGuia({ numero: 'HE-002' })];

      const state = guidesReducer(inicial, updateGuideStatus('HE-002'));

      expect(state[0]).toBe(inicial[0]);
      expect(state[0].estado).toBe('Pendiente');
      expect(state[1].estado).toBe('En tránsito');
    });

    test('no cambia nada si el número de guía no existe', () => {
      const inicial = [crearGuia()];

      const state = guidesReducer(inicial, updateGuideStatus('NO-EXISTE'));

      expect(state).toEqual(inicial);
    });

    test('no muta la guía original', () => {
      const guia = crearGuia();

      guidesReducer([guia], updateGuideStatus('HE-001'));

      expect(guia.estado).toBe('Pendiente');
      expect(guia.historial).toHaveLength(1);
    });
  });

  test('devuelve el mismo estado ante una acción desconocida', () => {
    const inicial = [crearGuia()];

    const state = guidesReducer(inicial, { type: 'desconocida' } as unknown as GuidesAction);

    expect(state).toBe(inicial);
  });
});

describe('action creators', () => {
  test('addGuide crea la acción con la guía como payload', () => {
    const guia = crearGuia();

    expect(addGuide(guia)).toEqual({ type: 'addGuide', payload: guia });
  });

  test('updateGuideStatus crea la acción con el número y la fecha', () => {
    expect(updateGuideStatus('HE-001', 'hoy')).toEqual({
      type: 'updateGuideStatus',
      payload: { numero: 'HE-001', fecha: 'hoy' },
    });
  });

  test('updateGuideStatus usa la fecha actual si no se indica una', () => {
    const action = updateGuideStatus('HE-001');

    expect(action.payload).toEqual({ numero: 'HE-001', fecha: expect.any(String) });
  });
});

describe('getNextStatus', () => {
  test('el orden definido es Pendiente → En tránsito → Entregada', () => {
    expect(STATUS_ORDER).toEqual(['Pendiente', 'En tránsito', 'Entregada']);
  });

  test.each([
    ['Pendiente', 'En tránsito'],
    ['En tránsito', 'Entregada'],
    ['Entregada', 'Entregada'],
  ] as const)('de %s sigue %s', (actual, siguiente) => {
    expect(getNextStatus(actual)).toBe(siguiente);
  });
});
