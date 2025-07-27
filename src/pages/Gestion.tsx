import React, { useEffect, useState } from "react";
import FichaTrabajador from "../components/FichaTrabajador";
import { db, ref, onValue, push } from "../firebase/config";

type Trabajador = {
  nombre: string;
};

type Reserva = {
  fecha: string;
  trabajador: string;
};

type Peticion = {
  fecha: string;
  de: string;
  para: string;
};

const Gestion: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<{ [id: string]: Trabajador }>({});
  const [reservas, setReservas] = useState<{ [id: string]: Reserva }>({});
  const [peticiones, setPeticiones] = useState<{ [id: string]: Peticion }>({});

  useEffect(() => {
    onValue(ref(db, "trabajadores"), snap => setTrabajadores(snap.val() || {}));
    onValue(ref(db, "reservas"), snap => setReservas(snap.val() || {}));
    onValue(ref(db, "peticiones"), snap => setPeticiones(snap.val() || {}));
  }, []);

  const agregarReserva = (trabajadorId: string, fecha: string) => {
    push(ref(db, "reservas"), { fecha, trabajador: trabajadorId });
  };

  const agregarPeticion = (peticionarioId: string, ayudanteId: string, fecha: string) => {
    push(ref(db, "peticiones"), { fecha, de: peticionarioId, para: ayudanteId });
  };

  const listaTrabajadores = Object.entries(trabajadores).map(([id, t]) => ({
    id,
    nombre: t.nombre
  }));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: "2rem" }}>
      {Object.entries(trabajadores).map(([id, t]) => {
        const reservasDel = Object.entries(reservas)
          .filter(([, r]) => r.trabajador === id)
          .map(([, r]) => r);

        const peticionesDel = Object.entries(peticiones)
          .filter(([, p]) => p.de === id || p.para === id)
          .map(([, p]) => ({
            ...p,
            de: Object.entries(trabajadores).find(([tid]) => tid === p.de)?.[1].nombre || p.de,
            para: Object.entries(trabajadores).find(([tid]) => tid === p.para)?.[1].nombre || p.para
          }));

        return (
          <FichaTrabajador
            key={id}
            nombre={t.nombre}
            reservas={reservasDel}
            peticiones={peticionesDel}
            listaTrabajadores={listaTrabajadores}
            onNuevaReserva={(fecha) => agregarReserva(id, fecha)}
            onNuevaPeticion={(ayudanteId, fecha) => agregarPeticion(id, ayudanteId, fecha)}
          />
        );
      })}
    </div>
  );
};

export default Gestion;