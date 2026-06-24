import React from "react";
import "../style/Registro.css";

export default function CambiarContrasena({ handleSubmit, handleChange, form, error, cargando }) {
  return (
    <div className="registro-container">
      <h1 className="registro-titulo">Cambia tu contraseña</h1>
      <p className="registro-subtitulo">
        Es tu primer ingreso. Por seguridad debes establecer una nueva contraseña.
      </p>

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
