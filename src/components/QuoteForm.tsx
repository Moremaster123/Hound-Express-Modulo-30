import React, { useState } from 'react';
import type { ServicioTipo } from '../types/types';

export const QuoteForm: React.FC = () => {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [peso, setPeso] = useState('');
  const [tipoEnvio, setTipoEnvio] = useState<ServicioTipo>('nacional');
  const [costo, setCosto] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [error, setError] = useState('');

  const handleCotizar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origen.trim() || !destino.trim() || !peso || !Number.isFinite(Number(peso)) || Number(peso) <= 0) {
      setError('Completa el origen, destino y un peso mayor que 0 kg.');
      return;
    }
    setError('');
    const precio = tipoEnvio === 'nacional' ? 150 : tipoEnvio === 'express' ? 250 : 500;
    const t = tipoEnvio === 'nacional' ? '3-5 días' : tipoEnvio === 'express' ? '1-2 días' : '5-10 días';
    
    setCosto(`Costo estimado: $${precio} MXN`);
    setTiempo(`Tiempo estimado: ${t}`);
  };

  return (
    <section className="cotizador">
      <h2>Cotizador de Envíos</h2>
      <form className="cotizador__formulario" noValidate onSubmit={handleCotizar}>
        <label className="sr-only" htmlFor="cotizador-origen">Origen del envío</label>
        <input id="cotizador-origen" type="text" placeholder="Origen" value={origen} onChange={(e) => setOrigen(e.target.value)} required />
        <label className="sr-only" htmlFor="cotizador-destino">Destino del envío</label>
        <input id="cotizador-destino" type="text" placeholder="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} required />
        <label className="sr-only" htmlFor="cotizador-peso">Peso del paquete</label>
        <input id="cotizador-peso" type="number" min="0.1" step="any" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} required />
        <label className="sr-only" htmlFor="cotizador-tipo">Tipo de envío</label>
        <select id="cotizador-tipo" value={tipoEnvio} onChange={(e) => setTipoEnvio(e.target.value as ServicioTipo)}>
          <option value="nacional">Nacional</option>
          <option value="express">Express</option>
          <option value="internacional">Internacional</option>
        </select>
        <button type="submit">Cotizar</button>
      </form>
      {error && <p className="cotizador__error" role="alert">{error}</p>}
      <p className="cotizador__costo" aria-live="polite">{costo}</p>
      <p className="cotizador__tiempo" aria-live="polite">{tiempo}</p>
    </section>
  );
};
