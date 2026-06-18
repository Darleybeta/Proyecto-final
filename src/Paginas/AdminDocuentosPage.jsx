import { useState, useEffect, useMemo } from "react";
import AdminDocumentos from "../Componentes/AdminDocumentos";
import Footer from "../Componentes/Footer";
// Ajusta esta ruta si tu api.js no está directamente en src/api.js
import { getDocumentos, subirDocumento, eliminarDocumento } from "../api/config";

const FORM_VACIO = { nombre: "", tipo: "", fecha: "", descripcion: "" };

// ── Utilidad tamaño legible ───────────────────────────────
function formatSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Convierte la forma que devuelve el backend a la forma que ya espera
// AdminDocumentos.jsx (nombre, tipo, fecha, size, descripcion, archivoUrl)
function mapDocumentoApi(doc) {
  return {
    id: doc.id,
    nombre: doc.nombre,
    tipo: doc.tipo,
    fecha: doc.fecha,
    descripcion: doc.descripcion,
    archivoUrl: doc.archivoUrl,
    sizeBytes: doc.size_bytes || 0,
    size: formatSize(doc.size_bytes || 0),
  };
}

export default function AdminDocumentosPage() {
  // ── Estado de datos (ahora vienen del backend) ─────────
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [busqueda, setBusqueda]     = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  // Modal subir
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formDoc, setFormDoc]           = useState(FORM_VACIO);
  const [archivo, setArchivo]           = useState(null);
  const [archivoNombre, setArchivoNombre] = useState("");
  const [errorForm, setErrorForm]       = useState("");
  const [subiendo, setSubiendo]         = useState(false);

  // ── Cargar documentos al entrar a la página ────────────
  useEffect(() => {
    cargarDocumentos();
  }, []);

  async function cargarDocumentos() {
    setCargando(true);
    setErrorCarga("");
    try {
      const data = await getDocumentos();
      if (!Array.isArray(data)) {
        // getDocumentos() no lanza error en caso de falla (sigue el mismo
        // patrón que el resto de tu api.js), así que detectamos aquí si
        // vino un objeto de error en vez del arreglo esperado.
        throw new Error(data?.detail || data?.error || "No se pudieron cargar los documentos.");
      }
      setDocumentos(data.map(mapDocumentoApi));
    } catch (err) {
      setErrorCarga(err.message || "No se pudieron cargar los documentos.");
    } finally {
      setCargando(false);
    }
  }

  // ── Derivados ──────────────────────────────────────────
  const documentosFiltrados = useMemo(() => {
    return documentos.filter((d) => {
      const matchTipo = filtroTipo === "Todos" || d.tipo === filtroTipo;
      const q = busqueda.toLowerCase();
      const matchQ =
        !q ||
        d.nombre.toLowerCase().includes(q) ||
        (d.tipo || "").toLowerCase().includes(q);
      return matchTipo && matchQ;
    });
  }, [documentos, filtroTipo, busqueda]);

  const totalFacturas = useMemo(
    () => documentos.filter((d) => d.tipo === "Factura").length,
    [documentos]
  );

  const totalSize = useMemo(() => {
    const totalBytes = documentos.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
    return formatSize(totalBytes);
  }, [documentos]);

  // ── Handlers: modal ────────────────────────────────────
  const handleAbrirModal = () => {
    setFormDoc({ ...FORM_VACIO, fecha: new Date().toISOString().split("T")[0] });
    setArchivo(null);
    setArchivoNombre("");
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    if (subiendo) return; // evita cerrar el modal a mitad de una subida
    setModalAbierto(false);
    setFormDoc(FORM_VACIO);
    setArchivo(null);
    setArchivoNombre("");
    setErrorForm("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDoc((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    setArchivoNombre(file.name);
    if (!formDoc.nombre) {
      setFormDoc((prev) => ({ ...prev, nombre: file.name.replace(/\.[^/.]+$/, "") }));
    }
    if (errorForm) setErrorForm("");
  };

  // ── Subir documento: ahora va al backend (multipart/form-data) ────
  const handleSubir = async () => {
    const { nombre, tipo, fecha, descripcion } = formDoc;

    if (!nombre.trim()) return setErrorForm("El nombre del documento es obligatorio.");
    if (!tipo)          return setErrorForm("Selecciona el tipo de documento.");
    if (!archivo)       return setErrorForm("Selecciona un archivo para subir.");

    const data = new FormData();
    data.append("nombre", nombre.trim());
    data.append("tipo", tipo);
    if (fecha) data.append("fecha", fecha);
    if (descripcion) data.append("descripcion", descripcion.trim());
    data.append("archivo", archivo);

    setSubiendo(true);
    setErrorForm("");
    try {
      const nuevoDoc = await subirDocumento(data);
      setDocumentos((prev) => [mapDocumentoApi(nuevoDoc), ...prev]);
      handleCerrarModal();
    } catch (err) {
      setErrorForm(err.message || "No se pudo subir el documento.");
    } finally {
      setSubiendo(false);
    }
  };

  // ── Handlers: descargar / eliminar ─────────────────────
  const handleDescargar = (doc) => {
    if (doc.archivoUrl) {
      // Nota: para archivos servidos desde otro origen, el navegador suele
      // abrir el archivo en una pestaña nueva en vez de forzar la descarga
      // (el atributo "download" del <a> no aplica entre orígenes distintos).
      window.open(doc.archivoUrl, "_blank");
    } else {
      alert("Este documento no tiene un archivo asociado.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este documento?")) return;
    const ok = await eliminarDocumento(id);
    if (ok) {
      setDocumentos((prev) => prev.filter((d) => d.id !== id));
    } else {
      alert("No se pudo eliminar el documento.");
    }
  };

  return (
  <div>
    {errorCarga && (
      <p style={{ color: "crimson", textAlign: "center", padding: "1rem" }}>
        {errorCarga}
      </p>
    )}

    <AdminDocumentos
      documentos={documentosFiltrados}
      busqueda={busqueda}
      filtroTipo={filtroTipo}
      totalDocs={documentos.length}
      totalFacturas={totalFacturas}
      totalSize={totalSize}
      modalAbierto={modalAbierto}
      formDoc={formDoc}
      errorForm={errorForm}
      archivoNombre={archivoNombre}
      onBuscar={setBusqueda}
      onFiltroTipoChange={setFiltroTipo}
      onAbrirModal={handleAbrirModal}
      onCerrarModal={handleCerrarModal}
      onFormChange={handleFormChange}
      onArchivoChange={handleArchivoChange}
      onSubir={handleSubir}
      onDescargar={handleDescargar}
      onEliminar={handleEliminar}
    />

    {cargando && (
      <p style={{ textAlign: "center", padding: "1rem" }}>
        Actualizando documentos...
      </p>
    )}

    <Footer />
  </div>
);
}