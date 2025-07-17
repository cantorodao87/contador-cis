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
  listaTrabajadores: { id: string; nombre: string }[];
  onNuevaReserva?: (fecha: string) => void;
  onNuevoFavor?: (favor: Favor) => void;
};

const FichaTrabajador: React.FC<FichaProps> = ({
  nombre,
  reservas,
  favores,
  listaTrabajadores,
  onNuevaReserva,
  onNuevoFavor
}) => {
  const [mostrarReservasForm, setMostrarReservasForm] = useState(false);
  const [mostrarFavoresForm, setMostrarFavoresForm] = useState(false);

  const [fechaReserva, setFechaReserva] = useState("");
  const [favorFecha, setFavorFecha] = useState("");
  const [favorTrabajador, setFavorTrabajador] = useState("");

  const handleAgregarReserva = () => {
    if (fechaReserva && onNuevaReserva) {
      onNuevaReserva(fechaReserva);
      setFechaReserva("");
      setMostrarReservasForm(false);
    }
  };

  const handleAgregarFavor = () => {
    if (favorFecha && favorTrabajador && onNuevoFavor) {
      const nuevoFavor: Favor = {
        trabajador: favorTrabajador,
        fecha: favorFecha,
        tipo: "+1"
      };
      onNuevoFavor(nuevoFavor);
      setFavorFecha("");
      setFavorTrabajador("");
      setMostrarFavoresForm(false);
    }
  };

  const totalFavores = favores.reduce((acc, f) => acc + (f.tipo === "+1" ? 1 : -1), 0);

  return (
    <div style={{
      border: "2px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      width: "250px",
      backgroundColor: "#000000ff"
    }}>
      <h3 style={{ marginBottom: "0.5rem" }}>{nombre}</h3>

      <div style={{ marginBottom: "0.5rem" }}>
        🗓️ <strong>Reservas:</strong> {reservas.length}
        <button onClick={() => setMostrarReservasForm(!mostrarReservasForm)} style={{ marginLeft: "0.5rem" }}>
          {mostrarReservasForm ? "−" : "+"}
        </button>
      </div>

      {mostrarReservasForm && (
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="date"
            value={fechaReserva}
            onChange={(e) => setFechaReserva(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={handleAgregarReserva}>✔️</button>
        </div>
      )}

      <div style={{ marginBottom: "0.5rem" }}>
        🤝 <strong>Favores:</strong> {totalFavores}
        <button onClick={() => setMostrarFavoresForm(!mostrarFavoresForm)} style={{ marginLeft: "0.5rem" }}>
          {mostrarFavoresForm ? "−" : "+"}
        </button>
      </div>

      {mostrarFavoresForm && (
        <div>
          <input
            type="date"
            value={favorFecha}
            onChange={(e) => setFavorFecha(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          />
          <select
            value={favorTrabajador}
            onChange={(e) => setFavorTrabajador(e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          >
            <option value="">Selecciona compañero</option>
            {listaTrabajadores.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <button onClick={handleAgregarFavor}>✔️</button>
        </div>
      )}
    </div>
  );
};

export default FichaTrabajador;