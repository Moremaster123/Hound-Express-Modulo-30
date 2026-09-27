import React from 'react';
import type { Guide } from '../types/types.ts';

interface GuideListProps {
  guides: Guide[];
  onCambiarEstado: (guia: Guide) => void;
  onVerHistorial: (guia: Guide) => void;
}

export const GuideList: React.FC<GuideListProps> = ({ guides, onCambiarEstado, onVerHistorial }) => {
  return (
    <section className="lista">
      <h2 className="lista__titulo">Lista de Guías</h2>
      <div className="lista__contenedor" id="lista-guias">
        {guides.map((guia) => (
          <article key={guia.numero}>
            <h3>Número de guía: {guia.numero}</h3>
            <p>Destinatario: {guia.destinatario}</p>
            <p>Estado: {guia.estado}</p>
            <p>Origen: {guia.origen}</p>
            <p>Destino: {guia.destino}</p>
            <p>Fecha de creación: {guia.fecha}</p>
            <button className="boton-estado" onClick={() => onCambiarEstado(guia)}>Cambiar estado</button>
            <button className="boton-historial" onClick={() => onVerHistorial(guia)}>Ver historial</button>
          </article>
        ))}
      </div>
    </section>
  );
};
