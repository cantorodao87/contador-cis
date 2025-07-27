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
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      width: "300px"
    }}>
      <h3>{nombre}</h3>

      <p>🗓️ Reservas: {reservas.length}</p>
      <p>🤝 Peticiones (saldo): {saldo}</p>

      <button onClick={() => setMostrarReserva(prev => !prev)} style={{ marginBottom: "0.5rem" }}>
        {mostrarReserva ? "Ocultar Reserva" : "Añadir Reserva 📅"}
      </button>

      {mostrarReserva && (
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="date"
            value={fechaReserva}
            onChange={e => setFechaReserva(e.target.value)}
          />
          <button
            onClick={() => {
              if (fechaReserva) {
                onNuevaReserva(fechaReserva);
                setFechaReserva("");
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Guardar
          </button>
        </div>
      )}

      <button onClick={() => setMostrarPeticion(prev => !prev)}>
        {mostrarPeticion ? "Ocultar Petición" : "Pedir Ayuda 🤝"}
      </button>

      {mostrarPeticion && (
        <div style={{ marginTop: "0.5rem" }}>
          <select
            value={ayudanteId}
            onChange={e => setAyudanteId(e.target.value)}
          >
            <option value="">-- Selecciona compañero --</option>
            {trabajadoresSinYo.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <input
            type="date"
            value={fechaPeticion}
            onChange={e => setFechaPeticion(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
          <button
            onClick={() => {
              if (fechaPeticion && ayudanteId) {
                onNuevaPeticion(ayudanteId, fechaPeticion);
                setFechaPeticion("");
                setAyudanteId("");
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Registrar
          </button>
        </div>
      )}
    </div>
  );
};

export default FichaTrabajador;