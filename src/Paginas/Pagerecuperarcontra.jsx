import React, { useState } from "react";
import Recuperarcontra from "../Componentes/Recuperarcontra";
import { Link } from "react-router-dom";
import "../style/Registro.css";

export default function PageRecuperar() {
  const [form, setForm] = useState({ correo: "" });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/recuperar-contrasena/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: form.correo })
      });

      const data = await res.json();

      if (res.ok) {
        setEnviado(true);
      } else {
        setError(data.error || "Ocurrió un error, intenta de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  if (enviado) {
    return (
      <div className="content-wrapper">
        <div className="registro-container">
          <div className="recuperar-icono" style={{ textAlign: 'center', fontSize: '3rem' }}>✉</div>
          <h1 className="registro-titulo">Revisa tu correo</h1>
          <p className="registro-subtitulo">
            Si <strong>{form.correo}</strong> está registrado, recibirás un enlace...
          </p>
          <Link to="/" className="registro-btn" style={{ textAlign: "center", display: "block", textDecoration: 'none' }}>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <Recuperarcontra
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        cargando={cargando}
      />
    </div>
  );
}