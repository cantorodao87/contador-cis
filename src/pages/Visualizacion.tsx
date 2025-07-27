import React, { useEffect, useState } from "react";
import { db, ref, onValue, remove } from "../firebase/config";

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

const Visualizacion: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<{ [id: string]: Trabajador }>({});
  const [reservas, setReservas] = useState<{ [id: string]: Reserva }>({});
  const [peticiones, setPeticiones] = useState<{ [id: string]: Peticion }>({});
  const [expandir, setExpandir] = useState<string | null>(null);

  useEffect(() => {
    onValue(ref(db, "trabajadores"), snap => setTrabajadores(snap.val() || {}));
    onValue(ref(db, "reservas"), snap => setReservas(snap.val() || {}));
    onValue(ref(db, "peticiones"), snap => setPeticiones(snap.val() || {}));
  }, []);

  const eliminarReserva = (id: string) => remove(ref(db, `reservas/${id}`));
  const eliminarPeticion = (id: string) => remove(ref(db, `peticiones/${id}`));

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Visualización</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Peticiones (saldo)</th>
            <th>Reservas</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(trabajadores).map(([id, t]) => {
            const reservasDel = Object.entries(reservas).filter(([, r]) => r.trabajador === id);
            const peticionesHechas = Object.entries(peticiones).filter(([, p]) => p.de === id);
            const peticionesRecibidas = Object.entries(peticiones).filter(([, p]) => p.para === id);
            const saldo = peticionesRecibidas.length - peticionesHechas.length;

            return (
              <React.Fragment key={id}>
                <tr>
                  <td>{t.nombre}</td>
                  <td>
                    {saldo}
                    <button onClick={() => setExpandir(expandir === `p-${id}` ? null : `p-${id}`)}>
                      {expandir === `p-${id}` ? "−" : "+"}
                    </button>
                  </td>
                  <td>
                    {reservasDel.length}
                    <button onClick={() => setExpandir(expandir === `r-${id}` ? null : `r-${id}`)}>
                      {expandir === `r-${id}` ? "−" : "+"}
                    </button>
                  </td>
                </tr>

                {expandir === `p-${id}` && (
                  <tr>
                    <td colSpan={3}>
                      <strong>🤝 Peticiones:</strong>
                      <ul>
                        {[...peticionesHechas, ...peticionesRecibidas].map(([pid, p]) => (
                          (p.de === id || p.para === id) && (
                            <li key={pid}>
                              {p.fecha} → {p.de === id ? "Solicitó a " : "Ayudó a "}
                              {trabajadores[p.de === id ? p.para : p.de]?.nombre || "?"}
                              <button onClick={() => eliminarPeticion(pid)} style={{ marginLeft: "0.5rem" }}>❌</button>
                            </li>
                          )
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}

                {expandir === `r-${id}` && (
                  <tr>
                    <td colSpan={3}>
                      <strong>🗓️ Reservas:</strong>
                      <ul>
                        {reservasDel.map(([rid, r]) => (
                          <li key={rid}>
                            {r.fecha}
                            <button onClick={() => eliminarReserva(rid)} style={{ marginLeft: "0.5rem" }}>❌</button>
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