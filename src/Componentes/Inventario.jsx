// Componentes/Inventario.jsx
// Solo JSX. Sin lógica ni estados.

import "../style/Inventario.css";

export default function Inventario({
  // Datos
  productos = [],
  categorias = [],
  categoriaActiva = "Todos",
  busqueda = "",
  totalProductos = 0,
  stockBajoCount = 0,
  valorTotal = 0,
  // Modal producto
  modalAbierto = false,
  productoEditando = null,
  formProducto = {},
  errorForm = "",
  // Modal venta
  modalVentaAbierto = false,
  formVenta = {},
  productoVenta = null,
  errorVenta = "",
  // Rol
  esAdmin = false,
  // Alertas
  alertasStockBajo = [],
  alertasVisible = false,
  // Handlers generales
  onBuscar,
  onCategoriaChange,
  onToggleAlertas,
  // Handlers navegación admin
  onIrUsuarios,
  onIrDocumentos,
  // Handlers producto
  onAbrirModalAgregar,
  onAbrirModalEditar,
  onCerrarModal,
  onFormProductoChange,
  onGuardarProducto,
  onEliminarProducto,
  // Handlers venta
  onAbrirModalVenta,
  onCerrarModalVenta,
  onFormVentaChange,
  onRegistrarVenta,
}) {
  return (
    <main className="inv">

      {/* ── HEADER ── */}
      <header className="inv__header">
        <div className="inv__header-info">
          <h1 className="inv__titulo">Control de <span>Inventario</span></h1>
          <p className="inv__subtitulo">
            Registra productos, controla el stock y gestiona tus ventas.
          </p>
        </div>
        <div className="inv__header-actions">
          <button
            className={`inv__btn-bell ${stockBajoCount > 0 ? "inv__btn-bell--active" : ""}`}
            onClick={onToggleAlertas}
            title="Alertas de stock bajo"
          >
            🔔
            {stockBajoCount > 0 && (
              <span className="inv__bell-badge">{stockBajoCount}</span>
            )}
          </button>

          {esAdmin && (
            <>
              <button className="inv__btn-secondary" onClick={onIrUsuarios}>
                👥 Usuarios
              </button>
              <button className="inv__btn-secondary" onClick={onIrDocumentos}>
                🗂️ Documentos
              </button>
              <button className="inv__btn-primary" onClick={onAbrirModalAgregar}>
                ＋ Nuevo Producto
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── PANEL ALERTAS ── */}
      {alertasVisible && (
        <div className="inv__alertas">
          <div className="inv__alertas-head">
            <span>⚠️ Productos con stock bajo</span>
            <button onClick={onToggleAlertas}>✕</button>
          </div>
          {alertasStockBajo.length === 0 ? (
            <p className="inv__alertas-none">Todos los productos tienen stock suficiente.</p>
          ) : (
            <div className="inv__alertas-list">
              {alertasStockBajo.map((p) => (
                <div key={p.id} className="inv__alerta-row">
                  <span className="inv__alerta-nombre">{p.nombre}</span>
                  <span className="inv__alerta-detalle">
                    Stock actual: <strong>{p.stock}</strong> — Mínimo: <strong>{p.stockMinimo}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STATS ── */}
      <section className="inv__stats">
        <div className="inv__stat">
          <div className="inv__stat-icon">📦</div>
          <div className="inv__stat-data">
            <span className="inv__stat-num">{totalProductos}</span>
            <span className="inv__stat-lbl">Total Productos</span>
          </div>
        </div>
        <div className="inv__stat inv__stat--warn">
          <div className="inv__stat-icon">⚠️</div>
          <div className="inv__stat-data">
            <span className="inv__stat-num">{stockBajoCount}</span>
            <span className="inv__stat-lbl">Stock Bajo</span>
          </div>
        </div>
        <div className="inv__stat inv__stat--green">
          <div className="inv__stat-icon">💰</div>
          <div className="inv__stat-data">
            <span className="inv__stat-num">${valorTotal.toLocaleString("es-CO")}</span>
            <span className="inv__stat-lbl">Valor en Inventario</span>
          </div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <section className="inv__filtros">
        <div className="inv__search-box">
          <span className="inv__search-ico">🔍</span>
          <input
            className="inv__search"
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
          />
          {busqueda && (
            <button className="inv__search-clear" onClick={() => onBuscar("")}>✕</button>
          )}
        </div>
        <div className="inv__cats">
          {["Todos", ...categorias].map((cat) => (
            <button
              key={cat}
              className={`inv__cat ${categoriaActiva === cat ? "inv__cat--on" : ""}`}
              onClick={() => onCategoriaChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── TABLA ── */}
      <section className="inv__table-section">
        {productos.length === 0 ? (
          <div className="inv__empty">
            <span className="inv__empty-ico">📭</span>
            <p>{busqueda ? "No se encontraron productos." : "No hay productos registrados aún."}</p>
            {!busqueda && esAdmin && (
              <button className="inv__btn-primary" onClick={onAbrirModalAgregar}>
                Agregar primer producto
              </button>
            )}
          </div>
        ) : (
          <div className="inv__scroll">
            <table className="inv__table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Mín.</th>
                  <th>Precio</th>
                  <th>Valor Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => {
                  const bajo = p.stock <= p.stockMinimo;
                  return (
                    <tr key={p.id} className={`inv__row ${bajo ? "inv__row--warn" : ""}`}>
                      <td><span className="inv__code">{p.codigo}</span></td>
                      <td><span className="inv__prod-name">{p.nombre}</span></td>
                      <td>{p.categoria}</td>
                      <td><span className={`inv__stock-num ${bajo ? "inv__stock-num--bajo" : ""}`}>{p.stock}</span></td>
                      <td>{p.stockMinimo}</td>
                      <td>${p.precio?.toLocaleString("es-CO")}</td>
                      <td>${(p.precio * p.stock)?.toLocaleString("es-CO")}</td>
                      <td>
                        <span className={`inv__badge ${bajo ? "inv__badge--bajo" : "inv__badge--ok"}`}>
                          {bajo ? "⚠ Bajo" : "✓ OK"}
                        </span>
                      </td>
                      <td>
                        <div className="inv__actions">
                          <button
                            className="inv__act inv__act--sell"
                            onClick={() => onAbrirModalVenta(p)}
                            title="Registrar venta"
                          >
                            🛒
                          </button>
                          {esAdmin && (
                            <button
                              className="inv__act inv__act--edit"
                              onClick={() => onAbrirModalEditar(p)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                          )}
                          {esAdmin && (
                            <button
                              className="inv__act inv__act--del"
                              onClick={() => onEliminarProducto(p.id)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── MODAL PRODUCTO ── */}
      {modalAbierto && (
        <div className="inv__overlay" onClick={onCerrarModal}>
          <div className="inv__modal" onClick={(e) => e.stopPropagation()}>
            <div className="inv__modal-head">
              <h2>{productoEditando ? "✏️ Editar Producto" : "＋ Nuevo Producto"}</h2>
              <button className="inv__modal-x" onClick={onCerrarModal}>✕</button>
            </div>
            <div className="inv__modal-body">
              {errorForm && <div className="inv__error">{errorForm}</div>}
              <div className="inv__grid">
                <div className="inv__field">
                  <label>Código *</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formProducto.codigo || ""}
                    onChange={onFormProductoChange}
                    placeholder="Ej: PRD-001"
                  />
                </div>
                <div className="inv__field">
                  <label>Categoría *</label>
                  <input
                    type="text"
                    name="categoria"
                    value={formProducto.categoria || ""}
                    onChange={onFormProductoChange}
                    placeholder="Ej: Insumos"
                  />
                </div>
                <div className="inv__field inv__field--full">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formProducto.nombre || ""}
                    onChange={onFormProductoChange}
                    placeholder="Nombre descriptivo del producto"
                  />
                </div>
                <div className="inv__field">
                  <label>Stock Actual *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formProducto.stock ?? ""}
                    onChange={onFormProductoChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="inv__field">
                  <label>Stock Mínimo *</label>
                  <input
                    type="number"
                    name="stockMinimo"
                    value={formProducto.stockMinimo ?? ""}
                    onChange={onFormProductoChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="inv__field">
                  <label>Precio Unitario ($) *</label>
                  <input
                    type="number"
                    name="precio"
                    value={formProducto.precio ?? ""}
                    onChange={onFormProductoChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="inv__field">
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formProducto.descripcion || ""}
                    onChange={onFormProductoChange}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
            <div className="inv__modal-foot">
              <button className="inv__btn-secondary" onClick={onCerrarModal}>Cancelar</button>
              <button className="inv__btn-primary" onClick={onGuardarProducto}>
                {productoEditando ? "Guardar Cambios" : "Crear Producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL VENTA ── */}
      {modalVentaAbierto && productoVenta && (
        <div className="inv__overlay" onClick={onCerrarModalVenta}>
          <div className="inv__modal inv__modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="inv__modal-head">
              <h2>🛒 Registrar Venta</h2>
              <button className="inv__modal-x" onClick={onCerrarModalVenta}>✕</button>
            </div>
            <div className="inv__modal-body">
              {errorVenta && <div className="inv__error">{errorVenta}</div>}
              <div className="inv__venta-prod">
                <span className="inv__venta-nombre">{productoVenta.nombre}</span>
                <span className="inv__venta-stock-disp">
                  Disponible: <strong>{productoVenta.stock}</strong> unidades
                </span>
              </div>
              <div className="inv__grid">
                <div className="inv__field">
                  <label>Cantidad *</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={formVenta.cantidad ?? ""}
                    onChange={onFormVentaChange}
                    min="1"
                    max={productoVenta.stock}
                    placeholder="0"
                  />
                </div>
                <div className="inv__field">
                  <label>Precio de venta ($)</label>
                  <input
                    type="number"
                    name="precioVenta"
                    value={formVenta.precioVenta ?? productoVenta.precio ?? ""}
                    onChange={onFormVentaChange}
                    min="0"
                  />
                </div>
                <div className="inv__field inv__field--full">
                  <label>Cliente (opcional)</label>
                  <input
                    type="text"
                    name="cliente"
                    value={formVenta.cliente || ""}
                    onChange={onFormVentaChange}
                    placeholder="Nombre del cliente"
                  />
                </div>
              </div>
              {formVenta.cantidad > 0 && (
                <div className="inv__venta-total">
                  Total: <strong>
                    ${(
                      (Number(formVenta.precioVenta) || productoVenta.precio) *
                      Number(formVenta.cantidad)
                    ).toLocaleString("es-CO")}
                  </strong>
                </div>
              )}
            </div>
            <div className="inv__modal-foot">
              <button className="inv__btn-secondary" onClick={onCerrarModalVenta}>Cancelar</button>
              <button className="inv__btn-primary" onClick={onRegistrarVenta}>
                Confirmar Venta
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}