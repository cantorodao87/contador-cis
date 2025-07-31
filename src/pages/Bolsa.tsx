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
  const [clavePermuta, setClavePermuta] = useState("");

  const [seleccionPara, setSeleccionPara] = useState("");

  const nombrePorId = (id: string) =>
    trabajadores.find((t) => t.id === id)?.nombre || "¿?";

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

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const target = e.target as HTMLDetailsElement;
      if (target.tagName !== "DETAILS" || !target.open) return;

      document.querySelectorAll("details").forEach((d) => {
        if (d !== target && d.open) d.open = false;
      });
    };

    document.addEventListener("toggle", handleToggle, true);
    return () => {
      document.removeEventListener("toggle", handleToggle, true);
    };
  }, []);


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

  const aceptarPeticion = (pid: string, modoAceptacion: "sin-permuta" | "con-permuta") => {
    const p = peticiones[pid];

    if (modoAceptacion === "sin-permuta") {
      if (!seleccionPara) return alert("⚠️ Selecciona el trabajador que acepta la clave.");
      const mensaje = `¿Confirmas que ${nombrePorId(seleccionPara)} hace la clave ${p.clave} a ${nombrePorId(p.de)}?\nRecuerda contactar antes con el compañero para contrastar conformidad.`;
      if (!window.confirm(mensaje)) return;

      update(ref(db, `peticiones/${pid}`), { para: seleccionPara });

    } else if (modoAceptacion === "con-permuta") {
      if (!seleccionPara || !nuevaFecha || !clavePermuta) {
        return alert("⚠️ Selecciona el trabajador que acepta y completa fecha y clave de devolución.");
      }

      const mensaje = `¿Confirmas que ${nombrePorId(seleccionPara)} hace la clave ${p.clave} el día ${p.fecha}\na ${nombrePorId(p.de)} a cambio de la ${clavePermuta} el día ${nuevaFecha}?\nRecuerda contactar previamente con el compañero para asegurar la conformidad del cambio.`;
      if (!window.confirm(mensaje)) return;

      // Actualiza petición original
      update(ref(db, `peticiones/${pid}`), { para: seleccionPara });

      // Crea nueva petición como devolución
      const nuevaPeticion: Peticion = {
        de: seleccionPara,
        para: p.de,
        fecha: nuevaFecha,
        clave: clavePermuta,
        permuta: true
      };

      push(ref(db, "peticiones"), nuevaPeticion);
    }

    // Resetear estados
    setSeleccionPara("");
    setNuevoDe("");
    setNuevaFecha("");
    setNuevaClave("");
    setClavePermuta("");
  };

  const peticionesOrdenadas = Object.entries(peticiones).sort((a, b) => {
    const fechaA = new Date(a[1].fecha).getTime();
    const fechaB = new Date(b[1].fecha).getTime();
    return fechaB - fechaA;
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
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={seleccionPara}
                        onChange={(e) => setSeleccionPara(e.target.value)}
                      >
                        <option value="">Selecciona compañero</option>
                        {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                      </select>
                      <button
                        onClick={() => {
                          aceptarPeticion(pid, "sin-permuta");
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Confirmar sin permuta
                      </button>
                    </div>
                  </details>

                  <details>
                    <summary className="cursor-pointer text-purple-700 font-semibold">🔁 Aceptar con permuta</summary>
                    <div className="mt-2 flex flex-col gap-2 text-sm">
                      
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={seleccionPara}
                        onChange={(e) => setSeleccionPara(e.target.value)}
                      >
                        <option value="">Selecciona compañero</option>
                        {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                      </select>

                      <input
                        type="date"
                        className="border rounded px-2 py-1 w-full"
                        value={nuevaFecha}
                        onChange={(e) => setNuevaFecha(e.target.value)}
                      />

                      <input
                        type="text"
                        placeholder="Clave de devolución"
                        className="border rounded px-2 py-1 w-full"
                        value={clavePermuta}
                        onChange={(e) => setClavePermuta(e.target.value)}
                      />

                      <button
                        onClick={() => {
                          aceptarPeticion(pid, "con-permuta");
                        }}
                        className="bg-purple-700 text-white px-3 py-1 rounded"
                      >
                        Confirmar permuta
                      </button>
                    </div>
                  </details>
                </>
              ) : (
                <details>
                  <summary className="cursor-pointer text-blue-600 font-semibold">✅ Aceptar petición</summary>
                  <div className="mt-2 flex flex-col gap-2 text-sm">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={seleccionPara}
                      onChange={(e) => setSeleccionPara(e.target.value)}
                    >
                      <option value="">Selecciona compañero</option>
                      {trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>

                    <button
                      onClick={() => {
                        aceptarPeticion(pid, "sin-permuta");
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Confirmar
                    </button>
                  </div>
                </details>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>




  </div>

  
);
}
export default Bolsa;