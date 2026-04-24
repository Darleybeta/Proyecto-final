// Paginas/FinicioPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Finicio from "../Componentes/Finicio";
import { login } from "../api/config.js";

export default function InicioSesionPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    const data = await login(form.correo, form.contrasena);

    if (data.tokens) {
      // Guardar token y datos del usuario
      localStorage.setItem("token", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      onLogin(data.usuario);

      // Redirigir según el rol
 if (data.usuario.rol === "superadmin") {
    navigate("/dev");  // ← cambia /Devpanel por /dev
} else if (data.usuario.rol === "admin") {
    navigate("/Inventario");
} else {
    navigate("/Inventario");
}
    } else {
      setError(data.error || "Error al iniciar sesión");
    }

    setCargando(false);
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}
        {cargando && (
          <p style={{ textAlign: "center" }}>Cargando...</p>
        )}
        <Finicio
          handleSubmit={handleSubmit}
          form={form}
          handleChange={handleChange}
          mostrarSelectRol={false}
        />
      </div>
    </div>
  );
}