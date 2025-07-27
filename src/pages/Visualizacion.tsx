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

  const eliminarReserva = (id: string) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres borrar esta reserva?");
    if (confirmar) remove(ref(db, `reservas/${id}`));
  };

  const eliminarPeticion = (id: string) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar esta petición?");
    if (confirmar) remove(ref(db, `peticiones/${id}`));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Visualización</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm">
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Peticiones (saldo)</th>
            <th className="py-2 px-4 border">Reservas</th>
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
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{t.nombre}</td>
                  <td className="py-2 px-4 border">
                    {saldo}
                    <button className="ml-2 text-blue-600" onClick={() => setExpandir(expandir === `p-${id}` ? null : `p-${id}`)}>
                      {expandir === `p-${id}` ? "−" : "+"}
                    </button>
                  </td>
                  <td className="py-2 px-4 border">
                    {reservasDel.length}
                    <button className="ml-2 text-blue-600" onClick={() => setExpandir(expandir === `r-${id}` ? null : `r-${id}`)}>
                      {expandir === `r-${id}` ? "−" : "+"}
                    </button>
                  </td>
                </tr>

                {expandir === `p-${id}` && (
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="py-2 px-4 border">
                      <strong>🤝 Peticiones:</strong>
                      <ul className="list-disc ml-4 text-sm text-gray-700">
                        {[...peticionesHechas, ...peticionesRecibidas].map(([pid, p]) => (
                          (p.de === id || p.para === id) && (
                            <li key={pid}>
                              {p.fecha} → {p.de === id ? "Solicitó a " : "Ayudó a "}
                              {trabajadores[p.de === id ? p.para : p.de]?.nombre || "?"}
                              <button
                                className="ml-2 text-red-500" 
                                onClick={() => eliminarPeticion(pid)} style={{ marginLeft: "0.5rem" }}>❌</button>
                            </li>
                          )
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}

                {expandir === `r-${id}` && (
                  <tr>
                    <td colSpan={3} className="py-2 px-4 border">
                      <strong>🗓️ Reservas:</strong>
                      <ul className="list-disc ml-4 text-sm text-gray-700">
                        {reservasDel.map(([rid, r]) => (
                          <li key={rid}>
                            {r.fecha}
                            <button
                              className="ml-2 text-red-500"
                              onClick={() => eliminarReserva(rid)} style={{ marginLeft: "0.5rem" }}>❌</button>
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