import React, { useState } from "react";

type Favor = {
  trabajador: string;
  fecha: string;
  tipo: "+1" | "-1";
};

type FichaProps = {
  nombre: string;
  reservas: string[];
  favores: Favor[];
  onNuevaReserva?: (fecha: string) => void;
  onNuevoFavor?: (favor: Favor) => void;
};

const FichaTrabajador: React.FC<FichaProps> = ({
  nombre,
  reservas,
  favores,
  onNuevaReserva,
  onNuevoFavor
}) => {
  const [fechaReserva, setFechaReserva] = useState("");
  const [favorFecha, setFavorFecha] = useState("");
  const [favorTrabajador, setFavorTrabajador] = useState("");

  const handleAgregarReserva = () => {
    if (fechaReserva) {
      onNuevaReserva?.(fechaReserva);
      setFechaReserva("");
    }
  };

  const handleAgregarFavor = () => {
    if (favorFecha && favorTrabajador) {
      const nuevoFavor: Favor = {
        fecha: favorFecha,
        trabajador: favorTrabajador,
        tipo: "+1"
      };
      onNuevoFavor?.(nuevoFavor);
      setFavorFecha("");
      setFavorTrabajador("");
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{nombre}</h3>

      <p><strong>Reservas:</strong> {reservas.length}</p>
      <input
        type="date"
        value={fechaReserva}
        onChange={(e) => setFechaReserva(e.target.value)}
      />
      <button onClick={handleAgregarReserva}>Añadir reserva</button>

      <p><strong>Favores hechos:</strong> {
        favores.filter(f => f.tipo === "+1").length
      }</p>
      <input
        type="date"
        value={favorFecha}
        onChange={(e) => setFavorFecha(e.target.value)}
        placeholder="Fecha"
      />
      <input
        type="text"
        value={favorTrabajador}
        onChange={(e) => setFavorTrabajador(e.target.value)}
        placeholder="ID del trabajador"
      />
      <button onClick={handleAgregarFavor}>Añadir favor</button>
    </div>
  );
};

export default FichaTrabajador;