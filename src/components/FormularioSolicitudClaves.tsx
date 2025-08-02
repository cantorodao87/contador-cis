import React from "react";

interface Props {
  nuevoDe: string;
  setNuevoDe: (value: string) => void;
  nuevaFecha: string;
  setNuevaFecha: (value: string) => void;
  nuevaClave: string;
  setNuevaClave: (value: string) => void;
  permuta: boolean;
  setPermuta: (value: boolean) => void;
  enviarPeticion: () => void;
  trabajadores: { id: string; nombre: string }[];
}

export const FormularioSolicitudClaves: React.FC<Props> = ({
  nuevoDe,
  setNuevoDe,
  nuevaFecha,
  setNuevaFecha,
  nuevaClave,
  setNuevaClave,
  permuta,
  setPermuta,
  enviarPeticion,
  trabajadores,
}) => (
  <div className="mb-8 border rounded p-4 bg-gray-50">
    <h3 className="text-lg font-semibold mb-4">Solicitud de claves</h3>
    <div className="flex flex-col gap-2 text-sm">
      <label>
        Trabajador solicitante:
        <select
          className="border rounded px-2 py-1 w-full"
          value={nuevoDe}
          onChange={(e) => setNuevoDe(e.target.value)}
        >
          <option value="">Selecciona</option>
          {trabajadores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Fecha:
        <input
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={nuevaFecha}
          onChange={(e) => setNuevaFecha(e.target.value)}
        />
      </label>

      <label>
        Clave (código del turno):
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={nuevaClave}
          onChange={(e) => setNuevaClave(e.target.value)}
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={permuta}
          onChange={(e) => setPermuta(e.target.checked)}
        />
        Acepto permuta
      </label>

      <button
        onClick={enviarPeticion}
        className="bg-blue-600 text-white px-4 py-2 rounded w-fit mt-2"
      >
        Guardar petición
      </button>
    </div>
  </div>
);