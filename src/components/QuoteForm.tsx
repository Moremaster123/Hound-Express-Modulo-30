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
    let precio = tipoEnvio === 'nacional' ? 150 : tipoEnvio === 'express' ? 250 : 500;
    let t = tipoEnvio === 'nacional' ? '3-5 días' : tipoEnvio === 'express' ? '1-2 días' : '5-10 días';
    
    setCosto(`Costo estimado: $${precio} MXN`);
    setTiempo(`Tiempo estimado: ${t}`);
  };

  return (
    <section className="cotizador">
      <h2>Cotizador de Envíos</h2>
      <form className="cotizador__formulario" onSubmit={handleCotizar}>
        <input type="text" placeholder="Origen" value={origen} onChange={(e) => setOrigen(e.target.value)} />
        <input type="text" placeholder="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} />
        <input type="number" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
        <select value={tipoEnvio} onChange={(e) => setTipoEnvio(e.target.value)}>
          <option value="nacional">Nacional</option>
          <option value="express">Express</option>
          <option value="internacional">Internacional</option>
        </select>
        <button type="submit">Cotizar</button>
      </form>
      <p className="cotizador__costo">{costo}</p>
      <p className="cotizador__tiempo">{tiempo}</p>
    </section>
  );
};
