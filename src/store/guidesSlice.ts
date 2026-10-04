import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Guide } from '../types/types';

interface GuidesState {
  guides: Guide[];
}

const initialState: GuidesState = {
  guides: [],
};

const guidesSlice = createSlice({
  name: 'guides',
  initialState,
  reducers: {
    addGuide: (state, action: PayloadAction<Guide>) => {
      state.guides.push(action.payload);
    },
    updateGuideStatus: (state, action: PayloadAction<string>) => {
      const guia = state.guides.find((g) => g.numero === action.payload);

      if (guia) {
        let nuevoEstado = guia.estado;
        if (guia.estado === 'Pendiente') nuevoEstado = 'En tránsito';
        else if (guia.estado === 'En tránsito') nuevoEstado = 'Entregada';

        if (nuevoEstado !== guia.estado) {
          guia.estado = nuevoEstado;
          guia.historial.push({
            estado: nuevoEstado,
            fecha: new Date().toLocaleString(),
          });
        }
      }
    },
  },
});

export const { addGuide, updateGuideStatus } = guidesSlice.actions;
export default guidesSlice.reducer;

