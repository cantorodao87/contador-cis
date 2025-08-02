import { useState } from "react";
import { db, ref, remove } from "../firebase/config";

type Props = {
  esAdmin: boolean;
};

const Gestion: React.FC<Props> = ({ esAdmin }) => {
  const [status, setStatus] = useState<string>("");

  const resetearDatos = async () => {
    const confirmar = window.confirm("⚠️ Esto eliminará TODAS las reservas y peticiones. ¿Estás seguro?");
    if (!confirmar) return;

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
    <>
      {/* Bloque condicional solo si es admin */}
      {esAdmin && (
        <div style={{ padding: "2rem" }}>
          <h2>🧼 Reset</h2>
          <p>Elimina todas las reservas y peticiones registradas. Úsalo con precaución.</p>
          <button
            onClick={resetearDatos}
            style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
          >
            Ejecutar reset
          </button>
          {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
        </div>
      )}

      {/* Bloque adicional que no depende de esAdmin */}
      <div style={{ padding: "2rem", marginTop: "2rem", background: "#f9f9f9" }}>
        <h2>📘 Otras funcionalidades</h2>
        <p>Este será un contenedor para otras secciones que no dependen del rol de administrador.</p>
        <p style={{ fontStyle: "italic", color: "#666" }}>Dummy content por ahora…</p>
      </div>
    </>
  );

  
};

export default Gestion;