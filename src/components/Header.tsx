import React from 'react';
import houndLogo from '../M6 - imagotipo-Hound_Express/logo-Hound_Express-bg-white.png';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <a className="header__logo" href="/">
        <img src={houndLogo} alt="Logo de Hound Express" />
      </a>
      <h1 className="header__titulo">Gestión de Guías</h1>
      <nav aria-label="Navegación principal">
        <a className="header__link" href="/">Página principal</a>
      </nav>
    </header>
  );
};