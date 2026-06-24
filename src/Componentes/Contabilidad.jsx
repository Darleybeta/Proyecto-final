// Componentes/Contabilidad.jsx
import "../style/Contabilidad.css";

const CATEGORIAS_INGRESO = ["Venta", "Servicio", "Inversión", "Otro"];
const CATEGORIAS_GASTO   = ["Nómina", "Arriendo", "Servicios", "Proveedores", "Impuestos", "Otro"];

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function Contabilidad({
  // Datos
  transacciones = [],
  filtroTipo,
  busqueda,
  totalIngresos,
  totalGastos,
  balance,
  // Modal
  modalAbierto,
  transaccionEditando,
  formTipo,
  formTransaccion,
  errorForm,
  // Handlers
  onBuscar,
  onFiltroTipo,
  onAbrirModalIngreso,
  onAbrirModalGasto,
  onAbrirModalEditar,
  onCerrarModal,
  onFormChange,
  onGuardar,
  onEliminar,
}) {
  const categorias = formTipo === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO;

  return (
    <main className="con">

      {/* ── HEADER ── */}
      <header className="con__header">
        <div>
          <h1 className="con__titulo">Control de <span>Contabilidad</span></h1>
          <p className="con__subtitulo">Registra ingresos y gastos de tu negocio.</p>
        </div>
        <div className="con__header-actions">
          <button className="con__btn-ingreso" onClick={onAbrirModalIngreso}>
            + Ingreso
          </button>
          <button className="con__btn-gasto" onClick={onAbrirModalGasto}>
            + Gasto
          </button>
        </div>
      </header>

      {/* ── STATS ── */}
      <section className="con__stats">
        <div className="con__stat con__stat--green">
          <span className="con__stat-icon">💰</span>
          <div>
            <span className="con__stat-num">{fmt(totalIngresos)}</span>
            <span className="con__stat-lbl">Total Ingresos</span>
          </div>
        </div>
        <div className="con__stat con__stat--red">
          <span className="con__stat-icon">📉</span>
          <div>
            <span className="con__stat-num">{fmt(totalGastos)}</span>
            <span className="con__stat-lbl">Total Gastos</span>
          </div>
        </div>
        <div className={`con__stat con__stat--accent`}>
          <span className="con__stat-icon">{balance >= 0 ? "📈" : "⚠️"}</span>
          <div>
            <span className="con__stat-num" style={{ color: balance >= 0 ? "var(--con-green)" : "var(--con-red)" }}>
              {fmt(balance)}
            </span>
            <span className="con__stat-lbl">Balance</span>
          </div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div className="con__filtros">
        <div className="con__search-box">
          <span className="con__search-ico">🔍</span>
          <input
            className="con__search"
            type="text"
            placeholder="Buscar por descripción o categoría..."
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
          />
          {busqueda && (
            <button className="con__search-clear" onClick={() => onBuscar("")}>✕</button>
          )}
        </div>
        <div className="con__filtro-btns">
          <button
            className={`con__filtro-btn ${filtroTipo === "todos" ? "con__filtro-btn--on" : ""}`}
            onClick={() => onFiltroTipo("todos")}
          >
            Todos
          </button>
          <button
            className={`con__filtro-btn con__filtro-btn--green ${filtroTipo === "ingreso" ? "con__filtro-btn--on" : ""}`}
            onClick={() => onFiltroTipo("ingreso")}
          >
            Ingresos
          </button>
          <button
            className={`con__filtro-btn con__filtro-btn--red ${filtroTipo === "gasto" ? "con__filtro-btn--on" : ""}`}
            onClick={() => onFiltroTipo("gasto")}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* ── TABLA ── */}
      <section className="con__table-section">
        {transacciones.length === 0 ? (
          <div className="con__empty">
            <span style={{ fontSize: "3rem" }}>📒</span>
            <p>{busqueda || filtroTipo !== "todos" ? "No se encontraron transacciones." : "No hay transacciones registradas aún."}</p>
          </div>
        ) : (
          <div className="con__scroll">
            <table className="con__table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transacciones.map((t) => (
                  <tr key={t.id} className="con__row">
                    <td>{t.fecha}</td>
                    <td>
                      <span className={`con__badge con__badge--${t.tipo}`}>
                        {t.tipo === "ingreso" ? "↑ Ingreso" : "↓ Gasto"}
                      </span>
                    </td>
                    <td>{t.categoria}</td>
                    <td style={{ color: "var(--con-text)" }}>{t.descripcion}</td>
                    <td className={`con__monto--${t.tipo}`}>
                      {t.tipo === "ingreso" ? "+" : "-"}{fmt(t.monto)}
                    </td>
                    <td>
                      <div className="con__actions">
                        <button
                          className="con__act con__act--edit"
                          onClick={() => onAbrirModalEditar(t)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="con__act con__act--del"
                          onClick={() => onEliminar(t.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── MODAL ── */}
      {modalAbierto && (
        <div className="con__overlay" onClick={onCerrarModal}>
          <div className="con__modal" onClick={(e) => e.stopPropagation()}>
            <div className="con__modal-head">
              <h2>
                {transaccionEditando
                  ? "✏️ Editar Transacción"
                  : formTipo === "ingreso"
                  ? "💰 Nuevo Ingreso"
                  : "📉 Nuevo Gasto"}
              </h2>
              <button className="con__modal-x" onClick={onCerrarModal}>✕</button>
            </div>
            <div className="con__modal-body">
              {errorForm && <div className="con__error">{errorForm}</div>}
              <div className="con__grid">
                <div className="con__field">
                  <label>Monto *</label>
                  <input
                    type="number"
                    name="monto"
                    value={formTransaccion.monto}
                    onChange={onFormChange}
                    placeholder="0"
                  />
                </div>
                <div className="con__field">
                  <label>Categoría *</label>
                  <select
                    name="categoria"
                    value={formTransaccion.categoria}
                    onChange={onFormChange}
                    className="con__select"
                  >
                    <option value="">Selecciona...</option>
                    {categorias.map((c) => (
                      <option key={c} value={c.toLowerCase()}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="con__field con__field--full">
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formTransaccion.descripcion}
                    onChange={onFormChange}
                    placeholder="Describe la transacción..."
                  />
                </div>
                <div className="con__field">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formTransaccion.fecha}
                    onChange={onFormChange}
                  />
                </div>
              </div>
            </div>
            <div className="con__modal-foot">
              <button className="con__btn-secondary" onClick={onCerrarModal}>Cancelar</button>
              <button className="con__btn-primary" onClick={onGuardar}>
                {transaccionEditando ? "Guardar Cambios" : "Registrar"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
