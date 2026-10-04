import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuideList } from '../components/GuideList';
import { crearGuia } from './testUtils';

describe('GuideList', () => {
  test('no muestra guías cuando la lista está vacía', () => {
    render(<GuideList guides={[]} onCambiarEstado={jest.fn()} onVerHistorial={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Lista de Guías' })).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  test('muestra los datos de cada guía', () => {
    const guides = [
      crearGuia({ numero: 'HE-001' }),
      crearGuia({ numero: 'HE-002', destinatario: 'Ana López', estado: 'En tránsito' }),
    ];
    render(<GuideList guides={guides} onCambiarEstado={jest.fn()} onVerHistorial={jest.fn()} />);

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Número de guía: HE-001')).toBeInTheDocument();
    expect(screen.getByText('Destinatario: Ana López')).toBeInTheDocument();
    expect(screen.getByText('Estado: En tránsito')).toBeInTheDocument();
  });

  test('avisa qué guía debe cambiar de estado', async () => {
    const onCambiarEstado = jest.fn();
    const guides = [crearGuia({ numero: 'HE-001' }), crearGuia({ numero: 'HE-002' })];
    render(<GuideList guides={guides} onCambiarEstado={onCambiarEstado} onVerHistorial={jest.fn()} />);

    await userEvent.click(screen.getAllByRole('button', { name: 'Cambiar estado' })[1]);

    expect(onCambiarEstado).toHaveBeenCalledTimes(1);
    expect(onCambiarEstado).toHaveBeenCalledWith(guides[1]);
  });

  test('avisa de qué guía se quiere ver el historial', async () => {
    const onVerHistorial = jest.fn();
    const guides = [crearGuia()];
    render(<GuideList guides={guides} onCambiarEstado={jest.fn()} onVerHistorial={onVerHistorial} />);

    await userEvent.click(screen.getByRole('button', { name: 'Ver historial' }));

    expect(onVerHistorial).toHaveBeenCalledWith(guides[0]);
  });
});
