// ListaDePeticiones.tsx

import React from "react";
import { PeticionItem } from "../components/PeticionItem";
import type { Trabajador, Peticion } from "../types/modelos";

interface Props {
  peticionesOrdenadas: [string, Peticion][];
  trabajadores: Trabajador[];
  nombrePorId: (id: string) => string;
  seleccionPara: string;
  setSeleccionPara: (id: string) => void;
  nuevaFecha: string;
  setNuevaFecha: (value: string) => void;
  clavePermuta: string;
  setClavePermuta: (value: string) => void;
  aceptarPeticion: (pid: string, tipo: "sin-permuta" | "con-permuta") => void;
  ocultarAceptadas: boolean;
  ocultarAntiguas: boolean;
}

export const ListaDePeticiones: React.FC<Props> = ({
  peticionesOrdenadas,
  trabajadores,
  nombrePorId,
  seleccionPara,
  setSeleccionPara,
  nuevaFecha,
  setNuevaFecha,
  clavePermuta,
  setClavePermuta,
  aceptarPeticion,
  ocultarAceptadas,
  ocultarAntiguas,
}) => {


    const hoy = new Date().toISOString().split("T")[0];

    const peticionesFiltradas = peticionesOrdenadas
    .filter(([, p]) => !ocultarAceptadas || !p.para)
    .filter(([, p]) => !ocultarAntiguas || p.fecha >= hoy);

  return (
    <ul className="space-y-4">
      {peticionesFiltradas.map(([pid, p]) => (
        <PeticionItem
          key={pid}
          pid={pid}
          peticion={p}
          trabajadores={trabajadores}
          nombrePorId={nombrePorId}
          seleccionPara={seleccionPara}
          setSeleccionPara={setSeleccionPara}
          nuevaFecha={nuevaFecha}
          setNuevaFecha={setNuevaFecha}
          clavePermuta={clavePermuta}
          setClavePermuta={setClavePermuta}
          aceptarPeticion={aceptarPeticion}
        />
      ))}
    </ul>
  );
};