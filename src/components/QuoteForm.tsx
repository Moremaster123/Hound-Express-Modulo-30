import React, { useState } from 'react';

export const QuoteForm: React.FC = () => {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [peso, setPeso] = useState('');
  const [tipoEnvio, setTipoEnvio] = useState('nacional');
  const [costo, setCosto] = useState('');
  const [tiempo, setTiempo] = useState('');

  const handleCotizar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origen || !destino || !peso) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    const precio = tipoEnvio === 'nacional' ? 150 : tipoEnvio === 'express' ? 250 : 500;
    const t = tipoEnvio === 'nacional' ? '3-5 días' : tipoEnvio === 'express' ? '1-2 días' : '5-10 días';
    
    setCosto(`Costo estimado: $${precio} MXN`);
    setTiempo(`Tiempo estimado: ${t}`);
  };

  return (
    <section className="cotizador">
      <h2>Cotizador de Envíos</h2>
      <form className="cotizador__formulario" onSubmit={handleCotizar}>
        <label className="sr-only" htmlFor="cotizador-origen">Origen del envío</label>
        <input id="cotizador-origen" type="text" placeholder="Origen" value={origen} onChange={(e) => setOrigen(e.target.value)} />
        <label className="sr-only" htmlFor="cotizador-destino">Destino del envío</label>
        <input id="cotizador-destino" type="text" placeholder="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} />
        <label className="sr-only" htmlFor="cotizador-peso">Peso del paquete</label>
        <input id="cotizador-peso" type="number" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
        <label className="sr-only" htmlFor="cotizador-tipo">Tipo de envío</label>
        <select id="cotizador-tipo" value={tipoEnvio} onChange={(e) => setTipoEnvio(e.target.value)}>
          <option value="nacional">Nacional</option>
          <option value="express">Express</option>
          <option value="internacional">Internacional</option>
        </select>
        <button type="submit">Cotizar</button>
      </form>
      <p className="cotizador__costo" aria-live="polite">{costo}</p>
      <p className="cotizador__tiempo" aria-live="polite">{tiempo}</p>
    </section>
  );
};
