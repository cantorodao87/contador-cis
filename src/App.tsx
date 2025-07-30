import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from "react";
import Bolsa from './pages/Bolsa';
import Reservas from './pages/Reservas';
import Resumen from './pages/Resumen';
import Admin from './pages/Admin';
import Reset from './pages/Reset';

function App() {

  const [esAdmin, setEsAdmin] = useState(false);

  return (
    <Router>
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Menú</h1>
        <Link className="hover:text-blue-600 cursor-pointer" to="/">Bolsa</Link>
        |        
        <Link className="hover:text-blue-600 cursor-pointer" to="/reservas">Reservas</Link>
        |
        <Link className="hover:text-blue-600 cursor-pointer" to="/resumen">Resumen</Link>
        |
        {esAdmin && (
          <>
            <Link className="hover:text-blue-600 cursor-pointer" to="/reset">Reset</Link>
            |
          </>
        )}
        <Link className="hover:text-blue-600 cursor-pointer" to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Bolsa />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/resumen" element={<Resumen esAdmin={esAdmin} />} />
        <Route path="/admin" element={<Admin setEsAdmin={setEsAdmin} />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </Router>
  );
}

export default App;