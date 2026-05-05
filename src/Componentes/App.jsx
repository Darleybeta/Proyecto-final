import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegistroPage from '../Paginas/RegistroPage';
import InicioSesionPage from '../Paginas/FinicioPage';
import InicioPage from '../Paginas/InicioPage';
import InventarioPage from '../Paginas/InventarioPage';
import AdminUsuariosPage from '../Paginas/AdminUsuarioPage';
import AdminDocumentosPage from '../Paginas/AdminDocuentosPage';
import Recuperarcontra from '../Paginas/Pagerecuperarcontra';
import DevPanelPage from '../Paginas/DevpanelPage';
import ContabilidadPage from '../Paginas/ContabilidadPage';
import ReportesPage from '../Paginas/ReportesPage';
import FacturasPage from '../Paginas/FacturasPage';

const RutaProtegida = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/Inicio" />;
};

const App = () => {
  const [usuarioActual, setUsuarioActual] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (usuario) => {
    setUsuarioActual(usuario);
  };

  const handleLogout = () => {
    setUsuarioActual(null);
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/"                element={<InicioPage />} />
        <Route path="/Registro"        element={<RegistroPage />} />
        <Route path="/Inicio"          element={<InicioSesionPage onLogin={handleLogin} />} />
        <Route path="/Inventario"      element={<RutaProtegida element={<InventarioPage usuarioActual={usuarioActual} />} />} />
        <Route path="/AdminUsuario"    element={<RutaProtegida element={<AdminUsuariosPage usuarioActual={usuarioActual} />} />} />
        <Route path="/AdminDocumentos" element={<RutaProtegida element={<AdminDocumentosPage usuarioActual={usuarioActual} />} />} />
        <Route path="/Recuperar"       element={<Recuperarcontra />} />
        <Route path="/dev"             element={<RutaProtegida element={<DevPanelPage />} />} />
        <Route path="/Contabilidad" element={<RutaProtegida element={<ContabilidadPage usuarioActual={usuarioActual} />} />} />
        <Route path="/Reportes" element={<RutaProtegida element={<ReportesPage usuarioActual={usuarioActual} />} />} />
        <Route path="/Facturas" element={<RutaProtegida element={<FacturasPage usuarioActual={usuarioActual} />} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;