import React from "react";

interface Props {
  ocultarAceptadas: boolean;
  setOcultarAceptadas: (v: boolean) => void;
  ocultarAntiguas: boolean;
  setOcultarAntiguas: (v: boolean) => void;
}

export const FiltrosListaDePeticiones: React.FC<Props> = ({
  ocultarAceptadas,
  setOcultarAceptadas,
  ocultarAntiguas,
  setOcultarAntiguas
}) => (
  <div className="flex justify-end space-x-4 mb-4">
    <label className="text-sm italic text-gray-600 bg-gray-100 px-3 py-1 rounded shadow-sm">
      <input
        type="checkbox"
        checked={ocultarAceptadas}
        onChange={(e) => setOcultarAceptadas(e.target.checked)}
        className="mr-2 accent-gray-500"
      />
      Ocultar aceptadas
    </label>
    <label className="text-sm italic text-gray-600 bg-gray-100 px-3 py-1 rounded shadow-sm">
      <input
        type="checkbox"
        checked={ocultarAntiguas}
        onChange={(e) => setOcultarAntiguas(e.target.checked)}
        className="mr-2 accent-gray-500"
      />
      Ocultar antiguas
    </label>
  </div>
);