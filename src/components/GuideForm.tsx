import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { GuideStatus } from '../types/types';
import type { RootState } from '../store/store';
import { addGuide } from '../store/guidesSlice';

export const GuideForm: React.FC = () => {
  const dispatch = useDispatch();
  const guides = useSelector((state: RootState) => state.guides.guides);

  const [destinatario, setDestinatario] = useState('');
  const [numero, setNumero] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<GuideStatus>('Pendiente');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const datos = {
      destinatario: destinatario.trim(),
      numero: numero.trim(),
      origen: origen.trim(),
      destino: destino.trim(),
    };

    if (!datos.destinatario || !datos.numero || !datos.origen || !datos.destino || !fecha) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const guiaRepetida = guides.some((guia) => guia.numero === datos.numero);
    if (guiaRepetida) {
      setError('El número de guía ya existe.');
      return;
    }

    setError('');

    dispatch(addGuide({
      ...datos,
      fecha,
      estado,
      historial: [{ estado, fecha: new Date().toLocaleString() }]
    }));

    setDestinatario('');
    setNumero('');
    setOrigen('');
    setDestino('');
    setFecha('');
    setEstado('Pendiente');
  };

  return (
    <section className="registro">
      <h2 className="registro__titulo">Registrar nueva guía</h2>
      <form className="registro__formulario" noValidate onSubmit={handleSubmit}>
        <label className="registro__label" htmlFor="guia-destinatario">Destinatario</label>
        <input className="registro__input" id="guia-destinatario" type="text" placeholder="Nombre del destinatario" value={destinatario} onChange={(e) => setDestinatario(e.target.value)} required aria-describedby="mensaje-error" />

        <label className="registro__label" htmlFor="guia-numero">Número de guía</label>
        <input className="registro__input" id="guia-numero" type="text" placeholder="Ej. HE-001" value={numero} onChange={(e) => setNumero(e.target.value)} required aria-describedby="mensaje-error" />

        <label className="registro__label" htmlFor="guia-origen">Origen</label>
        <input className="registro__input" id="guia-origen" type="text" placeholder="Ej. Puebla" value={origen} onChange={(e) => setOrigen(e.target.value)} required aria-describedby="mensaje-error" />

        <label className="registro__label" htmlFor="guia-destino">Destino</label>
        <input className="registro__input" id="guia-destino" type="text" placeholder="Ej. Ciudad de México" value={destino} onChange={(e) => setDestino(e.target.value)} required aria-describedby="mensaje-error" />

        <label className="registro__label" htmlFor="guia-fecha">Fecha de creación</label>
        <input className="registro__input" id="guia-fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required aria-describedby="mensaje-error" />

        <label className="registro__label" htmlFor="guia-estado">Estado inicial</label>
        <select className="registro__select" id="guia-estado" value={estado} onChange={(e) => setEstado(e.target.value as GuideStatus)}>
          <option value="Pendiente">Pendiente</option>
          <option value="En tránsito">En tránsito</option>
          <option value="Entregada">Entregada</option>
        </select>
        <p className="registro__error" id="mensaje-error" role="alert" aria-live="polite">{error}</p>
        <button className="registro__boton" type="submit">Registrar guía</button>
      </form>
    </section>
  );
};