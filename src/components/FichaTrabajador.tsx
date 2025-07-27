import React, { useState } from "react";

type Reserva = {
  fecha: string;
  trabajador: string;
};

type Peticion = {
  fecha: string;
  de: string;
  para: string;
};

type Props = {
  nombre: string;
  listaTrabajadores: { id: string; nombre: string }[];
  reservas: Reserva[];
  peticiones: Peticion[];
  onNuevaReserva: (fecha: string) => void;
  onNuevaPeticion: (ayudanteId: string, fecha: string) => void;
};

const FichaTrabajador: React.FC<Props> = ({
  nombre,
  listaTrabajadores,
  reservas,
  peticiones,
  onNuevaReserva,
  onNuevaPeticion
}) => {
  const [fechaReserva, setFechaReserva] = useState("");
  const [fechaPeticion, setFechaPeticion] = useState("");
  const [ayudanteId, setAyudanteId] = useState("");
  const [mostrarReserva, setMostrarReserva] = useState(false);
  const [mostrarPeticion, setMostrarPeticion] = useState(false);

  const trabajadoresSinYo = listaTrabajadores.filter(t => t.nombre !== nombre);
  const peticionesHechas = peticiones.filter(p => p.de === nombre);
  const peticionesRecibidas = peticiones.filter(p => p.para === nombre);
  const saldo = peticionesRecibidas.length - peticionesHechas.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-[300px]">
      <h3 className="text-xl font-semibold mb-2">{nombre}</h3>

      <div className="text-sm text-gray-700 mb-3">
        <p>🗓️ <strong>Reservas:</strong> {reservas.length}</p>
        <p>🤝 <strong>Peticiones (saldo):</strong> {saldo}</p>
      </div>

      {/* Reserva */}
      <button
        className="bg-blue-100 hover:bg-blue-200 text-sm px-3 py-1 rounded mb-2"
        onClick={() => setMostrarReserva(prev => !prev)}
      >
        {mostrarReserva ? "− Ocultar reserva" : "+ Añadir reserva"}
      </button>

      {mostrarReserva && (
        <div className="mb-3 flex flex-col gap-2 text-sm">
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={fechaReserva}
            onChange={(e) => setFechaReserva(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => {
              if (fechaReserva) {
                const confirmar = window.confirm(`¿Confirmas añadir una reserva el ${fechaReserva} para ${nombre}?`);
                if (confirmar) {
                  onNuevaReserva(fechaReserva);
                  setFechaReserva("");
                }
              }
            }}
          >
            Guardar reserva
          </button>
        </div>
      )}

      {/* Petición */}
      <button
        className="bg-yellow-100 hover:bg-yellow-200 text-sm px-3 py-1 rounded mb-2"
        onClick={() => setMostrarPeticion(prev => !prev)}
      >
        {mostrarPeticion ? "− Ocultar petición" : "+ Pedir ayuda"}
      </button>

      {mostrarPeticion && (
        <div className="flex flex-col gap-2 text-sm">
          <select
            className="border rounded px-2 py-1"
            value={ayudanteId}
            onChange={(e) => setAyudanteId(e.target.value)}
          >
            <option value="">Selecciona compañero</option>
            {trabajadoresSinYo.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={fechaPeticion}
            onChange={(e) => setFechaPeticion(e.target.value)}
          />
          <button
            className="bg-orange-500 text-white px-3 py-1 rounded"
            onClick={() => {
              if (fechaPeticion && ayudanteId) {
                const compañeroNombre = listaTrabajadores.find(t => t.id === ayudanteId)?.nombre || ayudanteId;
                const confirmar = window.confirm(`¿Confirmas que ${nombre} solicita ayuda a ${compañeroNombre} el ${fechaPeticion}?`);
                if (confirmar) {
                  onNuevaPeticion(ayudanteId, fechaPeticion);
                  setFechaPeticion("");
                  setAyudanteId("");
                }
              }
            }}
          >
            Registrar petición
          </button>
        </div>
      )}
    </div>
  );
};

export default FichaTrabajador