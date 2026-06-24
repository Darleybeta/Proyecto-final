// Componentes/Layout.jsx
import Sidebar from "./Sidebar";
import "../style/Sidebar.css";

export default function Layout({ usuarioActual, onLogout, children }) {
  return (
    <div className="layout">
      <Sidebar usuarioActual={usuarioActual} onLogout={onLogout} />
      <main className="layout__content">
        {children}
      </main>
    </div>
  );
}
