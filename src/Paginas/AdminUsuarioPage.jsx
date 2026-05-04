// Paginas/AdminUsuarioPage.jsx
import { useState, useMemo, useEffect } from "react";
import AdminUsuarios from "../Componentes/AdminUsuarios";
import Footer from "../Componentes/Footer";
import {
  getNomina, crearNomina, actualizarNomina, eliminarNomina, pagarNomina
} from "../api/config.js";

const FORM_USUARIO  = { nombre: "", correo: "", rol: "", contrasena: "", confirmarContrasena: "", activo: "true" };
const FORM_NOMINA   = { nombre: "", cargo: "", salarioBase: "", horasExtras: "", recargos: "", deducciones: "", fechaPago: "" };
const FORM_GASTO    = { descripcion: "", categoria: "", monto: "", fecha: "" };
const FORM_PROV     = { nombre: "", nit: "", telefono: "", correo: "", ciudad: "", tipo: "" };
const FORM_SERV     = { nombre: "", tipo: "", monto: "", fecha: "" };
const FORM_ARRIENDO = { descripcion: "", arrendador: "", valorMensual: "", fechaPago: "", activo: "true" };

const API = "http://127.0.0.1:8000/api";
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

const rolBackendAFrontend = (rol) => {
  if (rol === "admin")     return "Administrador";
  if (rol === "empleado")  return "Vendedor";
  return rol;
};

const rolFrontendABackend = (rol) => {
  if (rol === "Administrador") return "admin";
  if (rol === "Vendedor")      return "empleado";
  return rol;
};

