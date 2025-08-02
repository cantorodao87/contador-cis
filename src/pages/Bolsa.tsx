import { useEffect, useState } from "react";
import { db, ref, onValue, push, update } from "../firebase/config";
import { FormularioSolicitudClaves } from "../components/FormularioSolicitudClaves";
import { ListaDePeticiones } from "../components/ListaDePeticiones";
import type { Trabajador, Peticion } from "../types/modelos";
import { FiltrosListaDePeticiones } from "../components/FiltrosListaDePeticiones";


const Bolsa: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [peticiones, setPeticiones] = useState<{ [id: string]: Peticion }>({});

  const [nuevoDe, setNuevoDe] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [permuta, setPermuta] = useState(false);
  const [clavePermuta, setClavePermuta] = useState("");

  const [seleccionPara, setSeleccionPara] = useState("");

  const [ocultarAceptadas, setOcultarAceptadas] = useState(false);
  const [ocultarAntiguas, setOcultarAntiguas] = useState(false);

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
    <FormularioSolicitudClaves
      nuevoDe={nuevoDe}
      setNuevoDe={setNuevoDe}
      nuevaFecha={nuevaFecha}
      setNuevaFecha={setNuevaFecha}
      nuevaClave={nuevaClave}
      setNuevaClave={setNuevaClave}
      permuta={permuta}
      setPermuta={setPermuta}
      enviarPeticion={enviarPeticion}
      trabajadores={trabajadores}
    />

    {/* 📋 Listado */}
    
    <h3 className="text-lg font-semibold mb-4">📌 Peticiones activas</h3>
   

   <FiltrosListaDePeticiones
      ocultarAceptadas={ocultarAceptadas}
      setOcultarAceptadas={setOcultarAceptadas}
      ocultarAntiguas={ocultarAntiguas}
      setOcultarAntiguas={setOcultarAntiguas}
    />
    

    <ListaDePeticiones
      peticionesOrdenadas={peticionesOrdenadas}
      trabajadores={trabajadores}
      nombrePorId={nombrePorId}
      seleccionPara={seleccionPara}
      setSeleccionPara={setSeleccionPara}
      nuevaFecha={nuevaFecha}
      setNuevaFecha={setNuevaFecha}
      clavePermuta={clavePermuta}
      setClavePermuta={setClavePermuta}
      aceptarPeticion={aceptarPeticion}
      ocultarAceptadas={ocultarAceptadas}
      ocultarAntiguas={ocultarAntiguas}
    />




  </div>

  
);
}
export default Bolsa;