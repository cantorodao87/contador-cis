import { Link } from "react-router-dom";

interface Props {
  esAdmin: boolean;
  menuLateral: boolean;
}

export default function Navegacion({ esAdmin, menuLateral }: Props) {
  const links = (
    <>
      <Link to="/" className="text-blue-600">Bolsa</Link>
      <Link to="/reservas" className="text-blue-600">Reservas</Link>
      <Link to="/resumen" className="text-blue-600">Resumen</Link>
      {esAdmin && <Link to="/gestion" className="text-blue-600">Gestion</Link>}
      <Link to="/admin" className="text-blue-600">Admin</Link>
    </>
  );

  if (menuLateral) {
    return (
      <aside className="w-32 bg-gray-100 flex flex-col p-4 space-y-4">
        <h1 className="text-xl font-bold mb-2">Menú</h1>
        {links}
      </aside>
    );
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <h1 className="text-xl font-bold mb-2">Menú</h1>
      <div className="flex space-x-4">
        {links}
      </div>
    </nav>
  );
}