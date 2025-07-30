import { useState } from "react";

type Props = {
  setEsAdmin: (valor: boolean) => void;
};

const Admin: React.FC<Props> = ({ setEsAdmin }) => {
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
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">🔐 Acceso de administrador</h2>
      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Introduce la clave"
        className="border px-3 py-2 rounded w-full mb-2"
      />
      <button
        onClick={manejarLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Entrar
      </button>
      {error && <p className="mt-3 text-red-500">{error}</p>}
    </div>
  );
};

export default Admin;