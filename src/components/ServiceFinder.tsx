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
      <h2>Buscar Servicios</h2>
      <input type="text" id="buscador" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <div className="servicios-contenedor" style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
        {serviciosFiltrados.map(s => (
          <div key={s.id} className="producto">
            <h3>{s.nombre}</h3>
            <button className="producto__boton" onClick={() => { setModalText(s.descripcion); setShowModal(true); }}>Ver más info</button>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal" id="modal" style={{ display: 'block', position: 'fixed', background: 'rgba(0,0,0,0.5)', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000 }}>
          <div className="modal__contenido" style={{ background: 'white', margin: '15% auto', padding: '20px', width: '50%', color: '#333' }}>
            <button id="cerrar-modal" onClick={() => setShowModal(false)}>X</button>
            <p className="modal__texto">{modalText}</p>
          </div>
        </div>
      )}
    </section>
  );
};
