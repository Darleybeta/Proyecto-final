// Paginas/InventarioPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Inventario from "../Componentes/Inventario";
import Footer from "../Componentes/Footer";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  crearVenta,
} from "../api/config.js";

const FORM_VACIO = {
  codigo: "", nombre: "", categoria: "",
  stock: "", stockMinimo: "", precio: "", descripcion: "",
};

const FORM_VENTA_VACIO = { cantidad: "", precioVenta: "", cliente: "" };

export default function InventarioPage({ usuarioActual }) {
  const navigate = useNavigate();
  const negocioId = usuarioActual?.negocio_id;

  // ── Permisos ──────────────────────────────────────────
  const esAdmin = usuarioActual?.rol === "Administrador" || usuarioActual?.rol === "admin";

  // ── Estado principal ──────────────────────────────────
  const [productos, setProductos]       = useState([]);
  const [cargando, setCargando]         = useState(false);
  const [errorGlobal, setErrorGlobal]   = useState("");
  const [categoriaActiva, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda]         = useState("");

  // ── Modal producto ────────────────────────────────────
  const [modalAbierto, setModalAbierto]         = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formProducto, setFormProducto]         = useState(FORM_VACIO);
  const [errorForm, setErrorForm]               = useState("");

  // ── Modal venta ───────────────────────────────────────
  const [modalVentaAbierto, setModalVentaAbierto] = useState(false);
  const [productoVenta, setProductoVenta]         = useState(null);
  const [formVenta, setFormVenta]                 = useState(FORM_VENTA_VACIO);
  const [errorVenta, setErrorVenta]               = useState("");

  // ── Panel alertas ─────────────────────────────────────
  const [alertasVisible, setAlertasVisible] = useState(false);

  // ── Cargar productos al montar ────────────────────────
  useEffect(() => {
    if (!negocioId) return;
    cargarProductos();
  }, [negocioId]);

  const cargarProductos = async () => {
    setCargando(true);
    setErrorGlobal("");
    try {
      const data = await getProductos(negocioId);
      if (Array.isArray(data)) {
        // Normalizar campos del backend al formato que usa el componente
        const normalizados = data.map((p) => ({
          id:          p.id,
          codigo:      p.codigo || String(p.id),
          nombre:      p.nombre,
          categoria:   p.categoria || "Sin categoría",
          stock:       Number(p.stock) || 0,
          stockMinimo: Number(p.stock_minimo) || 0,
          precio:      Number(p.precio) || 0,
          descripcion: p.descripcion || "",
        }));
        setProductos(normalizados);
      } else {
        setErrorGlobal("Error al cargar productos.");
      }
    } catch {
      setErrorGlobal("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  // ── Derivados ─────────────────────────────────────────
  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria));
    return [...set].sort();
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCat = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
      const q = busqueda.toLowerCase();
      const matchQ = !q || p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [productos, categoriaActiva, busqueda]);

  const stockBajoCount   = useMemo(() => productos.filter((p) => p.stock <= p.stockMinimo).length, [productos]);
  const alertasStockBajo = useMemo(() => productos.filter((p) => p.stock <= p.stockMinimo), [productos]);
  const valorTotal       = useMemo(() => productos.reduce((acc, p) => acc + p.precio * p.stock, 0), [productos]);

  // ── Handlers: navegación admin ────────────────────────
  const handleIrUsuarios   = () => navigate("/AdminUsuario");
  const handleIrDocumentos = () => navigate("/AdminDocumentos");
  const handleIrContabilidad = () => navigate("/Contabilidad");

  // ── Handlers: modal producto ──────────────────────────
  const handleAbrirModalAgregar = () => {
    setProductoEditando(null);
    setFormProducto(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (producto) => {
    setProductoEditando(producto);
    setFormProducto({ ...producto, stock: String(producto.stock), stockMinimo: String(producto.stockMinimo), precio: String(producto.precio) });
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);
    setFormProducto(FORM_VACIO);
    setErrorForm("");
  };

  const handleFormProductoChange = (e) => {
    const { name, value } = e.target;
    setFormProducto((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleGuardarProducto = async () => {
    const { codigo, nombre, categoria, stock, stockMinimo, precio } = formProducto;

    if (!codigo.trim())    return setErrorForm("El código es obligatorio.");
    if (!nombre.trim())    return setErrorForm("El nombre es obligatorio.");
    if (!categoria.trim()) return setErrorForm("La categoría es obligatoria.");
    if (stock === "" || isNaN(Number(stock)))             return setErrorForm("Ingresa un stock válido.");
    if (stockMinimo === "" || isNaN(Number(stockMinimo))) return setErrorForm("Ingresa un stock mínimo válido.");
    if (precio === "" || isNaN(Number(precio)))           return setErrorForm("Ingresa un precio válido.");

    // Payload con los nombres que espera el backend
    const payload = {
      codigo:       codigo.trim(),
      nombre:       nombre.trim(),
      categoria:    categoria.trim(),
      stock:        Number(stock),
      stock_minimo: Number(stockMinimo),
      precio:       Number(precio),
      descripcion:  formProducto.descripcion?.trim() || "",
      negocio:      negocioId,
    };

    try {
      if (productoEditando) {
        const data = await actualizarProducto(productoEditando.id, payload);
        if (data.id) {
          setProductos((prev) =>
            prev.map((p) =>
              p.id === productoEditando.id
                ? { ...p, ...payload, id: productoEditando.id, stockMinimo: Number(stockMinimo) }
                : p
            )
          );
        } else {
          return setErrorForm("Error al actualizar. Intenta de nuevo.");
        }
      } else {
        const data = await crearProducto(payload);
        if (data.id) {
          setProductos((prev) => [
            ...prev,
            {
              id:          data.id,
              codigo:      data.codigo || String(data.id),
              nombre:      data.nombre,
              categoria:   data.categoria || "Sin categoría",
              stock:       Number(data.stock) || 0,
              stockMinimo: Number(data.stock_minimo) || 0,
              precio:      Number(data.precio) || 0,
              descripcion: data.descripcion || "",
            },
          ]);
        } else {
          return setErrorForm("Error al crear producto. Intenta de nuevo.");
        }
      }
      handleCerrarModal();
    } catch {
      setErrorForm("Error de conexión con el servidor.");
    }
  };

  const handleEliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const ok = await eliminarProducto(id);
      if (ok) {
        setProductos((prev) => prev.filter((p) => p.id !== id));
      } else {
        setErrorGlobal("No se pudo eliminar el producto.");
      }
    } catch {
      setErrorGlobal("Error de conexión al eliminar.");
    }
  };

  // ── Handlers: modal venta ─────────────────────────────
  const handleAbrirModalVenta = (producto) => {
    setProductoVenta(producto);
    setFormVenta({ ...FORM_VENTA_VACIO, precioVenta: producto.precio });
    setErrorVenta("");
    setModalVentaAbierto(true);
  };

  const handleCerrarModalVenta = () => {
    setModalVentaAbierto(false);
    setProductoVenta(null);
    setFormVenta(FORM_VENTA_VACIO);
    setErrorVenta("");
  };

  const handleFormVentaChange = (e) => {
    const { name, value } = e.target;
    setFormVenta((prev) => ({ ...prev, [name]: value }));
    if (errorVenta) setErrorVenta("");
  };

  const handleRegistrarVenta = async () => {
    const cantidad = Number(formVenta.cantidad);

    if (!cantidad || isNaN(cantidad) || cantidad <= 0)
      return setErrorVenta("Ingresa una cantidad válida.");
    if (cantidad > productoVenta.stock)
      return setErrorVenta(`Stock insuficiente. Disponible: ${productoVenta.stock}`);

    const payload = {
      cliente_nombre: formVenta.cliente || "Cliente general",
      total:          cantidad * Number(formVenta.precioVenta),
      negocio:        negocioId,
      usuario:        usuarioActual?.id,
      detalles: [
        {
          producto:       productoVenta.id,
          cantidad:       cantidad,
          precio_unitario: Number(formVenta.precioVenta),
          subtotal:       cantidad * Number(formVenta.precioVenta),
        },
      ],
    };

    try {
      const data = await crearVenta(payload);
      if (data.id) {
        // Actualizar stock localmente sin recargar todo
        setProductos((prev) =>
          prev.map((p) =>
            p.id === productoVenta.id ? { ...p, stock: p.stock - cantidad } : p
          )
        );
        handleCerrarModalVenta();
      } else {
        setErrorVenta("Error al registrar la venta. Intenta de nuevo.");
      }
    } catch {
      setErrorVenta("Error de conexión al registrar venta.");
    }
  };

  return (
    <div>
      {cargando && (
        <p style={{ textAlign: "center", padding: "1rem" }}>Cargando productos...</p>
      )}
      {errorGlobal && (
        <p style={{ textAlign: "center", color: "red", padding: "1rem" }}>{errorGlobal}</p>
      )}
      <Inventario
        // Datos
        productos={productosFiltrados}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        busqueda={busqueda}
        totalProductos={productos.length}
        stockBajoCount={stockBajoCount}
        valorTotal={valorTotal}
        // Modal producto
        modalAbierto={modalAbierto}
        productoEditando={productoEditando}
        formProducto={formProducto}
        errorForm={errorForm}
        // Modal venta
        modalVentaAbierto={modalVentaAbierto}
        formVenta={formVenta}
        productoVenta={productoVenta}
        errorVenta={errorVenta}
        // Rol
        esAdmin={esAdmin}
        // Alertas
        alertasStockBajo={alertasStockBajo}
        alertasVisible={alertasVisible}
        // Handlers generales
        onBuscar={setBusqueda}
        onCategoriaChange={setCategoria}
        onToggleAlertas={() => setAlertasVisible((v) => !v)}
        // Handlers navegación admin
        onIrUsuarios={handleIrUsuarios}
        onIrDocumentos={handleIrDocumentos}
        onIrContabilidad={handleIrContabilidad}
        // Handlers producto
        onAbrirModalAgregar={handleAbrirModalAgregar}
        onAbrirModalEditar={handleAbrirModalEditar}
        onCerrarModal={handleCerrarModal}
        onFormProductoChange={handleFormProductoChange}
        onGuardarProducto={handleGuardarProducto}
        onEliminarProducto={handleEliminarProducto}
        // Handlers venta
        onAbrirModalVenta={handleAbrirModalVenta}
        onCerrarModalVenta={handleCerrarModalVenta}
        onFormVentaChange={handleFormVentaChange}
        onRegistrarVenta={handleRegistrarVenta}
      />
      <Footer />
    </div>
  );
}
