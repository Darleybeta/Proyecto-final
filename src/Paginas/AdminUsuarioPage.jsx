// Paginas/AdminUsuarioPage.jsx

import { useState, useMemo } from "react";
import AdminUsuarios from "../Componentes/AdminUsuarios";
import Footer from "../Componentes/Footer";

const FORM_USUARIO  = { nombre: "", correo: "", rol: "", contrasena: "", confirmarContrasena: "", activo: "true" };
const FORM_NOMINA   = { nombre: "", cargo: "", salarioBase: "", horasExtras: "", recargos: "", deducciones: "", fechaPago: "" };
const FORM_GASTO    = { descripcion: "", categoria: "", monto: "", fecha: "" };
const FORM_PROV     = { nombre: "", nit: "", telefono: "", correo: "", ciudad: "", tipo: "" };
const FORM_SERV     = { nombre: "", tipo: "", monto: "", fecha: "" };
const FORM_ARRIENDO = { descripcion: "", arrendador: "", valorMensual: "", fechaPago: "", activo: "true" };

let nextId = 1;
const uid = () => nextId++;

export default function AdminUsuariosPage() {
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

  // ── Derivados ─────────────────────────────────────────
  const usuariosFiltrados = useMemo(() => usuarios.filter((u) => {
    const matchRol = filtroRol === "Todos" || u.rol === filtroRol;
    const q = busqueda.toLowerCase();
    return matchRol && (!q || u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q));
  }), [usuarios, filtroRol, busqueda]);

  const totalAdmins     = useMemo(() => usuarios.filter((u) => u.rol === "Administrador").length, [usuarios]);
  const totalVendedores = useMemo(() => usuarios.filter((u) => u.rol === "Vendedor").length, [usuarios]);

  // ── Total nómina calculado en tiempo real ─────────────
  const totalNominaCalculado = useMemo(() => {
    const base        = Number(formNomina.salarioBase  || 0);
    const extras      = Number(formNomina.horasExtras  || 0);
    const recargos    = Number(formNomina.recargos     || 0);
    const deducciones = Number(formNomina.deducciones  || 0);
    return base + extras + recargos - deducciones;
  }, [formNomina.salarioBase, formNomina.horasExtras, formNomina.recargos, formNomina.deducciones]);

  // ── Helper genérico para forms ────────────────────────
  const makeFormChange = (setter, setError) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // ── Handlers: Usuarios ────────────────────────────────
  const handleAbrirModalAgregar = () => { setUsuarioEditando(null); setFormUsuario(FORM_USUARIO); setErrorFormUsuario(""); setModalAbierto(true); };
  const handleAbrirModalEditar  = (u) => { setUsuarioEditando(u); setFormUsuario({ ...u, contrasena: "", confirmarContrasena: "", activo: String(u.activo) }); setErrorFormUsuario(""); setModalAbierto(true); };
  const handleCerrarModal       = () => { setModalAbierto(false); setUsuarioEditando(null); setFormUsuario(FORM_USUARIO); setErrorFormUsuario(""); };

  const handleGuardar = () => {
    const { nombre, correo, rol, contrasena, confirmarContrasena, activo } = formUsuario;
    if (!nombre.trim()) return setErrorFormUsuario("El nombre es obligatorio.");
    if (!correo.trim()) return setErrorFormUsuario("El correo es obligatorio.");
    if (!/\S+@\S+\.\S+/.test(correo)) return setErrorFormUsuario("Correo inválido.");
    if (!rol) return setErrorFormUsuario("Selecciona un rol.");
    if (!usuarioEditando) {
      if (!contrasena || contrasena.length < 8) return setErrorFormUsuario("Contraseña mínimo 8 caracteres.");
      if (contrasena !== confirmarContrasena) return setErrorFormUsuario("Las contraseñas no coinciden.");
      if (usuarios.find((u) => u.correo.toLowerCase() === correo.toLowerCase())) return setErrorFormUsuario("Ya existe ese correo.");
    }
    const nuevo = { id: usuarioEditando?.id || uid(), nombre: nombre.trim(), correo: correo.trim().toLowerCase(), rol, activo: activo === "true", fechaRegistro: usuarioEditando?.fechaRegistro || new Date().toISOString().split("T")[0] };
    setUsuarios((prev) => usuarioEditando ? prev.map((u) => u.id === usuarioEditando.id ? nuevo : u) : [...prev, nuevo]);
    handleCerrarModal();
  };

  const handleAbrirConfirmarEliminar  = (u) => { setUsuarioAEliminar(u); setModalEliminar(true); };
  const handleCerrarConfirmarEliminar = () => { setModalEliminar(false); setUsuarioAEliminar(null); };
  const handleConfirmarEliminar       = () => { setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id)); handleCerrarConfirmarEliminar(); };

  // ── Handlers: Nómina ──────────────────────────────────
  const handleAbrirModalNomina  = () => { setNominaEditando(null); setFormNomina(FORM_NOMINA); setErrorFormNomina(""); setModalNomina(true); };
  const handleAbrirEditarNomina = (n) => { setNominaEditando(n); setFormNomina({ ...n }); setErrorFormNomina(""); setModalNomina(true); };
  const handleCerrarModalNomina = () => { setModalNomina(false); setNominaEditando(null); setFormNomina(FORM_NOMINA); setErrorFormNomina(""); };

  const handleGuardarNomina = () => {
    const { nombre, cargo, salarioBase, fechaPago } = formNomina;
    if (!nombre.trim())  return setErrorFormNomina("El nombre es obligatorio.");
    if (!cargo.trim())   return setErrorFormNomina("El cargo es obligatorio.");
    if (!salarioBase)    return setErrorFormNomina("Ingresa el salario base.");
    if (!fechaPago)      return setErrorFormNomina("Ingresa la fecha de pago.");
    const nuevo = { id: nominaEditando?.id || uid(), ...formNomina, totalPagar: totalNominaCalculado };
    setNominas((prev) => nominaEditando ? prev.map((n) => n.id === nominaEditando.id ? nuevo : n) : [...prev, nuevo]);
    handleCerrarModalNomina();
  };
  const handleEliminarNomina = (id) => { if (!window.confirm("¿Eliminar este empleado de nómina?")) return; setNominas((prev) => prev.filter((n) => n.id !== id)); };

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
    const nuevo = { id: gastoEditando?.id || uid(), ...formGasto };
    setGastos((prev) => gastoEditando ? prev.map((g) => g.id === gastoEditando.id ? nuevo : g) : [...prev, nuevo]);
    handleCerrarModalGasto();
  };
  const handleEliminarGasto = (id) => { if (!window.confirm("¿Eliminar este gasto?")) return; setGastos((prev) => prev.filter((g) => g.id !== id)); };

  // ── Handlers: Proveedores ─────────────────────────────
  const handleAbrirModalProv  = () => { setProvEditando(null); setFormProv(FORM_PROV); setErrorFormProv(""); setModalProv(true); };
  const handleAbrirEditarProv = (p) => { setProvEditando(p); setFormProv({ ...p }); setErrorFormProv(""); setModalProv(true); };
  const handleCerrarModalProv = () => { setModalProv(false); setProvEditando(null); setFormProv(FORM_PROV); setErrorFormProv(""); };

  const handleGuardarProv = () => {
    const { nombre, nit, tipo } = formProv;
    if (!nombre.trim()) return setErrorFormProv("El nombre es obligatorio.");
    if (!nit.trim())    return setErrorFormProv("El NIT/Cédula es obligatorio.");
    if (!tipo.trim())   return setErrorFormProv("El tipo es obligatorio.");
    const nuevo = { id: provEditando?.id || uid(), ...formProv };
    setProveedores((prev) => provEditando ? prev.map((p) => p.id === provEditando.id ? nuevo : p) : [...prev, nuevo]);
    handleCerrarModalProv();
  };
  const handleEliminarProv = (id) => { if (!window.confirm("¿Eliminar este proveedor?")) return; setProveedores((prev) => prev.filter((p) => p.id !== id)); };

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
    if (!tipo)          return setErrorFormServ("Selecciona el tipo de servicio.");
    if (!monto)         return setErrorFormServ("Ingresa el monto.");
    if (!fecha)         return setErrorFormServ("Ingresa la fecha.");
    const nuevo = {
      id: servEditando?.id || uid(),
      ...formServ,
      archivoNombre: archivoServ ? archivoServ.name : (servEditando?.archivoNombre || ""),
      archivoUrl:    archivoServ ? URL.createObjectURL(archivoServ) : (servEditando?.archivoUrl || null),
    };
    setServicios((prev) => servEditando ? prev.map((s) => s.id === servEditando.id ? nuevo : s) : [...prev, nuevo]);
    handleCerrarModalServ();
  };

  const handleEliminarServ  = (id) => { if (!window.confirm("¿Eliminar este servicio?")) return; setServicios((prev) => prev.filter((s) => s.id !== id)); };
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
    const nuevo = { id: arriendoEditando?.id || uid(), ...formArriendo, activo: formArriendo.activo === "true" };
    setArriendos((prev) => arriendoEditando ? prev.map((a) => a.id === arriendoEditando.id ? nuevo : a) : [...prev, nuevo]);
    handleCerrarModalArriendo();
  };
  const handleEliminarArriendo = (id) => { if (!window.confirm("¿Eliminar este arriendo?")) return; setArriendos((prev) => prev.filter((a) => a.id !== id)); };

  return (
    <div>
      <AdminUsuarios
        tabActivo={tabActivo}
        onCambiarTab={setTabActivo}
        // Usuarios
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
        // Nómina
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
        // Gastos
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
        // Proveedores
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
        // Servicios
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
        // Arriendo
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