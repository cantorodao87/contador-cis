import { useEffect, useState } from "react";
import { db, ref, onValue, push, update } from "../firebase/config";

type Trabajador = {
  id: string;
  nombre: string;
};

type Peticion = {
  de: string;
  para: string;
  fecha: string;
  clave: string;
  permuta: boolean;
};

const Bolsa: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [peticiones, setPeticiones] = useState<{ [id: string]: Peticion }>({});

  const [nuevoDe, setNuevoDe] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [permuta, setPermuta] = useState(false);

  const [selectorActivo, setSelectorActivo] = useState<string | null>(null);
  const [seleccionPara, setSeleccionPara] = useState("");

  useEffect(() => {
    onValue(ref(db, "trabajadores"), snap => {
      const data = snap.val() || [];
      const lista = data
        .map((t: any, index: number) => t ? { id: index.toString(), nombre: t.nombre } : null)
        .filter(Boolean) as Trabajador[];
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setTrabajadores(lista);
    });

    onValue(ref(db, "peticiones"), snap => {
      setPeticiones(snap.val() || {});
    });
  }, []);

  const nombrePorId = (id: string) =>
    trabajadores.find((t) => t.id === id)?.nombre || "¿?";

  const enviarPeticion = () => {
    if (!nuevoDe || !nuevaFecha || !nuevaClave) return alert("⚠️ Completa todos los campos.");
    const confirmar = window.confirm(`¿Confirmas pedir ayuda para el ${nuevaFecha}?`);
    if (!confirmar) return;

    push(ref(db, "peticiones"), {
      de: nuevoDe,
      para: "",
      fecha: nuevaFecha,
      clave: nuevaClave,
      permuta
    });

    setNuevoDe("");
    setNuevaFecha("");
    setNuevaClave("");
    setPermuta(false);
  };

  const aceptarPeticion = (pid: string) => {
    if (!seleccionPara) return alert("⚠️ Selecciona un trabajador para asignarlo.");
    update(ref(db, `peticiones/${pid}`), { para: seleccionPara });
    setSelectorActivo(null);
    setSeleccionPara("");
  };

  const peticionesOrdenadas = Object.entries(peticiones).sort((a, b) => {
    const fechaA = new Date(a[1].fecha).getTime();
    const fechaB = new Date(b[1].fecha).getTime();
    return fechaB - fechaA; // Más recientes primero
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🎯 Bolsa de Turnos</h2>

      {/* 📤 Formulario */}
      <div className="mb-8 border rounded p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Solicitud de claves</h3>
        <div className="flex flex-col gap-2 text-sm">
          <label>
            Trabajador solicitante:
            <select className="border rounded px-2 py-1 w-full" value={nuevoDe} onChange={(e) => setNuevoDe(e.target.value)}>
              <option value="">Selecciona</option>
              {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </label>

          <label>
            Fecha:
            <input type="date" className="border rounded px-2 py-1 w-full" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />
          </label>

          <label>
            Clave (código del turno):
            <input type="text" className="border rounded px-2 py-1 w-full" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} />
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={permuta} onChange={(e) => setPermuta(e.target.checked)} />
            Acepto permuta
          </label>

          <button onClick={enviarPeticion} className="bg-blue-600 text-white px-4 py-2 rounded w-fit mt-2">
            Guardar petición
          </button>
        </div>
      </div>

      {/* 📋 Listado */}
      <h3 className="text-lg font-semibold mb-4">📌 Peticiones activas</h3>
      <ul className="space-y-4">
        {peticionesOrdenadas.map(([pid, p]) => (
          <li key={pid} className={`border rounded p-3 shadow-sm text-sm ${p.para ? "border-green-400 bg-green-50" : "bg-white"}`}>
            <p><strong>{nombrePorId(p.de)}</strong> solicita el <strong>{p.fecha}</strong></p>
            <p>Clave: {p.clave} {p.permuta && <span className="text-yellow-600 ml-2">(Acepto Permuta)</span>}</p>

            {p.para ? (
              <p className="mt-2 text-green-700">✅ Aceptada por {nombrePorId(p.para)}</p>
            ) : (
              selectorActivo === pid ? (
                <div className="mt-2 flex flex-col gap-2">
                  <select className="border rounded px-2 py-1 w-full text-sm" value={seleccionPara} onChange={(e) => setSeleccionPara(e.target.value)}>
                    <option value="">Selecciona compañero</option>
                    {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                  <button onClick={() => aceptarPeticion(pid)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Aceptar solicitud</button>
                </div>
              ) : (
                <button onClick={() => setSelectorActivo(pid)} className="mt-2 text-blue-600 text-sm">Aceptar</button>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bolsa;