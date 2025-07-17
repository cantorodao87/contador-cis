import React, { useEffect, useState } from "react";
import FichaTrabajador from "../components/FichaTrabajador";
import { db, ref, onValue, update, push } from "../firebase/config";

type Favor = {
  trabajador: string;
  fecha: string;
  tipo: "+1" | "-1";
};

type Trabajador = {
  nombre: string;
  reservas: string[];
  favores: Favor[];
};

const Gestion: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<{ [id: string]: Trabajador }>({});

  useEffect(() => {
    const trabajadoresRef = ref(db, "trabajadores");
    onValue(trabajadoresRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTrabajadores(data);
    });
  }, []);

  const agregarReserva = (id: string, fecha: string) => {
    const reservasRef = ref(db, `trabajadores/${id}/reservas`);
    push(reservasRef, fecha); // Firebase creará una clave única
  };

  const agregarFavor = (id: string, favor: Favor) => {
    const favoresRef = ref(db, `trabajadores/${id}/favores`);
    push(favoresRef, favor);
  };

  return (
    <div>
      <h2>Gestión de trabajadores</h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "flex-start"
      }}>
      {Object.entries(trabajadores).map(([id, t]) => (

        
        <FichaTrabajador
          key={id}
          nombre={t.nombre}
          listaTrabajadores={Object.entries(trabajadores).map(([id, t]) => ({
            id,
            nombre: t.nombre
          }))}
          reservas={t.reservas || []}
          favores={t.favores ? Object.values(t.favores) : []}
          onNuevaReserva={(fecha) => agregarReserva(id, fecha)}
          onNuevoFavor={(favor) => agregarFavor(id, favor)}
        />
      ))}
      </div>
    </div>
  );
};

export default Gestion;