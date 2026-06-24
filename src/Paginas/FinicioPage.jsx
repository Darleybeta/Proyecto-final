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
      localStorage.setItem("token", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      onLogin(data.usuario);

      if (data.usuario.debe_cambiar_contrasena) {
        navigate("/CambiarContrasena");
        return;
      }

      if (data.usuario.rol === "superadmin") {
        navigate("/dev");
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
        <Finicio
          handleSubmit={handleSubmit}
          form={form}
          handleChange={handleChange}
          mostrarSelectRol={false}
          error={error}
          cargando={cargando}
        />
      </div>
    </div>
  );
}
