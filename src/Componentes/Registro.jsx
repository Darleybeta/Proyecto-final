// Componentes/Registro.jsx
import React from "react";
import "../style/Registro.css";
import { Link } from "react-router-dom";

export default function Registro({
  handleSubmit,
  form,
  handleChange,
  error,
  exito,
  cargando,
}) {
  return (
   <div className="reg-page"> 
    <div className="reg-container">
      <h1 className="reg-titulo">Registro</h1>
      <form onSubmit={handleSubmit} className="reg-form">

        <div className="reg-campo">
          <label htmlFor="NomNegocio" className="reg-label">Nombre del negocio</label>
          <input type="text" name="nombreNegocio" id="NomNegocio"
            className="reg-input" placeholder="Ingresa el nombre del negocio"
            value={form.nombreNegocio || ""} onChange={handleChange} required />
        </div>

        <div className="reg-campo">
          <label htmlFor="Nom" className="reg-label">Nombre del dueño</label>
          <input type="text" name="nombre" id="Nom"
            className="reg-input" placeholder="Ingresa tu nombre"
            value={form.nombre || ""} onChange={handleChange} required />
        </div>

        <div className="reg-campo">
          <label htmlFor="nit_cedula" className="reg-label">NIT o Cédula</label>
          <input type="text" name="nit_cedula" id="nit_cedula"
            className="reg-input" placeholder="Ingresa tu NIT o cédula"
            value={form.nit_cedula || ""} onChange={handleChange} required />
        </div>

        <div className="reg-campo">
          <label htmlFor="Tel" className="reg-label">Teléfono</label>
          <input type="text" name="telefono" id="Tel"
            className="reg-input" placeholder="Ingresa tu teléfono"
            value={form.telefono || ""} onChange={handleChange} required />
        </div>

        <div className="reg-campo">
          <label htmlFor="Cor" className="reg-label">Correo</label>
          <input type="email" name="correo" id="Cor"
            className="reg-input" placeholder="Ingresa tu correo"
            value={form.correo || ""} onChange={handleChange} required />
        </div>

        <div className="reg-campo">
          <label htmlFor="ciudad" className="reg-label">Ciudad</label>
          <select id="ciudad" name="ciudad" className="reg-input"
            value={form.ciudad || ""} onChange={handleChange} required>
            <option value="">Seleccione una ciudad</option>
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Barranquilla">Barranquilla</option>
            <option value="Cartagena">Cartagena</option>
            <option value="Bucaramanga">Bucaramanga</option>
            <option value="Pereira">Pereira</option>
            <option value="Santa Marta">Santa Marta</option>
            <option value="Cúcuta">Cúcuta</option>
            <option value="Manizales">Manizales</option>
          </select>
        </div>

        <div className="reg-campo">
          <label htmlFor="tipo_negocio" className="reg-label">Tipo de negocio</label>
          <select id="tipo_negocio" name="tipo_negocio" className="reg-input"
            value={form.tipo_negocio || ""} onChange={handleChange} required>
            <option value="">Seleccione un tipo</option>
            <option value="Tienda">Tienda</option>
            <option value="Restaurante">Restaurante</option>
            <option value="Servicios">Servicios</option>
            <option value="Manufactura">Manufactura</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <button type="submit" className="reg-btn">Enviar solicitud</button>
        {cargando && (
  <p className="reg-mensaje reg-cargando">
    Enviando solicitud...
  </p>
)}

{error && (
  <p className="reg-mensaje reg-error">
    {error}
  </p>
)}

{exito && (
  <p className="reg-mensaje reg-exito">
    {exito}
  </p>
)}
      </form>

      <p className="reg-footer">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/Inicio" className="reg-link">Inicia sesión</Link>
      </p>
    </div>
  </div> 
  
  );
}
