import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Guide } from '../types/types.ts';
import type { RootState } from '../store/store';
import { updateGuideStatus } from '../store/guidesSlice';

interface GuideListProps {
  onVerHistorial: (guia: Guide) => void;
}

export const GuideList: React.FC<GuideListProps> = ({ onVerHistorial }) => {
  const dispatch = useDispatch();
  const guides = useSelector((state: RootState) => state.guides.guides);

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
            <button className="boton-estado" aria-label={`Cambiar estado de la guía ${guia.numero}`} onClick={() => dispatch(updateGuideStatus(guia.numero))}>Cambiar estado</button>
            <button className="boton-historial" aria-label={`Ver historial de la guía ${guia.numero}`} onClick={() => onVerHistorial(guia)}>Ver historial</button>
          </article>
        ))}
      </div>
    </section>
  );
};