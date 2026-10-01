import { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('El estado de guías ha cambiado:', guides);
  }, [guides]);

  return (
    <>
      <Header />
      <main className="main" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <ServiceFinder />
        <QuoteForm />
        <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ccc' }} />
        <GuideForm />
        <StatusPanel guides={guides} />
        <GuideList onVerHistorial={(g) => { setSelectedGuide(g); setShowModal(true); }} />
      </main>

      {showModal && selectedGuide && (
        <div className="modal" id="modal-historial" style={{ display: 'block', position: 'fixed', background: 'rgba(0,0,0,0.5)', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }}>
          <div className="modal__contenido" style={{ background: 'white', margin: '15% auto', padding: '20px', width: '50%', color: '#333' }}>
            <button className="modal__cerrar" id="cerrar-historial" onClick={() => setShowModal(false)}>X</button>
            <h2 className="modal__titulo">Historial de la guía: {selectedGuide.numero}</h2>
            <div className="modal__historial" id="historial-guia">
              {selectedGuide.historial.map((h, i) => (
                <p key={i}>Estado: {h.estado} - Fecha: {h.fecha}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;