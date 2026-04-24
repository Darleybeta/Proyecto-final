// Componentes/Finicio.jsx
// Solo JSX. Sin lógica ni estados.

import React from "react";
import { Link } from "react-router-dom";
import "../style/Registro.css";

export default function Finicio({ handleSubmit, form, handleChange, mostrarSelectRol = false }) {
  return (
    <div className="registro-container">
      <h1 className="registro-titulo">Inicio de Sesión</h1>
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

        <div className="campo">
          <label htmlFor="Con" className="registro-label">Contraseña</label>
          <input
            type="password"
            name="contrasena"
            id="Con"
            className="registro-input"
            placeholder="Ingresa tu contraseña"
            value={form.contrasena}
            onChange={handleChange}
            required
          />
        </div>

        {/* ── Solo para pruebas sin backend — quitar después ── */}
        {mostrarSelectRol && (
          <div className="campo">
            <label className="registro-label">🧪 Rol de prueba</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="registro-input"
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
            </select>
          </div>
        )}

        <Link to="/Recuperar" className="registro-link registro-forgot">
          ¿Olvidaste tu contraseña?
        </Link>

        <button type="submit" className="registro-btn">Iniciar Sesión</button>
      </form>

      <p className="registro-footer">
        ¿Aún no tienes una cuenta?{" "}
        <Link to="/Registro" className="registro-link">Créala aquí</Link>
      </p>
    </div>
  );
}