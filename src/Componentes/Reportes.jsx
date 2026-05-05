// Componentes/Reportes.jsx
import "../style/Reportes.css";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  }).format(n);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#13131a", border: "1px solid #2a2a3e",
      borderRadius: 8, padding: "0.7rem 1rem", fontSize: "0.85rem"
    }}>
      <p style={{ margin: "0 0 0.4rem", color: "#888" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ margin: "0.2rem 0", color: p.color, fontWeight: 600 }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Reportes({
  cargando,
  totalIngresos,
  totalGastos,
  balance,
  totalProductos,
  datosMensuales,
  ultimasTransacciones,
  onActualizar,
  filtroMes,
  onFiltroMes,
}) {
  return (
    <main className="rep">

      {/* ── HEADER ── */}
      <header className="rep__header">
  <div>
    <h1 className="rep__titulo">Reportes y <span>Estadísticas</span></h1>
    <p className="rep__subtitulo">Visualiza el rendimiento financiero de tu negocio.</p>
  </div>
  <button
    onClick={onActualizar}
    style={{
      background: "var(--rep-accent)",
      color: "#fff",
      border: "none",
      padding: "0.65rem 1.3rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem"
    }}
  >
    🔄 Actualizar datos
  </button>
</header>

      {cargando ? (
        <div className="rep__loading">Cargando datos...</div>
      ) : (
        <>
          {/* ── STATS ── */}
          <section className="rep__stats">
            <div className="rep__stat rep__stat--green">
              <span className="rep__stat-icon">💰</span>
              <div>
                <span className="rep__stat-num">{fmt(totalIngresos)}</span>
                <span className="rep__stat-lbl">Total Ingresos</span>
              </div>
            </div>
            <div className="rep__stat rep__stat--red">
              <span className="rep__stat-icon">📉</span>
              <div>
                <span className="rep__stat-num">{fmt(totalGastos)}</span>
                <span className="rep__stat-lbl">Total Gastos</span>
              </div>
            </div>
            <div className="rep__stat rep__stat--accent">
              <span className="rep__stat-icon">{balance >= 0 ? "📈" : "⚠️"}</span>
              <div>
                <span className="rep__stat-num" style={{ color: balance >= 0 ? "var(--rep-green)" : "var(--rep-red)" }}>
                  {fmt(balance)}
                </span>
                <span className="rep__stat-lbl">Balance</span>
              </div>
            </div>
            <div className="rep__stat rep__stat--warn">
              <span className="rep__stat-icon">📦</span>
              <div>
                <span className="rep__stat-num">{totalProductos}</span>
                <span className="rep__stat-lbl">Productos</span>
              </div>
            </div>
          </section>
          {/* ── FILTROS GRÁFICA ── */}
<div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
  {[
    { key: "todos",   label: "Todos los meses" },
    { key: "3meses",  label: "Últimos 3 meses" },
    { key: "6meses",  label: "Últimos 6 meses" },
    { key: "anio",    label: "Este año" },
  ].map((f) => (
    <button
      key={f.key}
      onClick={() => onFiltroMes(f.key)}
      style={{
        background: filtroMes === f.key ? "var(--rep-accent)" : "var(--rep-surface)",
        color: filtroMes === f.key ? "#fff" : "var(--rep-muted)",
        border: `1px solid ${filtroMes === f.key ? "var(--rep-accent)" : "var(--rep-border)"}`,
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: filtroMes === f.key ? 600 : 400,
        transition: "all 0.2s"
      }}
    >
      {f.label}
    </button>
  ))}
</div>

          {/* ── GRÁFICAS ── */}
          <div className="rep__charts">
            {/* Barras: ingresos vs gastos por mes */}
            <div className="rep__chart-card">
              <p className="rep__chart-title">
                Ingresos vs Gastos <span>por mes</span>
              </p>
              {datosMensuales.length === 0 ? (
                <div className="rep__empty"><p>Sin datos aún</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={datosMensuales} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis dataKey="mes" tick={{ fill: "#666", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#666", fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "0.82rem", color: "#888" }} />
                    <Bar dataKey="ingresos" name="Ingresos" fill="#3de09c" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="gastos"   name="Gastos"   fill="#ff4d6d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Línea: evolución del balance */}
            <div className="rep__chart-card">
              <p className="rep__chart-title">
                Evolución del <span>Balance</span>
              </p>
              {datosMensuales.length === 0 ? (
                <div className="rep__empty"><p>Sin datos aún</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={datosMensuales} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis dataKey="mes" tick={{ fill: "#666", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#666", fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      name="Balance"
                      stroke="#6c63ff"
                      strokeWidth={2}
                      dot={{ fill: "#6c63ff", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── ÚLTIMAS TRANSACCIONES ── */}
          <div className="rep__table-card">
            <div className="rep__table-head">
              📋 Últimas transacciones
            </div>
            {ultimasTransacciones.length === 0 ? (
              <div className="rep__empty">
                <p>No hay transacciones registradas aún.</p>
              </div>
            ) : (
              <div className="rep__scroll">
                <table className="rep__table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Categoría</th>
                      <th>Descripción</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimasTransacciones.map((t) => (
                      <tr key={t.id} className="rep__row">
                        <td>{t.fecha}</td>
                        <td>
                          <span className={`rep__badge rep__badge--${t.tipo}`}>
                            {t.tipo === "ingreso" ? "↑ Ingreso" : "↓ Gasto"}
                          </span>
                        </td>
                        <td>{t.categoria}</td>
                        <td style={{ color: "var(--rep-text)" }}>{t.descripcion}</td>
                        <td className={`rep__monto--${t.tipo}`}>
                          {t.tipo === "ingreso" ? "+" : "-"}{fmt(t.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}