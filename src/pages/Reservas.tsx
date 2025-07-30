import { useEffect, useState } from "react";
import { db, ref, onValue, push } from "../firebase/config";

type Trabajador = {
  id: string;
  nombre: string;
};

type Reserva = {
  fecha: string;
  trabajador: string;
};

const Reservas: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [reservas, setReservas] = useState<{ [id: string]: Reserva }>({});
  const [reservaActiva, setReservaActiva] = useState<string | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    // Cargar trabajadores
    const trabajadoresRef = ref(db, "trabajadores");
    onValue(trabajadoresRef, (snapshot) => {
      const data = snapshot.val() || [];
      const lista = data
        .map((t: any, index: number) => t ? { id: index.toString(), nombre: t.nombre } : null)
        .filter(Boolean) as Trabajador[];
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setTrabajadores(lista);
    });

    // Cargar reservas
    const reservasRef = ref(db, "reservas");
    onValue(reservasRef, (snapshot) => {
      setReservas(snapshot.val() || {});
    });
  }, []);

  const crearReserva = (id: string) => {
    if (!fechaSeleccionada) return alert("Selecciona una fecha primero.");
    const nombre = nombrePorId(id);
    const confirmar = window.confirm(`¿Confirmas crear reserva para ${nombre} el ${fechaSeleccionada}?`);
    if (!confirmar) return;

    push(ref(db, "reservas"), {
      fecha: fechaSeleccionada,
      trabajador: id,
    });

    // Reset
    setReservaActiva(null);
    setFechaSeleccionada("");
  };

  const nombrePorId = (id: string) =>
    trabajadores.find((t) => t.id === id)?.nombre || "¿?";

  const reservasPorId = (id: string) =>
    Object.values(reservas).filter((r) => r.trabajador === id);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🗓️ Reservas disfrutadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trabajadores.map((t) => (
          <div key={t.id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="text-lg font-semibold mb-2">{t.nombre}</h3>
            <p className="text-gray-600 text-sm mb-2">
              Reservas registradas: {reservasPorId(t.id).length}
            </p>

            {reservaActiva === t.id ? (
              <div className="space-y-2">
                <input
                  type="date"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
                <button
                  onClick={() => crearReserva(t.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  ✅ Confirmar reserva
                </button>
                <button
                  onClick={() => {
                    setReservaActiva(null);
                    setFechaSeleccionada("");
                  }}
                  className="text-red-500 text-sm ml-2"
                >
                  ❌ Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setReservaActiva(t.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                ➕ Añadir reserva
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservas;