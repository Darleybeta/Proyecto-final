// Componentes/Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/Sidebar.css";

const LINKS = [
  { to: "/Inventario",      icon: "📦", label: "Inventario",        roles: ["admin", "empleado"] },
  { to: "/AdminUsuario",    icon: "👥", label: "Usuarios & Nómina",  roles: ["admin"] },
  { to: "/Contabilidad",    icon: "📒", label: "Contabilidad",       roles: ["admin"] },
  { to: "/Facturas",        icon: "🧾", label: "Facturas",           roles: ["admin"] },
  { to: "/Reportes",        icon: "📊", label: "Reportes",           roles: ["admin"] },
  { to: "/Chat",            icon: "🤖", label: "Asistente IA",       roles: ["admin"] },
  { to: "/AdminDocumentos", icon: "📁", label: "Documentos",         roles: ["admin"] },
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
  // Si no hay rol claro, no mostramos nada (no asumimos admin por defecto).
  const rol = usuarioActual?.rol || "";
  const inicial = nombre.charAt(0).toUpperCase();

  const linksVisibles = LINKS.filter((link) => link.roles.includes(rol));

  return (
    <>
      <button className="sb__toggle" onClick={() => setOpen((v) => !v)}>
        {open ? "✕" : "☰"}
      </button>

      <aside className={`sb ${open ? "sb--open" : ""}`}>
        <div className="sb__brand">
          <h1 className="sb__logo">Lu<span>kita</span></h1>
          <p className="sb__tagline">Sistema Contable</p>
        </div>

        <div className="sb__user">
          <div className="sb__avatar">{inicial}</div>
          <div className="sb__user-info">
            <p className="sb__user-name">{nombre}</p>
            <p className="sb__user-rol">{rol}</p>
          </div>
        </div>

        <nav className="sb__nav">
          <span className="sb__section-label">Módulos</span>
          {linksVisibles.map((link) => (
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
