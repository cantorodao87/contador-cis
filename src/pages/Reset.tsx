import { useState } from "react";
import { db, ref, remove } from "../firebase/config";

const Reset = () => {
  const [status, setStatus] = useState<string>("");

  const resetearDatos = async () => {
    try {
      setStatus("⏳ Reseteando...");
      await Promise.all([
        remove(ref(db, "reservas")),
        remove(ref(db, "peticiones"))
      ]);
      setStatus("✅ Datos reseteados con éxito.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error al resetear.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🧼 Reset</h2>
      <p>Elimina todas las reservas y peticiones registradas. Úsalo con precaución.</p>
      <button onClick={resetearDatos} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
        Ejecutar reset
      </button>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
};

export default Reset;