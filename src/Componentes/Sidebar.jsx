// Componentes/Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/Sidebar.css";

const LINKS = [
  { to: "/Inventario",    icon: "📦", label: "Inventario" },
  { to: "/AdminUsuario",  icon: "👥", label: "Usuarios & Nómina" },
  { to: "/Contabilidad",  icon: "📒", label: "Contabilidad" },
  { to: "/Facturas",      icon: "🧾", label: "Facturas" },
  { to: "/Reportes",      icon: "📊", label: "Reportes" },
  { to: "/Chat",       icon: "🤖", label: "Asistente IA" },
  { to: "/AdminDocumentos", icon: "📁", label: "Documentos" },
];

export default function Sidebar({ usuarioActual, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout?.();
    navigate("/Inicio");
  };

  const nombre = usuarioActual?.nombre || "Usuario";
  const rol    = usuarioActual?.rol    || "admin";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <>
      {/* Botón móvil */}
      <button className="sb__toggle" onClick={() => setOpen((v) => !v)}>
        {open ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside className={`sb ${open ? "sb--open" : ""}`}>

        {/* Brand */}
        <div className="sb__brand">
          <h1 className="sb__logo">Lu<span>kita</span></h1>
          <p className="sb__tagline">Sistema Contable</p>
        </div>

        {/* Usuario */}
        <div className="sb__user">
          <div className="sb__avatar">{inicial}</div>
          <div className="sb__user-info">
            <p className="sb__user-name">{nombre}</p>
            <p className="sb__user-rol">{rol}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="sb__nav">
          <span className="sb__section-label">Módulos</span>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sb__link ${isActive ? "sb__link--active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <span className="sb__link-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sb__footer">
          <button className="sb__logout" onClick={handleLogout}>
            <span className="sb__link-icon">🚪</span>
            Cerrar sesión
          </button>
        </div>

      </aside>
    </>
  );
}