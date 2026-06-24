// Paginas/FacturasPage.jsx
import { useState, useMemo, useEffect } from "react";
import Facturas from "../Componentes/Facturas";
import Footer from "../Componentes/Footer";
import { getFacturas, crearFactura, actualizarFactura, eliminarFactura } from "../api/config.js";

const FORM_VACIO = {
  numero_factura: "",
  cliente_nombre: "",
  cliente_contacto: "",
  total: "",
  estado: "pendiente",
  fecha: new Date().toISOString().split("T")[0],
};

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function FacturasPage({ usuarioActual }) {
  const negocioId = usuarioActual?.negocio_id;

  const [facturas, setFacturas]         = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda]         = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [facturaEditando, setFacturaEditando] = useState(null);
  const [formFactura, setFormFactura]   = useState(FORM_VACIO);
  const [errorForm, setErrorForm]       = useState("");

  useEffect(() => {
    if (!negocioId) return;
    cargarFacturas();
  }, [negocioId]);

  const cargarFacturas = async () => {
    try {
      const data = await getFacturas(negocioId);
      if (Array.isArray(data)) {
        const normalizadas = data.map((f) => ({
          id:               f.id,
          numero_factura:   f.numero_factura,
          cliente_nombre:   f.cliente_nombre || "",
          cliente_contacto: f.cliente_contacto || "",
          total:            Number(f.total) || 0,
          estado:           f.estado || "pendiente",
          fecha:            f.fecha
            ? new Date(f.fecha).toLocaleDateString("es-CO")
            : "",
          fechaRaw:         f.fecha,
        }));
        setFacturas(normalizadas);
      }
    } catch {
      console.error("Error al cargar facturas");
    }
  };

  // ── Derivados ──
  const facturasFiltradas = useMemo(() => {
    return facturas.filter((f) => {
      const matchEstado = filtroEstado === "todos" || f.estado === filtroEstado;
      const q = busqueda.toLowerCase();
      const matchQ = !q ||
        f.numero_factura.toLowerCase().includes(q) ||
        f.cliente_nombre.toLowerCase().includes(q);
      return matchEstado && matchQ;
    });
  }, [facturas, filtroEstado, busqueda]);

  const totalPagadas    = useMemo(() => facturas.filter((f) => f.estado === "pagada").length, [facturas]);
  const totalPendientes = useMemo(() => facturas.filter((f) => f.estado === "pendiente").length, [facturas]);
  const montoTotal      = useMemo(() => facturas.reduce((acc, f) => acc + f.total, 0), [facturas]);

  // ── Handlers modal ──
  const handleAbrirModalNueva = () => {
    setFacturaEditando(null);
    setFormFactura(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (f) => {
    setFacturaEditando(f);
    setFormFactura({
      numero_factura:   f.numero_factura,
      cliente_nombre:   f.cliente_nombre,
      cliente_contacto: f.cliente_contacto,
      total:            String(f.total),
      estado:           f.estado,
      fecha:            f.fechaRaw
        ? new Date(f.fechaRaw).toISOString().split("T")[0]
        : "",
    });
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setFacturaEditando(null);
    setFormFactura(FORM_VACIO);
    setErrorForm("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFactura((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleGuardar = async () => {
    const { numero_factura, cliente_nombre, total, fecha } = formFactura;
    if (!numero_factura.trim()) return setErrorForm("El número de factura es obligatorio.");
    if (!cliente_nombre.trim()) return setErrorForm("El nombre del cliente es obligatorio.");
    if (!total || isNaN(Number(total)) || Number(total) <= 0) return setErrorForm("Ingresa un total válido.");
    if (!fecha) return setErrorForm("La fecha es obligatoria.");

    const payload = {
      numero_factura:   numero_factura.trim(),
      cliente_nombre:   cliente_nombre.trim(),
      cliente_contacto: formFactura.cliente_contacto || "",
      total:            Number(total),
      estado:           formFactura.estado || "pendiente",
      fecha:            fecha,
      negocio:          negocioId,
      usuario:          usuarioActual?.id,
    };

    try {
      if (facturaEditando) {
        const data = await actualizarFactura(facturaEditando.id, payload);
        if (data.id) {
          await cargarFacturas();
          handleCerrarModal();
        } else {
          setErrorForm("Error al actualizar. Intenta de nuevo.");
        }
      } else {
        const data = await crearFactura(payload);
        if (data.id) {
          await cargarFacturas();
          handleCerrarModal();
        } else {
          setErrorForm("Error al crear. Intenta de nuevo.");
        }
      }
    } catch {
      setErrorForm("Error de conexión con el servidor.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta factura?")) return;
    try {
      const ok = await eliminarFactura(id);
      if (ok) setFacturas((prev) => prev.filter((f) => f.id !== id));
    } catch {
      console.error("Error al eliminar factura");
    }
  };

  const handleMarcarPagada = async (id) => {
  if (!window.confirm("¿Marcar esta factura como pagada? Se registrará como ingreso en contabilidad.")) return;
  try {
    const res = await fetch(`https://lukita-2si9.onrender.com/api/contabilidad/facturas/${id}/pagar/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    const data = await res.json();
    if (data.mensaje) await cargarFacturas();
  } catch {
    console.error("Error al marcar como pagada");
  }
};
  const handleGenerarPDF = (factura) => {
    const contenido = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura ${factura.numero_factura}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .titulo { font-size: 2rem; font-weight: bold; color: #6c63ff; }
          .numero { font-size: 1rem; color: #666; }
          .seccion { margin-bottom: 24px; }
          .seccion h3 { font-size: 0.8rem; text-transform: uppercase; color: #999; letter-spacing: 0.1em; margin-bottom: 6px; }
          .seccion p { margin: 0; font-size: 1rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th { background: #f5f5f5; padding: 10px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #666; }
          td { padding: 12px 10px; border-bottom: 1px solid #eee; }
          .total-row { font-weight: bold; font-size: 1.1rem; }
          .estado { 
            display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 0.8rem; font-weight: bold;
            background: ${factura.estado === "pagada" ? "#dcfce7" : "#fef3c7"};
            color: ${factura.estado === "pagada" ? "#16a34a" : "#d97706"};
          }
          .footer { margin-top: 60px; text-align: center; color: #999; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="titulo">FACTURA</div>
            <div class="numero">${factura.numero_factura}</div>
          </div>
          <div style="text-align:right">
            <div class="estado">${factura.estado.toUpperCase()}</div>
            <div style="margin-top:8px;color:#666;font-size:0.9rem">Fecha: ${factura.fecha}</div>
          </div>
        </div>

        <div class="seccion">
          <h3>Cliente</h3>
          <p><strong>${factura.cliente_nombre}</strong></p>
          ${factura.cliente_contacto ? `<p>${factura.cliente_contacto}</p>` : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th style="text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Servicios / Productos</td>
              <td style="text-align:right">${fmt(factura.total)}</td>
            </tr>
            <tr class="total-row">
              <td>TOTAL</td>
              <td style="text-align:right">${fmt(factura.total)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Generado por Lukita — Sistema Contable</p>
        </div>
      </body>
      </html>
    `;

    const ventana = window.open("", "_blank");
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
  };

  return (
    <div>
      <Facturas
        facturas={facturasFiltradas}
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        totalFacturas={facturas.length}
        totalPagadas={totalPagadas}
        totalPendientes={totalPendientes}
        montoTotal={montoTotal}
        modalAbierto={modalAbierto}
        facturaEditando={facturaEditando}
        formFactura={formFactura}
        errorForm={errorForm}
        onBuscar={setBusqueda}
        onFiltroEstado={setFiltroEstado}
        onAbrirModalNueva={handleAbrirModalNueva}
        onAbrirModalEditar={handleAbrirModalEditar}
        onCerrarModal={handleCerrarModal}
        onFormChange={handleFormChange}
        onGuardar={handleGuardar}
        onEliminar={handleEliminar}
        onMarcarPagada={handleMarcarPagada}
        onGenerarPDF={handleGenerarPDF}
      />
      <Footer />
    </div>
  );
}
