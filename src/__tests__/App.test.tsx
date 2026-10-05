import { screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderConStore } from './testUtils';

const registrarGuia = async (user: ReturnType<typeof userEvent.setup>, numero: string) => {
  await user.type(screen.getByPlaceholderText('Nombre del destinatario'), 'Juan Pérez');
  await user.type(screen.getByPlaceholderText('Ej. HE-001'), numero);
  await user.type(screen.getByPlaceholderText('Ej. Puebla'), 'Puebla');
  await user.type(screen.getByPlaceholderText('Ej. Ciudad de México'), 'Ciudad de México');
  fireEvent.change(document.querySelector('input[type="date"]')!, { target: { value: '2026-10-04' } });
  await user.click(screen.getByRole('button', { name: 'Registrar guía' }));
};

const contador = (id: string) => document.getElementById(id);

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('una guía registrada aparece en la lista y en el panel de estado', async () => {
    const user = userEvent.setup();
    renderConStore(<App />);

    await registrarGuia(user, 'HE-001');

    expect(screen.getByText('Número de guía: HE-001')).toBeInTheDocument();
    expect(screen.getByText('Estado: Pendiente')).toBeInTheDocument();
    expect(contador('guias-activas')).toHaveTextContent('1');
  });

  test('no permite registrar dos guías con el mismo número', async () => {
    const user = userEvent.setup();
    renderConStore(<App />);

    await registrarGuia(user, 'HE-001');
    await registrarGuia(user, 'HE-001');

    expect(screen.getByText('El número de guía ya existe.')).toBeInTheDocument();
    expect(screen.getAllByText('Número de guía: HE-001')).toHaveLength(1);
  });

  test('el botón "Cambiar estado" avanza la guía en el orden definido', async () => {
    const user = userEvent.setup();
    renderConStore(<App />);
    await registrarGuia(user, 'HE-001');
    const cambiarEstado = screen.getByRole('button', { name: 'Cambiar estado de la guía HE-001' });

    await user.click(cambiarEstado);
    expect(screen.getByText('Estado: En tránsito')).toBeInTheDocument();
    expect(contador('guias-activas')).toHaveTextContent('0');
    expect(contador('guias-transito')).toHaveTextContent('1');

    await user.click(cambiarEstado);
    expect(screen.getByText('Estado: Entregada')).toBeInTheDocument();
    expect(contador('guias-transito')).toHaveTextContent('0');
    expect(contador('guias-entregadas')).toHaveTextContent('1');

    await user.click(cambiarEstado);
    expect(screen.getByText('Estado: Entregada')).toBeInTheDocument();
    expect(contador('guias-entregadas')).toHaveTextContent('1');
  });

  test('el historial muestra los estados por los que pasó la guía', async () => {
    const user = userEvent.setup();
    renderConStore(<App />);
    await registrarGuia(user, 'HE-001');
    await user.click(screen.getByRole('button', { name: 'Cambiar estado de la guía HE-001' }));

    await user.click(screen.getByRole('button', { name: 'Ver historial de la guía HE-001' }));

    const historial = within(document.getElementById('historial-guia')!);
    expect(screen.getByText('Historial de la guía: HE-001')).toBeInTheDocument();
    expect(historial.getByText(/Estado: Pendiente/)).toBeInTheDocument();
    expect(historial.getByText(/Estado: En tránsito/)).toBeInTheDocument();
  });
});
