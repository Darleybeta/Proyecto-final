// Paginas/RegistroPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Registro from "../Componentes/Registro";
import { crearSolicitud } from "../api/config.js";
export default function RegistroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombreNegocio: "",
    nombre: "",
    telefono: "",
    correo: "",
    ciudad: "",
    nit_cedula: "",
    tipo_negocio: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setCargando(true);
  setError("");
  setExito("");

  try {
    const data = await crearSolicitud({
      nombre_negocio: form.nombreNegocio,
      nombre_dueño:   form.nombre,
      telefono:       form.telefono,
      correo:         form.correo,
      ciudad:         form.ciudad,
      nit_cedula:     form.nit_cedula,
      tipo_negocio:   form.tipo_negocio,
      estado:         "pendiente"
    });

    if (data.id) {
      setExito("¡Solicitud enviada! Pronto nos pondremos en contacto contigo.");
      setForm({
        nombreNegocio: "", nombre: "", telefono: "",
        correo: "", ciudad: "", nit_cedula: "", tipo_negocio: ""
      });
    } else {
      setError(data.error || "Error al enviar la solicitud");
    }
  } catch (err) {
    setError("No se pudo conectar con el servidor");
  }

  setCargando(false);
};

  return (
    <div className="page-container">
      <div className="content-wrapper">
          <Registro
          handleSubmit={handleSubmit}
          form={form}
          handleChange={handleChange}
          error={error}
          exito={exito}
          cargando={cargando}
/>
      
      </div>
    </div>
  );
}