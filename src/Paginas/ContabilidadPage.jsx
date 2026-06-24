// Paginas/ContabilidadPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Contabilidad from "../Componentes/Contabilidad.jsx";
import Footer from "../Componentes/Footer.jsx";
import { getTransacciones, crearTransaccion } from "../api/config.js";

const API = "https://lukita-2si9.onrender.com/api";
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

const FORM_VACIO = {
  monto: "", categoria: "", descripcion: "",
  fecha: new Date().toISOString().split("T")[0],
};

export default function ContabilidadPage({ usuarioActual }) {
  const negocioId = usuarioActual?.negocio_id;

  const [transacciones, setTransacciones] = useState([]);
  const [filtroTipo, setFiltroTipo]       = useState("todos");
  const [busqueda, setBusqueda]           = useState("");
  const [modalAbierto, setModalAbierto]   = useState(false);
  const [transaccionEditando, setTransaccionEditando] = useState(null);
  const [formTipo, setFormTipo]           = useState("ingreso");
  const [formTransaccion, setFormTransaccion] = useState(FORM_VACIO);
  const [errorForm, setErrorForm]         = useState("");

  useEffect(() => {
    if (!negocioId) return;
    cargarTransacciones();
  }, [negocioId]);

  const cargarTransacciones = async () => {
    try {
      const data = await getTransacciones(negocioId);
      if (Array.isArray(data)) {
        const normalizadas = data.map((t) => ({
          id:          t.id,
          monto:       Number(t.monto),
          tipo:        t.tipo,
          categoria:   t.categoria || "otro",
          descripcion: t.descripcion || "",
          fecha:       t.fecha
            ? new Date(t.fecha).toLocaleDateString("es-CO")
            : "",
        }));
        setTransacciones(normalizadas);
      }
    } catch {
      console.error("Error al cargar transacciones");
    }
  };

  // ── Derivados ──
  const transaccionesFiltradas = useMemo(() => {
    return transacciones.filter((t) => {
      const matchTipo = filtroTipo === "todos" || t.tipo === filtroTipo;
      const q = busqueda.toLowerCase();
      const matchQ = !q ||
        t.descripcion.toLowerCase().includes(q) ||
        t.categoria.toLowerCase().includes(q);
      return matchTipo && matchQ;
    });
  }, [transacciones, filtroTipo, busqueda]);

  const totalIngresos = useMemo(() =>
    transacciones.filter((t) => t.tipo === "ingreso").reduce((acc, t) => acc + t.monto, 0),
  [transacciones]);

  const totalGastos = useMemo(() =>
    transacciones.filter((t) => t.tipo === "gasto").reduce((acc, t) => acc + t.monto, 0),
  [transacciones]);

  const balance = totalIngresos - totalGastos;

  // ── Handlers modal ──
  const handleAbrirModalIngreso = () => {
    setTransaccionEditando(null);
    setFormTipo("ingreso");
    setFormTransaccion(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleAbrirModalGasto = () => {
    setTransaccionEditando(null);
    setFormTipo("gasto");
    setFormTransaccion(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (t) => {
    setTransaccionEditando(t);
    setFormTipo(t.tipo);
    setFormTransaccion({
      monto:       String(t.monto),
      categoria:   t.categoria,
      descripcion: t.descripcion,
      fecha:       t.fecha,
    });
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setTransaccionEditando(null);
    setFormTransaccion(FORM_VACIO);
    setErrorForm("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormTransaccion((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleGuardar = async () => {
    const { monto, categoria, fecha } = formTransaccion;
    if (!monto || isNaN(Number(monto)) || Number(monto) <= 0)
      return setErrorForm("Ingresa un monto válido.");
    if (!categoria)
      return setErrorForm("Selecciona una categoría.");
    if (!fecha)
      return setErrorForm("Ingresa la fecha.");

    const payload = {
      monto:       Number(monto),
      tipo:        formTipo,
      categoria:   categoria,
      descripcion: formTransaccion.descripcion || "",
      fecha:       fecha,
      negocio:     negocioId,
      usuario:     usuarioActual?.id,
    };

    try {
      if (transaccionEditando) {
        const res = await fetch(
          `${API}/contabilidad/transacciones/${transaccionEditando.id}/`,
          {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify(payload),
          }
        );
        if (res.ok) {
          await cargarTransacciones();
          handleCerrarModal();
        } else {
          setErrorForm("Error al actualizar. Intenta de nuevo.");
        }
      } else {
        const data = await crearTransaccion(payload);
        if (data.id) {
          await cargarTransacciones();
          handleCerrarModal();
        } else {
          setErrorForm("Error al registrar. Intenta de nuevo.");
        }
      }
    } catch {
      setErrorForm("Error de conexión con el servidor.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta transacción?")) return;
    try {
      await fetch(`${API}/contabilidad/transacciones/${id}/`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      setTransacciones((prev) => prev.filter((t) => t.id !== id));
    } catch {
      console.error("Error al eliminar transacción");
    }
  };

  return (
    <div>
      <Contabilidad
        transacciones={transaccionesFiltradas}
        filtroTipo={filtroTipo}
        busqueda={busqueda}
        totalIngresos={totalIngresos}
        totalGastos={totalGastos}
        balance={balance}
        modalAbierto={modalAbierto}
        transaccionEditando={transaccionEditando}
        formTipo={formTipo}
        formTransaccion={formTransaccion}
        errorForm={errorForm}
        onBuscar={setBusqueda}
        onFiltroTipo={setFiltroTipo}
        onAbrirModalIngreso={handleAbrirModalIngreso}
        onAbrirModalGasto={handleAbrirModalGasto}
        onAbrirModalEditar={handleAbrirModalEditar}
        onCerrarModal={handleCerrarModal}
        onFormChange={handleFormChange}
        onGuardar={handleGuardar}
        onEliminar={handleEliminar}
      />
      <Footer />
    </div>
  );
}
