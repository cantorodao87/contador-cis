import { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../firebase/config";

const Reset = () => {
  const [status, setStatus] = useState<string>("");

  const resetearDatos = async () => {
    try {
      setStatus("Reseteando datos...");
      const ruta = ref(db, "trabajadores");
      const actualizacion: any = {};

      for (let i = 1; i <= 14; i++) {
        actualizacion[`${i}/reservas`] = {};
        actualizacion[`${i}/favores`] = {};
      }

      await update(ruta, actualizacion);
      setStatus("✅ Datos reseteados correctamente.");
    } catch (error: any) {
      console.error(error);
      setStatus("❌ Error al resetear datos.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔁 Reset de datos</h2>
      <p>Esta página elimina todas las reservas y favores de los trabajadores. Solo debe usarse con permiso.</p>
      <button onClick={resetearDatos} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
        Ejecutar reset
      </button>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
};

export default Reset;