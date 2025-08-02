import React from "react";
import type { Trabajador, Peticion } from "../types/modelos";

interface Props {
  pid: string;
  peticion: Peticion;
  trabajadores: Trabajador[];
  nombrePorId: (id: string) => string;
  seleccionPara: string;
  setSeleccionPara: (id: string) => void;
  nuevaFecha: string;
  setNuevaFecha: (value: string) => void;
  clavePermuta: string;
  setClavePermuta: (value: string) => void;
  aceptarPeticion: (pid: string, tipo: "sin-permuta" | "con-permuta") => void;
}

export const PeticionItem: React.FC<Props> = ({
  pid,
  peticion: p,
  trabajadores,
  nombrePorId,
  seleccionPara,
  setSeleccionPara,
  nuevaFecha,
  setNuevaFecha,
  clavePermuta,
  setClavePermuta,
  aceptarPeticion,
}) => (
  <li className={`border rounded p-3 shadow-sm text-sm ${p.para ? "border-green-400 bg-green-50" : "bg-white"}`}>
    <p><strong>{nombrePorId(p.de)}</strong> solicita el <strong>{p.fecha}</strong></p>
    <p>Clave: {p.clave} {p.permuta && <span className="text-yellow-600 ml-2">(Acepta permuta)</span>}</p>

    {p.para ? (
      <p className="mt-2 text-green-700">✅ Aceptada por {nombrePorId(p.para)}</p>
    ) : (
      <div className="mt-3 flex flex-col gap-3">
        {p.permuta ? (
          <>
            <details>
              <summary className="cursor-pointer text-green-700 font-semibold">👉 Aceptar sin permuta</summary>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <select className="border rounded px-2 py-1 w-full" value={seleccionPara} onChange={(e) => setSeleccionPara(e.target.value)}>
                  <option value="">Selecciona compañero</option>
                  {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
                <button onClick={() => aceptarPeticion(pid, "sin-permuta")} className="bg-green-600 text-white px-3 py-1 rounded">
                  Confirmar sin permuta
                </button>
              </div>
            </details>

            <details>
              <summary className="cursor-pointer text-purple-700 font-semibold">🔁 Aceptar con permuta</summary>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <select className="border rounded px-2 py-1 w-full" value={seleccionPara} onChange={(e) => setSeleccionPara(e.target.value)}>
                  <option value="">Selecciona compañero</option>
                  {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
                <input type="date" className="border rounded px-2 py-1 w-full" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />
                <input type="text" placeholder="Clave de devolución" className="border rounded px-2 py-1 w-full" value={clavePermuta} onChange={(e) => setClavePermuta(e.target.value)} />
                <button onClick={() => aceptarPeticion(pid, "con-permuta")} className="bg-purple-700 text-white px-3 py-1 rounded">
                  Confirmar permuta
                </button>
              </div>
            </details>
          </>
        ) : (
          <details>
            <summary className="cursor-pointer text-blue-600 font-semibold">✅ Aceptar petición</summary>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <select className="border rounded px-2 py-1 w-full" value={seleccionPara} onChange={(e) => setSeleccionPara(e.target.value)}>
                <option value="">Selecciona compañero</option>
                {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <button onClick={() => aceptarPeticion(pid, "sin-permuta")} className="bg-green-600 text-white px-3 py-1 rounded">
                Confirmar
              </button>
            </div>
          </details>
        )}
      </div>
    )}
  </li>
);