import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuideList } from '../components/GuideList';
import { crearGuia, renderConStore } from './testUtils';

describe('GuideList', () => {
  test('no muestra guías cuando el store está vacío', () => {
    renderConStore(<GuideList onVerHistorial={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Lista de Guías' })).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  test('muestra los datos de cada guía del store', () => {
    const guides = [
      crearGuia({ numero: 'HE-001' }),
      crearGuia({ numero: 'HE-002', destinatario: 'Ana López', estado: 'En tránsito' }),
    ];
    renderConStore(<GuideList onVerHistorial={jest.fn()} />, guides);

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Número de guía: HE-001')).toBeInTheDocument();
    expect(screen.getByText('Destinatario: Ana López')).toBeInTheDocument();
    expect(screen.getByText('Estado: En tránsito')).toBeInTheDocument();
  });

  test('"Cambiar estado" avanza solo la guía seleccionada', async () => {
    const guides = [crearGuia({ numero: 'HE-001' }), crearGuia({ numero: 'HE-002' })];
    const { store } = renderConStore(<GuideList onVerHistorial={jest.fn()} />, guides);

    await userEvent.click(screen.getByRole('button', { name: 'Cambiar estado de la guía HE-002' }));

    const [primera, segunda] = store.getState().guides.guides;
    expect(primera.estado).toBe('Pendiente');
    expect(segunda.estado).toBe('En tránsito');
    expect(screen.getByText('Estado: En tránsito')).toBeInTheDocument();
  });

  test('"Cambiar estado" respeta el orden y se detiene en Entregada', async () => {
    const user = userEvent.setup();
    const { store } = renderConStore(<GuideList onVerHistorial={jest.fn()} />, [crearGuia()]);
    const boton = screen.getByRole('button', { name: 'Cambiar estado de la guía HE-001' });

    await user.click(boton);
    expect(screen.getByText('Estado: En tránsito')).toBeInTheDocument();

    await user.click(boton);
    expect(screen.getByText('Estado: Entregada')).toBeInTheDocument();

    await user.click(boton);
    expect(screen.getByText('Estado: Entregada')).toBeInTheDocument();
    expect(store.getState().guides.guides[0].historial).toHaveLength(3);
  });

  test('avisa de qué guía se quiere ver el historial', async () => {
    const onVerHistorial = jest.fn();
    const guides = [crearGuia()];
    renderConStore(<GuideList onVerHistorial={onVerHistorial} />, guides);

    await userEvent.click(screen.getByRole('button', { name: 'Ver historial de la guía HE-001' }));

    expect(onVerHistorial).toHaveBeenCalledWith(guides[0]);
  });
});
