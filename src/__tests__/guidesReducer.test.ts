import guidesReducer, { addGuide, updateGuideStatus } from '../store/guidesSlice';
import { crearGuia } from './testUtils';

const estadoCon = (...guides: ReturnType<typeof crearGuia>[]) => ({ guides });

describe('guidesSlice reducer', () => {
  test('el estado inicial no tiene guías', () => {
    const state = guidesReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({ guides: [] });
  });

  test('devuelve el mismo estado ante una acción desconocida', () => {
    const inicial = estadoCon(crearGuia());

    const state = guidesReducer(inicial, { type: 'desconocida' });

    expect(state).toBe(inicial);
  });

  describe('addGuide', () => {
    test('añade una guía a un estado vacío', () => {
      const guia = crearGuia();

      const state = guidesReducer(estadoCon(), addGuide(guia));

      expect(state.guides).toHaveLength(1);
      expect(state.guides[0]).toEqual(guia);
    });

    test('añade la guía al final conservando las existentes', () => {
      const inicial = estadoCon(crearGuia({ numero: 'HE-001' }));

      const state = guidesReducer(inicial, addGuide(crearGuia({ numero: 'HE-002', destinatario: 'Ana López' })));

      expect(state.guides.map((g) => g.numero)).toEqual(['HE-001', 'HE-002']);
      expect(state.guides[1].destinatario).toBe('Ana López');
    });

    test('no muta el estado anterior', () => {
      const inicial = estadoCon(crearGuia({ numero: 'HE-001' }));

      const state = guidesReducer(inicial, addGuide(crearGuia({ numero: 'HE-002' })));

      expect(state).not.toBe(inicial);
      expect(inicial.guides).toHaveLength(1);
    });
  });

  describe('updateGuideStatus', () => {
    test('pasa de Pendiente a En tránsito', () => {
      const state = guidesReducer(estadoCon(crearGuia()), updateGuideStatus('HE-001'));

      expect(state.guides[0].estado).toBe('En tránsito');
    });

    test('pasa de En tránsito a Entregada', () => {
      const inicial = estadoCon(crearGuia({ estado: 'En tránsito' }));

      const state = guidesReducer(inicial, updateGuideStatus('HE-001'));

      expect(state.guides[0].estado).toBe('Entregada');
    });

    test('una guía Entregada ya no cambia de estado', () => {
      const inicial = estadoCon(crearGuia({ estado: 'Entregada' }));

      const state = guidesReducer(inicial, updateGuideStatus('HE-001'));

      expect(state.guides[0].estado).toBe('Entregada');
      expect(state.guides[0].historial).toHaveLength(1);
    });

    test('recorre el flujo completo respetando el orden definido', () => {
      let state = estadoCon(crearGuia());
      const recorrido = [state.guides[0].estado];

      for (let i = 0; i < 4; i++) {
        state = guidesReducer(state, updateGuideStatus('HE-001'));
        recorrido.push(state.guides[0].estado);
      }

      expect(recorrido).toEqual(['Pendiente', 'En tránsito', 'Entregada', 'Entregada', 'Entregada']);
    });

    test('registra cada cambio de estado en el historial', () => {
      let state = estadoCon(crearGuia());

      state = guidesReducer(state, updateGuideStatus('HE-001'));
      state = guidesReducer(state, updateGuideStatus('HE-001'));

      expect(state.guides[0].historial).toEqual([
        { estado: 'Pendiente', fecha: '4/10/2026, 10:00:00' },
        { estado: 'En tránsito', fecha: expect.any(String) },
        { estado: 'Entregada', fecha: expect.any(String) },
      ]);
    });

    test('solo actualiza la guía indicada', () => {
      const inicial = estadoCon(crearGuia({ numero: 'HE-001' }), crearGuia({ numero: 'HE-002' }));

      const state = guidesReducer(inicial, updateGuideStatus('HE-002'));

      expect(state.guides[0].estado).toBe('Pendiente');
      expect(state.guides[1].estado).toBe('En tránsito');
    });

    test('no cambia nada si el número de guía no existe', () => {
      const inicial = estadoCon(crearGuia());

      const state = guidesReducer(inicial, updateGuideStatus('NO-EXISTE'));

      expect(state).toEqual(inicial);
    });

    test('no muta el estado anterior', () => {
      const inicial = estadoCon(crearGuia());

      guidesReducer(inicial, updateGuideStatus('HE-001'));

      expect(inicial.guides[0].estado).toBe('Pendiente');
      expect(inicial.guides[0].historial).toHaveLength(1);
    });
  });
});

describe('action creators', () => {
  test('addGuide crea la acción con la guía como payload', () => {
    const guia = crearGuia();

    expect(addGuide(guia)).toEqual({ type: 'guides/addGuide', payload: guia });
  });

  test('updateGuideStatus crea la acción con el número de guía como payload', () => {
    expect(updateGuideStatus('HE-001')).toEqual({ type: 'guides/updateGuideStatus', payload: 'HE-001' });
  });
});
