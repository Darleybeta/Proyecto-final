// Paginas/DevPanelPage.jsx
import { useState, useMemo, useEffect } from "react";
import DevPanel from "../Componentes/Devpanel";
import Footer from "../Componentes/Footer";

const FORM_VACIO = {
  nombre: "", nit: "", sector: "", correo: "",
  telefono: "", ciudad: "", estado: "Activa", notas: "",
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export default function DevPanelPage() {
  const [empresas, setEmpresas]       = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [vistaActiva, setVistaActiva] = useState("empresas");
  const [busquedaEmpresa, setBusquedaEmpresa]     = useState("");
  const [busquedaSolicitud, setBusquedaSolicitud] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [usuariosEmpresa, setUsuariosEmpresa]         = useState([]);
  const [passwordsVisibles, setPasswordsVisibles] = useState({});
  const [modalAbierto, setModalAbierto]       = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [formEmpresa, setFormEmpresa]         = useState(FORM_VACIO);
  const [errorForm, setErrorForm]             = useState("");

useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        cargarEmpresas();
        cargarSolicitudes();
    }
}, []);

  const cargarEmpresas = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/negocios/", { headers: getHeaders() });
    const data = await res.json();
    setEmpresas(Array.isArray(data) ? data : []);
  };

const cargarSolicitudes = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/negocios/solicitudes/", { headers: getHeaders() });
  const data = await res.json();
  if (Array.isArray(data)) {
    const transformadas = data
      .filter((s) => s.estado === "pendiente")  // ← solo pendientes
      .map((s) => ({
        id:       s.id,
        empresa:  s.nombre_negocio,
        contacto: s.nombre_dueño,
        correo:   s.correo,
        telefono: s.telefono,
        nit:      s.nit_cedula,
        ciudad:   s.ciudad,
        tipo:     s.tipo_negocio,
        estado:   s.estado,
        fecha:    s.fecha_solicitud
          ? new Date(s.fecha_solicitud).toLocaleDateString("es-CO")
          : "Sin fecha",
        _raw: s,
      }));
    setSolicitudes(transformadas);
  } else {
    setSolicitudes([]);
  }
};

  const empresasFiltradas = useMemo(() => {
    const q = busquedaEmpresa.toLowerCase();
    if (!q) return empresas;
    return empresas.filter(
      (e) => e.nombre?.toLowerCase().includes(q) || e.nit_cedula?.toLowerCase().includes(q)
    );
  }, [empresas, busquedaEmpresa]);

  const solicitudesFiltradas = useMemo(() => {
    const q = busquedaSolicitud.toLowerCase();
    if (!q) return solicitudes;
    return solicitudes.filter(
      (s) => s.nombre_negocio?.toLowerCase().includes(q) || s.correo?.toLowerCase().includes(q)
    );
  }, [solicitudes, busquedaSolicitud]);

  const totalActivas     = useMemo(() => empresas.filter((e) => e.estado === "activo").length, [empresas]);
  const totalSolicitudes = solicitudes.length;

  const handleCambiarVista = (vista) => {
    setVistaActiva(vista);
    if (vista !== "usuarios") {
      setEmpresaSeleccionada(null);
      setPasswordsVisibles({});
    }
  };

  const handleVerUsuarios = async (empresa) => {
    setEmpresaSeleccionada(empresa);
    const res = await fetch(`http://127.0.0.1:8000/api/auth/usuarios/?negocio_id=${empresa.id}`, { headers: getHeaders() });
    const data = await res.json();
    setUsuariosEmpresa(Array.isArray(data) ? data : []);
    setPasswordsVisibles({});
    setVistaActiva("usuarios");
  };

  const handleVolverEmpresas = () => {
    setVistaActiva("empresas");
    setEmpresaSeleccionada(null);
    setPasswordsVisibles({});
  };

  const handleTogglePassword = (userId) => {
    setPasswordsVisibles((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleAbrirModalEmpresa = () => {
    setEmpresaEditando(null);
    setFormEmpresa(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleEditarEmpresa = (empresa) => {
    setEmpresaEditando(empresa);
    setFormEmpresa({ ...empresa });
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setEmpresaEditando(null);
    setFormEmpresa(FORM_VACIO);
    setErrorForm("");
  };

  const handleFormEmpresaChange = (e) => {
    const { name, value } = e.target;
    setFormEmpresa((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleGuardarEmpresa = async () => {
    const { nombre, nit, correo } = formEmpresa;
    if (!nombre.trim()) return setErrorForm("El nombre de la empresa es obligatorio.");
    if (!nit.trim())    return setErrorForm("El NIT es obligatorio.");
    if (!correo.trim()) return setErrorForm("El correo es obligatorio.");

    if (empresaEditando) {
      await fetch(`http://127.0.0.1:8000/api/negocios/${empresaEditando.id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(formEmpresa)
      });
    } else {
      await fetch("http://127.0.0.1:8000/api/negocios/", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formEmpresa)
      });
    }
    cargarEmpresas();
    handleCerrarModal();
  };

const handleEliminarEmpresa = async (id) => {
  if (!window.confirm("¿Eliminar esta empresa y todos sus usuarios?")) return;

  try {
    // 1. Obtener usuarios del negocio
    const resUsuarios = await fetch(
      `http://127.0.0.1:8000/api/auth/usuarios/?negocio_id=${id}`,
      { headers: getHeaders() }
    );
    const usuarios = await resUsuarios.json();

    // 2. Eliminar todos los usuarios en paralelo y esperar que terminen
    if (Array.isArray(usuarios) && usuarios.length > 0) {
      await Promise.all(
        usuarios.map((u) =>
          fetch(`http://127.0.0.1:8000/api/auth/usuarios/${u.id}/`, {
            method: "DELETE",
            headers: getHeaders()
          })
        )
      );
    }

    // 3. Solo después eliminar el negocio
    const resNegocio = await fetch(`http://127.0.0.1:8000/api/negocios/${id}/`, {
      method: "DELETE",
      headers: getHeaders()
    });

    if (resNegocio.ok) {
      cargarEmpresas();
    } else {
      alert("Error al eliminar la empresa. Intenta de nuevo.");
    }
  } catch {
    alert("Error de conexión al eliminar.");
  }
};

const handleAprobarSolicitud = async (solicitud) => {
  const raw = solicitud._raw;
  const passwordTemporal = raw.nombre_negocio.slice(0, 4) + "2024";

  // 1. Marcar solicitud como aprobada
  await fetch(`http://127.0.0.1:8000/api/negocios/solicitudes/${solicitud.id}/`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ estado: "aprobado" })
  });

  // 2. Crear el negocio
  const resNegocio = await fetch("http://127.0.0.1:8000/api/negocios/", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      nombre:       raw.nombre_negocio,
      nombre_dueño: raw.nombre_dueño,
      nit_cedula:   raw.nit_cedula,
      telefono:     raw.telefono,
      correo:       raw.correo,
      ciudad:       raw.ciudad,
      tipo_negocio: raw.tipo_negocio,
      estado:       "activo"
    })
  });
  const negocioCreado = await resNegocio.json();

  // 3. Crear usuario admin para ese negocio
  if (negocioCreado.id) {
    await fetch("http://127.0.0.1:8000/api/auth/registro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre:    raw.nombre_dueño,
        correo:    raw.correo,
        password:  passwordTemporal,
        rol:       "admin",
        negocio_id: negocioCreado.id
      })
    });

    alert(
      `✅ Negocio aprobado.\n\n` +
      `Se creó el usuario administrador:\n` +
      `📧 Correo: ${raw.correo}\n` +
      `🔑 Contraseña temporal: ${passwordTemporal}\n\n` +
      `Comunícale estas credenciales al cliente.`
    );
  }

  cargarEmpresas();
  cargarSolicitudes();
};

  const handleRechazarSolicitud = async (id) => {
    if (!window.confirm("¿Rechazar esta solicitud?")) return;
    await fetch(`http://127.0.0.1:8000/api/negocios/solicitudes/${id}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ estado: "rechazado" })
    });
    cargarSolicitudes();
  };

  return (
    <div>
      <DevPanel
        vistaActiva={vistaActiva}
        onCambiarVista={handleCambiarVista}
        empresas={empresasFiltradas}
        busquedaEmpresa={busquedaEmpresa}
        onBuscarEmpresa={setBusquedaEmpresa}
        onVerUsuarios={handleVerUsuarios}
        onAbrirModalEmpresa={handleAbrirModalEmpresa}
        onEditarEmpresa={handleEditarEmpresa}
        onEliminarEmpresa={handleEliminarEmpresa}
        solicitudes={solicitudesFiltradas}
        busquedaSolicitud={busquedaSolicitud}
        onBuscarSolicitud={setBusquedaSolicitud}
        onAprobarSolicitud={handleAprobarSolicitud}
        onRechazarSolicitud={handleRechazarSolicitud}
        empresaSeleccionada={empresaSeleccionada}
        usuariosEmpresa={usuariosEmpresa}
        onVolverEmpresas={handleVolverEmpresas}
        passwordsVisibles={passwordsVisibles}
        onTogglePassword={handleTogglePassword}
        totalEmpresas={empresas.length}
        totalActivas={totalActivas}
        totalSolicitudes={totalSolicitudes}
        modalAbierto={modalAbierto}
        empresaEditando={empresaEditando}
        formEmpresa={formEmpresa}
        errorForm={errorForm}
        onCerrarModal={handleCerrarModal}
        onFormEmpresaChange={handleFormEmpresaChange}
        onGuardarEmpresa={handleGuardarEmpresa}
      />
      <Footer />
    </div>
  );
}