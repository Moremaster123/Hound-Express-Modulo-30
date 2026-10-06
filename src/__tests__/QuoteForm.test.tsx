import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuoteForm } from '../components/QuoteForm';

describe('QuoteForm', () => {
  test('muestra una cotización según el servicio seleccionado', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await user.type(screen.getByRole('textbox', { name: 'Origen del envío' }), 'Puebla');
    await user.type(screen.getByRole('textbox', { name: 'Destino del envío' }), 'CDMX');
    await user.type(screen.getByRole('spinbutton', { name: 'Peso del paquete' }), '2');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tipo de envío' }), 'express');
    await user.click(screen.getByRole('button', { name: 'Cotizar' }));

    expect(screen.getByText('Costo estimado: $250 MXN')).toBeInTheDocument();
    expect(screen.getByText('Tiempo estimado: 1-2 días')).toBeInTheDocument();
  });

  test('valida los datos y el peso antes de cotizar', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await user.click(screen.getByRole('button', { name: 'Cotizar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('peso mayor que 0 kg');
  });
});
