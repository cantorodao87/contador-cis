import { useEffect, useState } from "react";
import { onValue, ref, remove } from "firebase/database";
import { db } from "../firebase/config";
import { GestionTrabajadores } from "../components/GestionTrabajadores";
import type { Trabajador } from "../types/modelos";

type Props = {
  esAdmin: boolean;
};

const Gestion: React.FC<Props> = ({ esAdmin }) => {
  const [status, setStatus] = useState<string>("");

  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);

  useEffect(() => {
    const trabajadoresRef = ref(db, "trabajadores");
    const unsub = onValue(trabajadoresRef, (snapshot) => {
      const data = snapshot.val() || {};
      const listado: Trabajador[] = Object.entries(data).map(([id, t]: any) => ({
        id,
        nombre: t.nombre,
      }));
      setTrabajadores(listado);
    });

    return () => unsub();
  }, []);

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
        <div className="p-6 space-y-8">
          <h1 className="text-2xl font-bold">🛠 Gestión</h1>

          <div className="border rounded p-4 bg-gray-50 space-y-6">
          <h2 className="text-lg font-semibold">🧼 Reset</h2>

          <p>Elimina todas las reservas y peticiones registradas. Úsalo con precaución.</p>
          
          
          <button
            onClick={resetearDatos}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Ejecutar reset
          </button>
          {status && <p style={{ marginTop: "1rem" }}>{status}</p>}

          </div>

          <GestionTrabajadores trabajadores={trabajadores} />
        </div>
      )}

      <></>

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