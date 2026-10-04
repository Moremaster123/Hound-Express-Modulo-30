import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuideForm } from '../components/GuideForm';
import { crearGuia } from './testUtils';

const llenarFormulario = async (numero = 'HE-001') => {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('Nombre del destinatario'), 'Juan Pérez');
  await user.type(screen.getByPlaceholderText('Ej. HE-001'), numero);
  await user.type(screen.getByPlaceholderText('Ej. Puebla'), 'Puebla');
  await user.type(screen.getByPlaceholderText('Ej. Ciudad de México'), 'Ciudad de México');
  fireEvent.change(document.querySelector('input[type="date"]')!, { target: { value: '2026-10-04' } });
  return user;
};

const enviar = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: 'Registrar guía' }));

describe('GuideForm', () => {
  test('muestra el formulario de registro', () => {
    render(<GuideForm guides={[]} onAddGuide={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Registrar nueva guía' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar guía' })).toBeInTheDocument();
  });

  test('registra una guía nueva con los datos capturados', async () => {
    const onAddGuide = jest.fn();
    render(<GuideForm guides={[]} onAddGuide={onAddGuide} />);

    const user = await llenarFormulario();
    await enviar(user);

    expect(onAddGuide).toHaveBeenCalledTimes(1);
    expect(onAddGuide).toHaveBeenCalledWith({
      destinatario: 'Juan Pérez',
      numero: 'HE-001',
      origen: 'Puebla',
      destino: 'Ciudad de México',
      fecha: '2026-10-04',
      estado: 'Pendiente',
      historial: [{ estado: 'Pendiente', fecha: expect.any(String) }],
    });
  });

  test('registra la guía con el estado inicial seleccionado', async () => {
    const onAddGuide = jest.fn();
    render(<GuideForm guides={[]} onAddGuide={onAddGuide} />);

    const user = await llenarFormulario();
    await user.selectOptions(screen.getByRole('combobox'), 'En tránsito');
    await enviar(user);

    const guia = onAddGuide.mock.calls[0][0];
    expect(guia.estado).toBe('En tránsito');
    expect(guia.historial[0].estado).toBe('En tránsito');
  });

  test('limpia los campos después de registrar', async () => {
    render(<GuideForm guides={[]} onAddGuide={jest.fn()} />);

    const user = await llenarFormulario();
    await enviar(user);

    expect(screen.getByPlaceholderText('Nombre del destinatario')).toHaveValue('');
    expect(screen.getByPlaceholderText('Ej. HE-001')).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveValue('Pendiente');
  });

  test('muestra un error y no registra si faltan campos', async () => {
    const onAddGuide = jest.fn();
    render(<GuideForm guides={[]} onAddGuide={onAddGuide} />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Nombre del destinatario'), 'Juan Pérez');
    await enviar(user);

    expect(screen.getByText('Por favor, completa todos los campos.')).toBeInTheDocument();
    expect(onAddGuide).not.toHaveBeenCalled();
  });

  test('muestra un error y no registra si el número de guía ya existe', async () => {
    const onAddGuide = jest.fn();
    render(<GuideForm guides={[crearGuia({ numero: 'HE-001' })]} onAddGuide={onAddGuide} />);

    const user = await llenarFormulario('HE-001');
    await enviar(user);

    expect(screen.getByText('El número de guía ya existe.')).toBeInTheDocument();
    expect(onAddGuide).not.toHaveBeenCalled();
  });
});
