import React from "react";
import { Link } from "react-router-dom";
import "../style/Registro.css";

export default function NuevaContrasena({ handleSubmit, handleChange, form, error, cargando, exito }) {
  if (exito) {
    return (
      <div className="registro-container">
        <div style={{ textAlign: 'center', fontSize: '3rem' }}>✅</div>
        <h1 className="registro-titulo">¡Contraseña actualizada!</h1>
        <p className="registro-subtitulo">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link to="/" className="registro-btn" style={{ textAlign: "center", display: "block", textDecoration: 'none' }}>
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="registro-container">
      <h1 className="registro-titulo">Nueva Contraseña</h1>
      <p className="registro-subtitulo">Ingresa tu nueva contraseña.</p>

      <form onSubmit={handleSubmit} className="registro-form">
        <div className="campo">
          <label className="registro-label">Nueva contraseña</label>
          <input
            type="password"
            name="nueva_contrasena"
            className="registro-input"
            placeholder="Ingresa tu nueva contraseña"
            value={form.nueva_contrasena}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label className="registro-label">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmar"
            className="registro-input"
            placeholder="Confirma tu nueva contraseña"
            value={form.confirmar}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="registro-error">{error}</p>}

        <button type="submit" className="registro-btn" disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
}
