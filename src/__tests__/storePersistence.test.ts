import { addGuide } from '../store/guidesSlice';
import { store } from '../store/store';
import { crearGuia } from './testUtils';

describe('persistencia de guías', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('guarda el estado actualizado en el almacenamiento local', () => {
    const guia = crearGuia();

    store.dispatch(addGuide(guia));

    expect(JSON.parse(window.localStorage.getItem('hound-express-guides')!)).toEqual([guia]);
  });
});
