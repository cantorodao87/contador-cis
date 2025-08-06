import { ref, update, remove, get } from "firebase/database";
import React, { useState } from "react";
import { db } from "../firebase/config";
import type { Trabajador } from "../types/modelos";

interface Props {
  trabajadores: Trabajador[];
}

export const GestionTrabajadores: React.FC<Props> = ({ trabajadores }) => {
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [candidatoId, setCandidatoId] = useState<string | null>(null);

  const coincidencias = trabajadores.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const generarId = () => {
    const idsNum = trabajadores.map(t => parseInt(t.id.split("_")[1], 10));
    const max = Math.max(...idsNum);
    return `trabajador_${String(max + 1).padStart(2, "0")}`;
  };

  const añadirTrabajador = () => {
    if (!nuevoNombre.trim()) return alert("⚠️ Nombre vacío.");
    const confirmar = window.confirm(`¿Añadir trabajador "${nuevoNombre}"?`);
    if (!confirmar) return;

    const nuevoId = generarId();
    update(ref(db, `trabajadores/${nuevoId}`), { nombre: nuevoNombre });
    setNuevoNombre("");
    alert(`✅ Añadido: ${nuevoNombre}`);
  };

  const borrarTrabajador = async () => {
    if (!candidatoId) return;
    const nombre = trabajadores.find(t => t.id === candidatoId)?.nombre;
    const confirmar = window.confirm(
      `¿Eliminar a ${nombre} y todas sus reservas y peticiones asociadas?`
    );
    if (!confirmar) return;

    // 1. Eliminar trabajador
    await remove(ref(db, `trabajadores/${candidatoId}`));

    // 2. Borrar reservas asociadas
    const reservasSnap = await get(ref(db, "reservas"));
    const reservas = reservasSnap.val() || {};
    Object.entries(reservas).forEach(([rid, r]: any) => {
      if (r.trabajador === candidatoId) {
        remove(ref(db, `reservas/${rid}`));
      }
    });

    // 3. Borrar peticiones asociadas
    const peticionesSnap = await get(ref(db, "peticiones"));
    const peticiones = peticionesSnap.val() || {};
    Object.entries(peticiones).forEach(([pid, p]: any) => {
      if (p.de === candidatoId || p.para === candidatoId) {
        remove(ref(db, `peticiones/${pid}`));
      }
    });

    setBusqueda("");
    setCandidatoId(null);
    alert(`🗑️ Trabajador ${nombre} eliminado`);
  };

  return (
    <div className="border rounded p-4 bg-gray-50 space-y-6">
      <h2 className="text-lg font-semibold">Gestión de trabajadores</h2>

      {/* Añadir trabajador */}
      <div className="space-y-2">
        <p className="font-medium">➕ Añadir trabajador</p>
        <input
          type="text"
          value={nuevoNombre}
          onChange={e => setNuevoNombre(e.target.value)}
          placeholder="Nombre del nuevo trabajador"
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={añadirTrabajador}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Añadir
        </button>
      </div>

      {/* Borrar trabajador */}
      <div className="space-y-2 mt-6">
        <p className="font-medium">🗑️ Borrar trabajador</p>
        <input
          type="text"
          value={busqueda}
          onChange={e => {
            setBusqueda(e.target.value);
            const match = trabajadores.find(t =>
              t.nombre.toLowerCase() === e.target.value.toLowerCase()
            );
            setCandidatoId(match?.id || null);
          }}
          placeholder="Buscar por nombre"
          className="border rounded px-2 py-1 w-full"
        />
        <ul className="text-sm text-gray-600">
          {coincidencias.map(t => (
            <li
              key={t.id}
              className="cursor-pointer hover:text-black"
              onClick={() => {
                setBusqueda(t.nombre);
                setCandidatoId(t.id);
              }}
            >
              {t.nombre}
            </li>
          ))}
        </ul>
        <button
          disabled={!candidatoId}
          onClick={borrarTrabajador}
          className={`px-4 py-2 rounded ${
            candidatoId
              ? "bg-red-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};