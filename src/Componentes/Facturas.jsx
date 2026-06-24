// Componentes/Facturas.jsx
import "../style/Facturas.css";

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function Facturas({
  facturas = [],
  filtroEstado,
  busqueda,
  totalFacturas,
  totalPagadas,
  totalPendientes,
  montoTotal,
  modalAbierto,
  facturaEditando,
  formFactura,
  errorForm,
  onBuscar,
  onFiltroEstado,
  onAbrirModalNueva,
  onAbrirModalEditar,
  onCerrarModal,
  onFormChange,
  onGuardar,
  onEliminar,
  onMarcarPagada,
  onGenerarPDF,
}) {
  return (
    <main className="fac">

      {/* ── HEADER ── */}
      <header className="fac__header">
        <div>
         <h1 className="fac__titulo">Facturas de <span>Proveedores</span></h1>
        <p className="fac__subtitulo">Registra las facturas que recibes de tus proveedores.</p>
        </div>
        <button className="fac__btn-primary" onClick={onAbrirModalNueva}>
          + Nueva Factura
        </button>
      </header>

      {/* ── STATS ── */}
      <section className="fac__stats">
        <div className="fac__stat fac__stat--accent">
          <span className="fac__stat-icon">🧾</span>
          <div>
            <span className="fac__stat-num">{totalFacturas}</span>
            <span className="fac__stat-lbl">Total Facturas</span>
          </div>
        </div>
        <div className="fac__stat fac__stat--green">
          <span className="fac__stat-icon">✅</span>
          <div>
            <span className="fac__stat-num">{totalPagadas}</span>
            <span className="fac__stat-lbl">Pagadas</span>
          </div>
        </div>
        <div className="fac__stat fac__stat--warn">
          <span className="fac__stat-icon">⏳</span>
          <div>
            <span className="fac__stat-num">{totalPendientes}</span>
            <span className="fac__stat-lbl">Pendientes</span>
          </div>
        </div>
        <div className="fac__stat fac__stat--accent">
          <span className="fac__stat-icon">💰</span>
          <div>
            <span className="fac__stat-num">{fmt(montoTotal)}</span>
            <span className="fac__stat-lbl">Monto Total</span>
          </div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div className="fac__filtros">
        <div className="fac__search-box">
          <span className="fac__search-ico">🔍</span>
          <input
            className="fac__search"
            type="text"
            placeholder="Buscar por número o cliente..."
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
          />
          {busqueda && (
            <button className="fac__search-clear" onClick={() => onBuscar("")}>✕</button>
          )}
        </div>
        <div className="fac__filtro-btns">
          {["todos", "pendiente", "pagada", "anulada"].map((estado) => (
            <button
              key={estado}
              className={`fac__filtro-btn ${estado === "pagada" ? "fac__filtro-btn--green" : estado === "pendiente" ? "fac__filtro-btn--warn" : ""} ${filtroEstado === estado ? "fac__filtro-btn--on" : ""}`}
              onClick={() => onFiltroEstado(estado)}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── TABLA ── */}
      <section className="fac__table-section">
        {facturas.length === 0 ? (
          <div className="fac__empty">
            <span style={{ fontSize: "3rem" }}>🧾</span>
            <p>{busqueda || filtroEstado !== "todos" ? "No se encontraron facturas." : "No hay facturas registradas aún."}</p>
          </div>
        ) : (
          <div className="fac__scroll">
            <table className="fac__table">
              <thead>
                <tr>
                  <th>N° Factura</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f) => (
                  <tr key={f.id} className="fac__row">
                    <td><span className="fac__numero">{f.numero_factura}</span></td>
                    <td style={{ color: "var(--fac-text)", fontWeight: 500 }}>{f.cliente_nombre}</td>
                    <td>{f.cliente_contacto}</td>
                    <td className="fac__total">{fmt(f.total)}</td>
                    <td>
                      <span className={`fac__badge fac__badge--${f.estado}`}>
                        {f.estado === "pagada" ? "✓ Pagada" : f.estado === "pendiente" ? "⏳ Pendiente" : "✕ Anulada"}
                      </span>
                    </td>
                    <td>{f.fecha}</td>
                    <td>
                      <div className="fac__actions">
                        {f.estado === "pendiente" && (
                          <button
                            className="fac__act fac__act--pagar"
                            onClick={() => onMarcarPagada(f.id)}
                            title="Marcar como pagada"
                          >
                            💳
                          </button>
                        )}
                        <button
                          className="fac__act fac__act--pdf"
                          onClick={() => onGenerarPDF(f)}
                          title="Generar PDF"
                        >
                          📄
                        </button>
                        <button
                          className="fac__act fac__act--edit"
                          onClick={() => onAbrirModalEditar(f)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="fac__act fac__act--del"
                          onClick={() => onEliminar(f.id)}
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
        <div className="fac__overlay" onClick={onCerrarModal}>
          <div className="fac__modal" onClick={(e) => e.stopPropagation()}>
            <div className="fac__modal-head">
              <h2>{facturaEditando ? "✏️ Editar Factura" : "🧾 Nueva Factura"}</h2>
              <button className="fac__modal-x" onClick={onCerrarModal}>✕</button>
            </div>
            <div className="fac__modal-body">
              {errorForm && <div className="fac__error">{errorForm}</div>}
              <div className="fac__grid">
                <div className="fac__field">
                  <label>N° Factura *</label>
                  <input
                    type="text"
                    name="numero_factura"
                    value={formFactura.numero_factura || ""}
                    onChange={onFormChange}
                    placeholder="FAC-001"
                  />
                </div>
                <div className="fac__field">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formFactura.estado || "pendiente"}
                    onChange={onFormChange}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagada">Pagada</option>
                    <option value="anulada">Anulada</option>
                  </select>
                </div>
                <div className="fac__field fac__field--full">
                  <label>Nombre del proveedor *</label>
                  <input
                    type="text"
                    name="cliente_nombre"
                    value={formFactura.cliente_nombre || ""}
                    onChange={onFormChange}
                    placeholder="Nombre completo o razón social"
                  />
                </div>
                <div className="fac__field fac__field--full">
                 <label>Contacto del proveedor</label>
                  <input
                    type="text"
                    name="cliente_contacto"
                    value={formFactura.cliente_contacto || ""}
                    onChange={onFormChange}
                    placeholder="Correo, teléfono o NIT"
                  />
                </div>
                <div className="fac__field">
                  <label>Total *</label>
                  <input
                    type="number"
                    name="total"
                    value={formFactura.total || ""}
                    onChange={onFormChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="fac__field">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formFactura.fecha || ""}
                    onChange={onFormChange}
                  />
                </div>
              </div>
            </div>
            <div className="fac__modal-foot">
              <button className="fac__btn-secondary" onClick={onCerrarModal}>Cancelar</button>
              <button className="fac__btn-primary" onClick={onGuardar}>
                {facturaEditando ? "Guardar Cambios" : "Crear Factura"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
