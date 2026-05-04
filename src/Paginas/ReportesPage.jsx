// Paginas/ReportesPage.jsx
import { useState, useMemo, useEffect } from "react";
import Reportes from "../Componentes/Reportes";
import Footer from "../Componentes/Footer";
import { getTransacciones, getProductos } from "../api/config.js";

export default function ReportesPage({ usuarioActual }) {
  const negocioId = usuarioActual?.negocio_id;

  const [transacciones, setTransacciones] = useState([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!negocioId) return;
    cargarDatos();
  }, [negocioId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [dataTrans, dataProds] = await Promise.all([
        getTransacciones(negocioId),
        getProductos(negocioId),
      ]);
      if (Array.isArray(dataTrans)) {
        setTransacciones(dataTrans.map((t) => ({
          id:          t.id,
          monto:       Number(t.monto),
          tipo:        t.tipo,
          categoria:   t.categoria || "otro",
          descripcion: t.descripcion || "",
          fecha:       t.fecha
            ? new Date(t.fecha).toLocaleDateString("es-CO")
            : "",
          fechaRaw:    t.fecha,
        })));
      }
      if (Array.isArray(dataProds)) {
        setTotalProductos(dataProds.length);
      }
    } catch {
      console.error("Error al cargar reportes");
    } finally {
      setCargando(false);
    }
  };

  // ── Totales ──
  const totalIngresos = useMemo(() =>
    transacciones.filter((t) => t.tipo === "ingreso").reduce((acc, t) => acc + t.monto, 0),
  [transacciones]);

  const totalGastos = useMemo(() =>
    transacciones.filter((t) => t.tipo === "gasto").reduce((acc, t) => acc + t.monto, 0),
  [transacciones]);

  const balance = totalIngresos - totalGastos;

  // ── Datos mensuales para gráficas ──
  const datosMensuales = useMemo(() => {
    const meses = {};
    const nombresMes = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

    transacciones.forEach((t) => {
      if (!t.fechaRaw) return;
      const d = new Date(t.fechaRaw);
      const key = `${nombresMes[d.getMonth()]} ${d.getFullYear()}`;
      if (!meses[key]) meses[key] = { mes: key, ingresos: 0, gastos: 0, balance: 0 };
      if (t.tipo === "ingreso") meses[key].ingresos += t.monto;
      else                      meses[key].gastos   += t.monto;
    });

    return Object.values(meses).map((m) => ({
      ...m,
      balance: m.ingresos - m.gastos,
    }));
  }, [transacciones]);

  // ── Últimas 10 transacciones ──
  const ultimasTransacciones = useMemo(() =>
    [...transacciones].reverse().slice(0, 10),
  [transacciones]);

  return (
    <div>
      <Reportes
        cargando={cargando}
        totalIngresos={totalIngresos}
        totalGastos={totalGastos}
        balance={balance}
        totalProductos={totalProductos}
        datosMensuales={datosMensuales}
        ultimasTransacciones={ultimasTransacciones}
      />
      <Footer />
    </div>
  );
}