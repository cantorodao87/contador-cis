import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Gestion from './pages/Gestion';
import Visualizacion from './pages/Visualizacion';
import Reset from './pages/Reset';

function App() {
  return (
    <Router>
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Panel de control</h1>
        <Link className="hover:text-blue-600 cursor-pointer" to="/">Gestión</Link>
        |
        <Link className="hover:text-blue-600 cursor-pointer" to="/ver">Visualización</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Gestion />} />
        <Route path="/ver" element={<Visualizacion />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </Router>
  );
}

export default App;