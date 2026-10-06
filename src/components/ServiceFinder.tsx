import React, { useState } from 'react';
import type { Servicio } from '../types/types';

export const ServiceFinder: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [modalText, setModalText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const servicios: Servicio[] = [
    { id: 'nacional', nombre: 'Envío Nacional', descripcion: 'Envío Nacional: entrega de 3 a 5 días por $150 MXN.' },
    { id: 'express', nombre: 'Envío Express', descripcion: 'Envío Express: entrega de 1 a 2 días por $250 MXN.' },
    { id: 'internacional', nombre: 'Envío Internacional', descripcion: 'Envío Internacional: entrega de 5 a 10 días por $500 MXN.' },
  ];

  const serviciosFiltrados = servicios.filter(s => s.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <section className="servicios">
      <h2 id="titulo-servicios">Buscar Servicios</h2>
      <label className="sr-only" htmlFor="buscador">Buscar un servicio de envío</label>
      <input type="text" id="buscador" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <div className="servicios-contenedor">
        {serviciosFiltrados.map(s => (
          <div key={s.id} className="producto">
            <h3>{s.nombre}</h3>
            <button className="producto__boton" aria-label={`Ver más información sobre ${s.nombre}`} onClick={() => { setModalText(s.descripcion); setShowModal(true); }}>Ver más info</button>
            {serviciosFiltrados.length === 0 && <p role="status">No se encontraron servicios.</p>}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-servicio" onKeyDown={(event) => {
          if (event.key === 'Escape') setShowModal(false);
          if (event.key === 'Tab') {
            const focusable = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}>
          <div className="modal__contenido">
            <h3 id="titulo-modal-servicio" className="sr-only">Información del servicio</h3>
            <button id="cerrar-modal" className="modal__cerrar" aria-label="Cerrar información del servicio" autoFocus onClick={() => setShowModal(false)}>Cerrar</button>
            <p className="modal__texto">{modalText}</p>
          </div>
        </div>
      )}
    </section>
  );
};
