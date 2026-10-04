import { render } from '@testing-library/react';
import { StatusPanel } from '../components/StatusPanel';
import { crearGuia } from './testUtils';

const contador = (id: string) => document.getElementById(id);

describe('StatusPanel', () => {
  test('muestra todos los contadores en cero sin guías', () => {
    render(<StatusPanel guides={[]} />);

    expect(contador('guias-activas')).toHaveTextContent('0');
    expect(contador('guias-transito')).toHaveTextContent('0');
    expect(contador('guias-entregadas')).toHaveTextContent('0');
  });

  test('cuenta las guías según su estado', () => {
    const guides = [
      crearGuia({ numero: 'HE-001', estado: 'Pendiente' }),
      crearGuia({ numero: 'HE-002', estado: 'Pendiente' }),
      crearGuia({ numero: 'HE-003', estado: 'En tránsito' }),
      crearGuia({ numero: 'HE-004', estado: 'Entregada' }),
      crearGuia({ numero: 'HE-005', estado: 'Entregada' }),
      crearGuia({ numero: 'HE-006', estado: 'Entregada' }),
    ];
    render(<StatusPanel guides={guides} />);

    expect(contador('guias-activas')).toHaveTextContent('2');
    expect(contador('guias-transito')).toHaveTextContent('1');
    expect(contador('guias-entregadas')).toHaveTextContent('3');
  });
});
