import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Gestion from './pages/Gestion';
import Visualizacion from './pages/Visualizacion';
import Reset from './pages/Reset';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Gestión</Link> | <Link to="/ver">Visualización</Link>
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