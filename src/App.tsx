import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Bolsa from './pages/Bolsa';
import Reservas from './pages/Reservas';
import Resumen from './pages/Resumen';
import Admin from './pages/Admin';
import Gestion from './pages/Gestion';
import Navegacion from "./components/Navegacion";

export default function App() {
  const [esAdmin, setEsAdmin] = useState(false);

  const [menuLateral, setMenuLateral] = useState(() => {
    const guardado = localStorage.getItem("menuLateral");
    return guardado === "true"; // superior por defecto si no hay valor
  });

  useEffect(() => {
    localStorage.setItem("menuLateral", menuLateral.toString());
  }, [menuLateral]);

  return (
    <div className={`h-screen ${menuLateral ? "flex flex-row" : "flex flex-col"}`}>
      <Navegacion esAdmin={esAdmin} menuLateral={menuLateral} />

      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Bolsa />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/resumen" element={<Resumen esAdmin={esAdmin} />} />
          <Route
            path="/admin"
            element={
              <Admin
                esAdmin={esAdmin}
                setEsAdmin={setEsAdmin}
                menuLateral={menuLateral}
                setMenuLateral={setMenuLateral}
              />
            }
          />
          <Route path="/gestion" element={<Gestion esAdmin={esAdmin} />} />
        </Routes>
      </main>
    </div>
  );
}