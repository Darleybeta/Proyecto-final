import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NuevaContrasena from "../Componentes/NuevaContrasena";

export default function NuevaContrasenaPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ nueva_contrasena: "", confirmar: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

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
      const res = await fetch("https://lukita-2si9.onrender.com/api/auth/confirmar-recuperacion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          nueva_contrasena: form.nueva_contrasena
        })
      });

      const data = await res.json();

      if (res.ok) {
        setExito(true);
      } else {
        setError(data.error || "Ocurrió un error, intenta de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  if (!token) {
    return (
      <div className="content-wrapper">
        <div className="registro-container">
          <h1 className="registro-titulo">Enlace inválido</h1>
          <p className="registro-subtitulo">El enlace no es válido o ya expiró.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <NuevaContrasena
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        cargando={cargando}
        exito={exito}
      />
    </div>
  );
}
