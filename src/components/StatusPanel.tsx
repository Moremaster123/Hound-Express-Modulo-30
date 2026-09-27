import React from 'react';
import type { Guide } from '../types/types';

interface StatusPanelProps {
  guides: Guide[];
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ guides }) => {
  const activas = guides.filter(g => g.estado === 'Pendiente').length;
  const transito = guides.filter(g => g.estado === 'En tránsito').length;
  const entregadas = guides.filter(g => g.estado === 'Entregada').length;

  return (
    <section className="estado">
      <h2 className="estado__titulo">Estado General</h2>
      <div className="estado__contenedor">
        <article className="estado__tarjeta">
          <h3 className="estado__subtitulo">Guías activas</h3>
          <p className="estado__numero" id="guias-activas">{activas}</p>
        </article>
        <article className="estado__tarjeta">
          <h3 className="estado__subtitulo">En tránsito</h3>
          <p className="estado__numero" id="guias-transito">{transito}</p>
        </article>
        <article className="estado__tarjeta">
          <h3 className="estado__subtitulo">Entregadas</h3>
          <p className="estado__numero" id="guias-entregadas">{entregadas}</p>
        </article>
      </div>
    </section>
  );
};
