import { useState } from "react";

interface Props {
  esAdmin: boolean;
  setEsAdmin: (valor: boolean) => void;
  menuLateral: boolean;
  setMenuLateral: (valor: boolean) => void;
}

const Admin: React.FC<Props> = ({
  esAdmin,
  setEsAdmin,
  menuLateral,
  setMenuLateral,
}) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const manejarLogin = () => {
    const claveReal = import.meta.env.VITE_ADMIN_PASSWORD;
    if (pass === claveReal) {
      setEsAdmin(true);
    } else {
      setError("❌ Contraseña incorrecta");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center space-y-6">

      {!esAdmin ? (
      <>
      <h2 className="text-xl font-bold">🔐 Acceso de administrador</h2>


      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Introduce la clave"
        className="border px-3 py-2 rounded w-full"
      />

      <button
        onClick={manejarLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Entrar
      </button>

      </>

        ) : (
        <p className="text-green-700 font-semibold">✅ Acceso concedido como administrador.</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="text-left mt-6">
        <label className="block mb-2 font-semibold">Estilo de menú:</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={menuLateral ? "lateral" : "superior"}
          onChange={(e) => setMenuLateral(e.target.value === "lateral")}
        >
          <option value="superior">Superior</option>
          <option value="lateral">Lateral</option>
        </select>
      </div>
    </div>
  );
};

export default Admin;