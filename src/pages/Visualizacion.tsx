import React, { useEffect, useState } from "react";
import { db, ref, onValue, remove } from "../firebase/config";

type Favor = {
  trabajador: string;
  fecha: string;
  tipo: "+1" | "-1";
};

type Trabajador = {
  nombre: string;
  reservas?: { [id: string]: string };
  favores?: { [id: string]: Favor };
};

const Visualizacion: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<{ [id: string]: Trabajador }>({});
  const [desplegarReservas, setDesplegarReservas] = useState<string | null>(null);
  const [desplegarFavores, setDesplegarFavores] = useState<string | null>(null);

  useEffect(() => {
    const trabajadoresRef = ref(db, "trabajadores");
    onValue(trabajadoresRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTrabajadores(data);
    });
  }, []);

  const borrarFavor = (idTrabajador: string, idFavor: string) => {
    remove(ref(db, `trabajadores/${idTrabajador}/favores/${idFavor}`));
  };

  const borrarReserva = (idTrabajador: string, idReserva: string) => {
    remove(ref(db, `trabajadores/${idTrabajador}/reservas/${idReserva}`));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Visualización de trabajadores</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Favores</th>
            <th>Reservas</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(trabajadores).map(([id, t]) => {
            const favoresList = Object.entries(t.favores || {});
            const reservasList = Object.entries(t.reservas || {});
            const totalFavores = favoresList.reduce((acc, [, f]) => acc + (f.tipo === "+1" ? 1 : -1), 0);

            return (
              <React.Fragment key={id}>
                <tr>
                  <td>{t.nombre}</td>
                  <td>
                    {totalFavores}
                    <button onClick={() =>
                      setDesplegarFavores(desplegarFavores === id ? null : id)
                    }>
                      {desplegarFavores === id ? "−" : "+"}
                    </button>
                  </td>
                  <td>
                    {reservasList.length}
                    <button onClick={() =>
                      setDesplegarReservas(desplegarReservas === id ? null : id)
                    }>
                      {desplegarReservas === id ? "−" : "+"}
                    </button>
                  </td>
                </tr>

                {desplegarFavores === id && (
                  <tr>
                    <td colSpan={3}>
                      <strong>🤝 Favores:</strong>
                      <ul>
                        {favoresList.map(([fid, f]) => (
                          <li key={fid}>
                            {f.fecha} → {trabajadores[f.trabajador]?.nombre || f.trabajador} ({f.tipo})
                            <button
                              onClick={() => borrarFavor(id, fid)}
                              style={{ marginLeft: "0.5rem", color: "red" }}
                            >
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}

                {desplegarReservas === id && (
                  <tr>
                    <td colSpan={3}>
                      <strong>🗓️ Reservas:</strong>
                      <ul>
                        {reservasList.map(([rid, fecha]) => (
                          <li key={rid}>
                            {fecha}
                            <button
                              onClick={() => borrarReserva(id, rid)}
                              style={{ marginLeft: "0.5rem", color: "red" }}
                            >
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Visualizacion;