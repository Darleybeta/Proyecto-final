import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CambiarContrasena from "../Componentes/CambiarContrasena";

export default function CambiarContrasenaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nueva_contrasena: "", confirmar: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.nueva_contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (form.nueva_contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://lukita-2si9.onrender.com/api/auth/cambiar-contrasena/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nueva_contrasena: form.nueva_contrasena })
      });

      const data = await res.json();

      if (res.ok) {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        usuario.debe_cambiar_contrasena = false;
        localStorage.setItem("usuario", JSON.stringify(usuario));
        navigate("/Inventario");
      } else {
        setError(data.error || "Ocurrió un error, intenta de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="content-wrapper">
      <CambiarContrasena
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        cargando={cargando}
      />
    </div>
  );
}
