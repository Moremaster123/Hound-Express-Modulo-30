import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Header } from './components/Header.tsx';
import { GuideForm } from './components/GuideForm.tsx';
import { StatusPanel } from './components/StatusPanel.tsx';
import { GuideList } from './components/GuideList.tsx';
import { QuoteForm } from './components/QuoteForm.tsx';
import { ServiceFinder } from './components/ServiceFinder.tsx';
import type { Guide } from './types/types.ts';
import type { RootState } from './store/store';
import './App.css';

function App() {
  const guides = useSelector((state: RootState) => state.guides.guides);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <main id="contenido" className="main">
        <ServiceFinder />
        <QuoteForm />
        <hr className="separador" />
        <GuideForm />
        <StatusPanel guides={guides} />
        <GuideList onVerHistorial={(g) => { setSelectedGuide(g); setShowModal(true); }} />
      </main>

      {showModal && selectedGuide && (
        <div className="modal" id="modal-historial" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-historial" onKeyDown={(event) => {
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
            <button className="modal__cerrar" id="cerrar-historial" aria-label="Cerrar historial de la guía" autoFocus onClick={() => setShowModal(false)}>Cerrar</button>
            <h2 className="modal__titulo" id="titulo-modal-historial">Historial de la guía: {selectedGuide.numero}</h2>
            <div className="modal__historial" id="historial-guia">
              {selectedGuide.historial.map((h, i) => (
                <p key={i}>Estado: {h.estado} - Fecha: {h.fecha}</p>
              ))}
            </div>
          </div>
        </div>
      )}
      <footer className="footer">
        <p>Hound Express | Gestión de guías y envíos</p>
      </footer>
    </>
  );
}

export default App;