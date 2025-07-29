import { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebase/config";

type Trabajador = {
  nombre: string;
};

const TablaTrabajadores = () => {
  const [trabajadores, setTrabajadores] = useState<{ [id: string]: Trabajador }>({});

  useEffect(() => {
    const trabajadoresRef = ref(db, "trabajadores");
    onValue(trabajadoresRef, (snapshot) => {
      setTrabajadores(snapshot.val() || {});
    });
  }, []);

  return (
    <table style={{ width: "100%", marginTop: "2rem", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>🧑 Trabajador</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(trabajadores).map(([id, t]) => (
          <tr key={id}>
            <td>{t.nombre}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaTrabajadores;