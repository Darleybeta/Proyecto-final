import React from "react";
import { Link } from "react-router-dom";
import "../style/Registro.css";

export default function Recuperarcontra({ handleSubmit, handleChange, form, error, cargando }) {
  return (
    <div className="registro-container">
      <h1 className="registro-titulo">Recuperar Contraseña</h1>
      <p className="registro-subtitulo">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <form onSubmit={handleSubmit} className="registro-form">
        <div className="campo">
          <label htmlFor="Cor" className="registro-label">Correo</label>
          <input
            type="email"
            name="correo"
            id="Cor"
            className="registro-input"
            placeholder="Ingresa tu correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="registro-error">{error}</p>}

        <button type="submit" className="registro-btn" disabled={cargando}>
          {cargando ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      <p className="registro-footer">
        <Link to="/inicio" className="registro-link">← Volver al inicio de sesión</Link>
      </p>
    </div>
  );
}