// src/pages/Visualizacion.tsx
import React, { useState } from "react";
import TablaTrabajadores from "../components/TablaTrabajadores";

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

const Visualizacion: React.FC = () => {
  const [trabajadores] = useState<Trabajador[]>([
    { nombre: "Ana", reservas: ["2025-07-10", "2025-07-11"], favores: [{ trabajador: "2", fecha: "2025-07-17", tipo: "+1" }] },
    { nombre: "Carlos", reservas: ["2025-07-12"], favores: [{ trabajador: "1", fecha: "2025-07-17", tipo: "-1" }] },
  ]);

  return (
    <div>
      <h2>Visualización de trabajadores</h2>
      <TablaTrabajadores trabajadores={trabajadores} />
    </div>
  );
};

export default Visualizacion;