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

    if (!destinatario || !numero || !origen || !destino || !fecha) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const guiaRepetida = guides.some((guia) => guia.numero === numero);
    if (guiaRepetida) {
      setError('El número de guía ya existe.');
      return;
    }

    setError('');

    dispatch(addGuide({
      destinatario,
      numero,
      origen,
      destino,
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
      <form className="registro__formulario" onSubmit={handleSubmit}>
        <label className="registro__label">Destinatario</label>
        <input className="registro__input" type="text" placeholder="Nombre del destinatario" value={destinatario} onChange={(e) => setDestinatario(e.target.value)} />

        <label className="registro__label">Número de guía</label>
        <input className="registro__input" type="text" placeholder="Ej. HE-001" value={numero} onChange={(e) => setNumero(e.target.value)} />

        <label className="registro__label">Origen</label>
        <input className="registro__input" type="text" placeholder="Ej. Puebla" value={origen} onChange={(e) => setOrigen(e.target.value)} />

        <label className="registro__label">Destino</label>
        <input className="registro__input" type="text" placeholder="Ej. Ciudad de México" value={destino} onChange={(e) => setDestino(e.target.value)} />

        <label className="registro__label">Fecha de creación</label>
        <input className="registro__input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <label className="registro__label">Estado inicial</label>
        <select className="registro__select" value={estado} onChange={(e) => setEstado(e.target.value as GuideStatus)}>
          <option value="Pendiente">Pendiente</option>
          <option value="En tránsito">En tránsito</option>
          <option value="Entregada">Entregada</option>
        </select>
        <p className="registro__error" id="mensaje-error" style={{ color: 'red' }}>{error}</p>
        <button className="registro__boton" type="submit">Registrar guía</button>
      </form>
    </section>
  );
};