export default function AdminUsuariosPage({ usuarioActual }) {
  const negocioId = usuarioActual?.negocio_id;
  const [tabActivo, setTabActivo] = useState("usuarios");

  // ── Usuarios ──────────────────────────────────────────
  const [usuarios, setUsuarios]                 = useState([]);
  const [busqueda, setBusqueda]                 = useState("");
  const [filtroRol, setFiltroRol]               = useState("Todos");
  const [modalAbierto, setModalAbierto]         = useState(false);
  const [usuarioEditando, setUsuarioEditando]   = useState(null);
  const [formUsuario, setFormUsuario]           = useState(FORM_USUARIO);
  const [errorFormUsuario, setErrorFormUsuario] = useState("");
  const [modalEliminarAbierto, setModalEliminar]= useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // ── Nómina ────────────────────────────────────────────
  const [nominas, setNominas]                   = useState([]);
  const [modalNominaAbierto, setModalNomina]    = useState(false);
  const [nominaEditando, setNominaEditando]     = useState(null);
  const [formNomina, setFormNomina]             = useState(FORM_NOMINA);
  const [errorFormNomina, setErrorFormNomina]   = useState("");

  // ── Gastos ────────────────────────────────────────────
  const [gastos, setGastos]                     = useState([]);
  const [modalGastoAbierto, setModalGasto]      = useState(false);
  const [gastoEditando, setGastoEditando]       = useState(null);
  const [formGasto, setFormGasto]               = useState(FORM_GASTO);
  const [errorFormGasto, setErrorFormGasto]     = useState("");

  // ── Proveedores ───────────────────────────────────────
  const [proveedores, setProveedores]           = useState([]);
  const [modalProvAbierto, setModalProv]        = useState(false);
  const [provEditando, setProvEditando]         = useState(null);
  const [formProv, setFormProv]                 = useState(FORM_PROV);
  const [errorFormProv, setErrorFormProv]       = useState("");

  // ── Servicios ─────────────────────────────────────────
  const [servicios, setServicios]               = useState([]);
  const [modalServAbierto, setModalServ]        = useState(false);
  const [servEditando, setServEditando]         = useState(null);
  const [formServ, setFormServ]                 = useState(FORM_SERV);
  const [errorFormServ, setErrorFormServ]       = useState("");
  const [archivoServ, setArchivoServ]           = useState(null);
  const [archivoServNombre, setArchivoServNombre] = useState("");

  // ── Arriendo ──────────────────────────────────────────
  const [arriendos, setArriendos]               = useState([]);
  const [modalArriendoAbierto, setModalArriendo]= useState(false);
  const [arriendoEditando, setArriendoEditando] = useState(null);
  const [formArriendo, setFormArriendo]         = useState(FORM_ARRIENDO);
  const [errorFormArriendo, setErrorFormArriendo] = useState("");
  useEffect(() => {
    if (!negocioId) return;
    cargarNomina();
  }, [negocioId]);

  const cargarNomina = async () => {
  try {
    const data = await getNomina(negocioId);
    if (Array.isArray(data)) {
      const normalizada = data.map((n) => ({
        id:          n.id,
        nombre:      n.empleado_nombre,
        cargo:       n.cargo || "",
        salarioBase: String(n.salario || ""),
        horasExtras: String(n.horas_extras || "0"),
        recargos:    String(n.recargos || "0"),
        deducciones: String(n.deducciones || "0"),
        fechaPago:   n.fecha_pago
          ? new Date(n.fecha_pago).toISOString().split("T")[0]
          : "",
        mes:         n.mes || "",
        estado:      n.estado || "pendiente",
        totalPagar:  Number(n.salario || 0) + Number(n.horas_extras || 0) + Number(n.recargos || 0) - Number(n.deducciones || 0),
      }));
      setNominas(normalizada);
    }
  } catch {
    console.error("Error al cargar nómina");
  }
};
  // ── Cargar usuarios del backend ───────────────────────
  useEffect(() => {
    if (!negocioId) return;
    cargarUsuarios();
  }, [negocioId]);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API}/auth/usuarios/?negocio_id=${negocioId}`, {
        headers: getHeaders()
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalizados = data.map((u) => ({
          id:             u.id,
          nombre:         u.nombre,
          correo:         u.correo,
          telefono:       u.telefono || "",
          rol:            rolBackendAFrontend(u.rol),
          activo:         true,
          fechaRegistro:  u.fecha_registro
            ? new Date(u.fecha_registro).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }));
        setUsuarios(normalizados);
      }
    } catch {
      console.error("Error al cargar usuarios");
    }
  };

  // ── Derivados ─────────────────────────────────────────
  const usuariosFiltrados = useMemo(() => usuarios.filter((u) => {
    const matchRol = filtroRol === "Todos" || u.rol === filtroRol;
    const q = busqueda.toLowerCase();
    return matchRol && (!q || u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q));
  }), [usuarios, filtroRol, busqueda]);

  const totalAdmins     = useMemo(() => usuarios.filter((u) => u.rol === "Administrador").length, [usuarios]);
  const totalVendedores = useMemo(() => usuarios.filter((u) => u.rol === "Vendedor").length, [usuarios]);

  const totalNominaCalculado = useMemo(() => {
    const base        = Number(formNomina.salarioBase  || 0);
    const extras      = Number(formNomina.horasExtras  || 0);
    const recargos    = Number(formNomina.recargos     || 0);
    const deducciones = Number(formNomina.deducciones  || 0);
    return base + extras + recargos - deducciones;
  }, [formNomina.salarioBase, formNomina.horasExtras, formNomina.recargos, formNomina.deducciones]);

  const makeFormChange = (setter, setError) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // ── Handlers: Usuarios ────────────────────────────────
  const handleAbrirModalAgregar = () => {
    setUsuarioEditando(null);
    setFormUsuario(FORM_USUARIO);
    setErrorFormUsuario("");
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (u) => {
    setUsuarioEditando(u);
    setFormUsuario({ ...u, contrasena: "", confirmarContrasena: "", activo: String(u.activo) });
    setErrorFormUsuario("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
    setFormUsuario(FORM_USUARIO);
    setErrorFormUsuario("");
  };

  const handleGuardar = async () => {
    const { nombre, correo, rol, contrasena, confirmarContrasena } = formUsuario;
    if (!nombre.trim()) return setErrorFormUsuario("El nombre es obligatorio.");
    if (!correo.trim()) return setErrorFormUsuario("El correo es obligatorio.");
    if (!/\S+@\S+\.\S+/.test(correo)) return setErrorFormUsuario("Correo inválido.");
    if (!rol) return setErrorFormUsuario("Selecciona un rol.");
    if (!usuarioEditando) {
      if (!contrasena || contrasena.length < 8) return setErrorFormUsuario("Contraseña mínimo 8 caracteres.");
      if (contrasena !== confirmarContrasena) return setErrorFormUsuario("Las contraseñas no coinciden.");
    }

try {
  if (usuarioEditando) {
    await fetch(`${API}/auth/usuarios/${usuarioEditando.id}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        rol:    rolFrontendABackend(rol),
      })
    });
  } else {
    const res = await fetch(`${API}/auth/registro/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        nombre:     nombre.trim(),
        correo:     correo.trim().toLowerCase(),
        password:   contrasena,
        rol:        rolFrontendABackend(rol),
        negocio_id: negocioId,
      })
    });

    if (!res.ok) {
      const data = await res.json();
      return setErrorFormUsuario(data.error || "Error al crear el usuario.");
    }
  }
  await cargarUsuarios();
  handleCerrarModal();
} catch {
  setErrorFormUsuario("Error de conexión. Intenta de nuevo.");
}
  };

  const handleAbrirConfirmarEliminar  = (u) => { setUsuarioAEliminar(u); setModalEliminar(true); };
  const handleCerrarConfirmarEliminar = () => { setModalEliminar(false); setUsuarioAEliminar(null); };

  const handleConfirmarEliminar = async () => {
    try {
      await fetch(`${API}/auth/usuarios/${usuarioAEliminar.id}/`, {
        method: "DELETE",
        headers: getHeaders()
      });
      await cargarUsuarios();
      handleCerrarConfirmarEliminar();
    } catch {
      console.error("Error al eliminar usuario");
    }
  };

  // ── Handlers: Nómina ──────────────────────────────────
  const handleAbrirModalNomina  = () => { setNominaEditando(null); setFormNomina(FORM_NOMINA); setErrorFormNomina(""); setModalNomina(true); };
  const handleAbrirEditarNomina = (n) => { setNominaEditando(n); setFormNomina({ ...n }); setErrorFormNomina(""); setModalNomina(true); };
  const handleCerrarModalNomina = () => { setModalNomina(false); setNominaEditando(null); setFormNomina(FORM_NOMINA); setErrorFormNomina(""); };
  const handleGuardarNomina = async () => {
    const { nombre, cargo, salarioBase, fechaPago } = formNomina;
    if (!nombre.trim())  return setErrorFormNomina("El nombre es obligatorio.");
    if (!cargo.trim())   return setErrorFormNomina("El cargo es obligatorio.");
    if (!salarioBase)    return setErrorFormNomina("Ingresa el salario base.");
    if (!fechaPago)      return setErrorFormNomina("Ingresa la fecha de pago.");

    const payload = {
  empleado_nombre: nombre.trim(),
  cargo:           cargo.trim(),
  salario:         Number(formNomina.salarioBase || 0),
  horas_extras:    Number(formNomina.horasExtras || 0),
  recargos:        Number(formNomina.recargos || 0),
  deducciones:     Number(formNomina.deducciones || 0),
  mes:             formNomina.mes || new Date().toLocaleString("es-CO", { month: "long" }),
  fecha_pago:      fechaPago,
  estado:          "pendiente",
  negocio:         negocioId,
};

  try {
    if (nominaEditando) {
      const data = await actualizarNomina(nominaEditando.id, payload);
      if (data.id) {
        await cargarNomina();
        handleCerrarModalNomina();
      } else {
        setErrorFormNomina("Error al actualizar. Intenta de nuevo.");
      }
    } else {
      const data = await crearNomina(payload);
      if (data.id) {
        await cargarNomina();
        handleCerrarModalNomina();
      } else {
        setErrorFormNomina("Error al crear. Intenta de nuevo.");
      }
    }
  } catch {
    setErrorFormNomina("Error de conexión con el servidor.");
  }
};
 const handleEliminarNomina = async (id) => {
  if (!window.confirm("¿Eliminar este empleado de nómina?")) return;
  try {
    const ok = await eliminarNomina(id);
    if (ok) await cargarNomina();
  } catch {
    console.error("Error al eliminar nómina");
  }
};
const handlePagarNomina = async (id) => {
  if (!window.confirm("¿Confirmar pago de esta nómina? Se registrará automáticamente como gasto en contabilidad.")) return;
  try {
    const data = await pagarNomina(id);
    if (data.mensaje) {
      await cargarNomina();
    } else {
      alert("Error al procesar el pago.");
    }
  } catch {
    console.error("Error al pagar nómina");
  }
};

  // ── Handlers: Gastos ──────────────────────────────────
  const handleAbrirModalGasto  = () => { setGastoEditando(null); setFormGasto({ ...FORM_GASTO, fecha: new Date().toISOString().split("T")[0] }); setErrorFormGasto(""); setModalGasto(true); };
  const handleAbrirEditarGasto = (g) => { setGastoEditando(g); setFormGasto({ ...g }); setErrorFormGasto(""); setModalGasto(true); };
  const handleCerrarModalGasto = () => { setModalGasto(false); setGastoEditando(null); setFormGasto(FORM_GASTO); setErrorFormGasto(""); };
  const handleGuardarGasto = () => {
    const { descripcion, categoria, monto, fecha } = formGasto;
    if (!descripcion.trim()) return setErrorFormGasto("La descripción es obligatoria.");
    if (!categoria)          return setErrorFormGasto("Selecciona una categoría.");
    if (!monto)              return setErrorFormGasto("Ingresa el monto.");
    if (!fecha)              return setErrorFormGasto("Ingresa la fecha.");
    const nuevo = { id: Date.now(), ...formGasto };
    setGastos((prev) => gastoEditando ? prev.map((g) => g.id === gastoEditando.id ? nuevo : g) : [...prev, nuevo]);
    handleCerrarModalGasto();
  };
  const handleEliminarGasto = (id) => { if (!window.confirm("¿Eliminar?")) return; setGastos((prev) => prev.filter((g) => g.id !== id)); };

  // ── Handlers: Proveedores ─────────────────────────────
  const handleAbrirModalProv  = () => { setProvEditando(null); setFormProv(FORM_PROV); setErrorFormProv(""); setModalProv(true); };
  const handleAbrirEditarProv = (p) => { setProvEditando(p); setFormProv({ ...p }); setErrorFormProv(""); setModalProv(true); };
  const handleCerrarModalProv = () => { setModalProv(false); setProvEditando(null); setFormProv(FORM_PROV); setErrorFormProv(""); };
  const handleGuardarProv = () => {
    const { nombre, nit, tipo } = formProv;
    if (!nombre.trim()) return setErrorFormProv("El nombre es obligatorio.");
    if (!nit.trim())    return setErrorFormProv("El NIT/Cédula es obligatorio.");
    if (!tipo.trim())   return setErrorFormProv("El tipo es obligatorio.");
    const nuevo = { id: Date.now(), ...formProv };
    setProveedores((prev) => provEditando ? prev.map((p) => p.id === provEditando.id ? nuevo : p) : [...prev, nuevo]);
    handleCerrarModalProv();
  };
  const handleEliminarProv = (id) => { if (!window.confirm("¿Eliminar?")) return; setProveedores((prev) => prev.filter((p) => p.id !== id)); };

  // ── Handlers: Servicios ───────────────────────────────
  const handleAbrirModalServ  = () => { setServEditando(null); setFormServ({ ...FORM_SERV, fecha: new Date().toISOString().split("T")[0] }); setArchivoServ(null); setArchivoServNombre(""); setErrorFormServ(""); setModalServ(true); };
  const handleAbrirEditarServ = (s) => { setServEditando(s); setFormServ({ ...s }); setArchivoServ(null); setArchivoServNombre(s.archivoNombre || ""); setErrorFormServ(""); setModalServ(true); };
  const handleCerrarModalServ = () => { setModalServ(false); setServEditando(null); setFormServ(FORM_SERV); setArchivoServ(null); setArchivoServNombre(""); setErrorFormServ(""); };
  const handleArchivoServChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivoServ(file);
    setArchivoServNombre(file.name);
    if (!formServ.nombre) setFormServ((prev) => ({ ...prev, nombre: file.name.replace(/\.[^/.]+$/, "") }));
  };
  const handleGuardarServ = () => {
    const { nombre, tipo, monto, fecha } = formServ;
    if (!nombre.trim()) return setErrorFormServ("El nombre es obligatorio.");
    if (!tipo)          return setErrorFormServ("Selecciona el tipo.");
    if (!monto)         return setErrorFormServ("Ingresa el monto.");
    if (!fecha)         return setErrorFormServ("Ingresa la fecha.");
    const nuevo = { id: Date.now(), ...formServ, archivoNombre: archivoServ ? archivoServ.name : (servEditando?.archivoNombre || ""), archivoUrl: archivoServ ? URL.createObjectURL(archivoServ) : (servEditando?.archivoUrl || null) };
    setServicios((prev) => servEditando ? prev.map((s) => s.id === servEditando.id ? nuevo : s) : [...prev, nuevo]);
    handleCerrarModalServ();
  };
  const handleEliminarServ  = (id) => { if (!window.confirm("¿Eliminar?")) return; setServicios((prev) => prev.filter((s) => s.id !== id)); };
  const handleDescargarServ = (s) => {
    if (!s.archivoUrl) return;
    const a = document.createElement("a");
    a.href = s.archivoUrl;
    a.download = s.archivoNombre || s.nombre;
    a.click();
  };

  // ── Handlers: Arriendo ────────────────────────────────
  const handleAbrirModalArriendo  = () => { setArriendoEditando(null); setFormArriendo(FORM_ARRIENDO); setErrorFormArriendo(""); setModalArriendo(true); };
  const handleAbrirEditarArriendo = (a) => { setArriendoEditando(a); setFormArriendo({ ...a, activo: String(a.activo) }); setErrorFormArriendo(""); setModalArriendo(true); };
  const handleCerrarModalArriendo = () => { setModalArriendo(false); setArriendoEditando(null); setFormArriendo(FORM_ARRIENDO); setErrorFormArriendo(""); };
  const handleGuardarArriendo = () => {
    const { descripcion, arrendador, valorMensual, fechaPago } = formArriendo;
    if (!descripcion.trim()) return setErrorFormArriendo("La descripción es obligatoria.");
    if (!arrendador.trim())  return setErrorFormArriendo("El arrendador es obligatorio.");
    if (!valorMensual)       return setErrorFormArriendo("Ingresa el valor mensual.");
    if (!fechaPago)          return setErrorFormArriendo("Ingresa la fecha de pago.");
    const nuevo = { id: Date.now(), ...formArriendo, activo: formArriendo.activo === "true" };
    setArriendos((prev) => arriendoEditando ? prev.map((a) => a.id === arriendoEditando.id ? nuevo : a) : [...prev, nuevo]);
    handleCerrarModalArriendo();
  };
  const handleEliminarArriendo = (id) => { if (!window.confirm("¿Eliminar?")) return; setArriendos((prev) => prev.filter((a) => a.id !== id)); };

  return (
    <div>
      <AdminUsuarios
        tabActivo={tabActivo}
        onCambiarTab={setTabActivo}
        usuarios={usuariosFiltrados}
        busqueda={busqueda}
        filtroRol={filtroRol}
        totalUsuarios={usuarios.length}
        totalAdmins={totalAdmins}
        totalVendedores={totalVendedores}
        modalAbierto={modalAbierto}
        usuarioEditando={usuarioEditando}
        formUsuario={formUsuario}
        errorFormUsuario={errorFormUsuario}
        modalEliminarAbierto={modalEliminarAbierto}
        usuarioAEliminar={usuarioAEliminar}
        onBuscar={setBusqueda}
        onFiltroRolChange={setFiltroRol}
        onAbrirModalAgregar={handleAbrirModalAgregar}
        onAbrirModalEditar={handleAbrirModalEditar}
        onCerrarModal={handleCerrarModal}
        onFormChange={makeFormChange(setFormUsuario, setErrorFormUsuario)}
        onGuardar={handleGuardar}
        onAbrirConfirmarEliminar={handleAbrirConfirmarEliminar}
        onCerrarConfirmarEliminar={handleCerrarConfirmarEliminar}
        onConfirmarEliminar={handleConfirmarEliminar}
        nominas={nominas}
        modalNominaAbierto={modalNominaAbierto}
        nominaEditando={nominaEditando}
        formNomina={formNomina}
        errorFormNomina={errorFormNomina}
        totalNominaCalculado={totalNominaCalculado}
        onAbrirModalNomina={handleAbrirModalNomina}
        onAbrirEditarNomina={handleAbrirEditarNomina}
        onCerrarModalNomina={handleCerrarModalNomina}
        onFormNominaChange={makeFormChange(setFormNomina, setErrorFormNomina)}
        onGuardarNomina={handleGuardarNomina}
        onEliminarNomina={handleEliminarNomina}
        onPagarNomina={handlePagarNomina}
        gastos={gastos}
        modalGastoAbierto={modalGastoAbierto}
        gastoEditando={gastoEditando}
        formGasto={formGasto}
        errorFormGasto={errorFormGasto}
        onAbrirModalGasto={handleAbrirModalGasto}
        onAbrirEditarGasto={handleAbrirEditarGasto}
        onCerrarModalGasto={handleCerrarModalGasto}
        onFormGastoChange={makeFormChange(setFormGasto, setErrorFormGasto)}
        onGuardarGasto={handleGuardarGasto}
        onEliminarGasto={handleEliminarGasto}
        proveedores={proveedores}
        modalProvAbierto={modalProvAbierto}
        provEditando={provEditando}
        formProv={formProv}
        errorFormProv={errorFormProv}
        onAbrirModalProv={handleAbrirModalProv}
        onAbrirEditarProv={handleAbrirEditarProv}
        onCerrarModalProv={handleCerrarModalProv}
        onFormProvChange={makeFormChange(setFormProv, setErrorFormProv)}
        onGuardarProv={handleGuardarProv}
        onEliminarProv={handleEliminarProv}
        servicios={servicios}
        modalServAbierto={modalServAbierto}
        servEditando={servEditando}
        formServ={formServ}
        errorFormServ={errorFormServ}
        archivoServNombre={archivoServNombre}
        onAbrirModalServ={handleAbrirModalServ}
        onAbrirEditarServ={handleAbrirEditarServ}
        onCerrarModalServ={handleCerrarModalServ}
        onFormServChange={makeFormChange(setFormServ, setErrorFormServ)}
        onArchivoServChange={handleArchivoServChange}
        onGuardarServ={handleGuardarServ}
        onEliminarServ={handleEliminarServ}
        onDescargarServ={handleDescargarServ}
        arriendos={arriendos}
        modalArriendoAbierto={modalArriendoAbierto}
        arriendoEditando={arriendoEditando}
        formArriendo={formArriendo}
        errorFormArriendo={errorFormArriendo}
        onAbrirModalArriendo={handleAbrirModalArriendo}
        onAbrirEditarArriendo={handleAbrirEditarArriendo}
        onCerrarModalArriendo={handleCerrarModalArriendo}
        onFormArriendoChange={makeFormChange(setFormArriendo, setErrorFormArriendo)}
        onGuardarArriendo={handleGuardarArriendo}
        onEliminarArriendo={handleEliminarArriendo}
      />
      <Footer />
    </div>
  );
}