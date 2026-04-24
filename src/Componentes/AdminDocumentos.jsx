
import "../style/AdminDocumetos.css";

const TIPO_BADGE = {
  Factura: "factura",
  Recibo: "recibo",
  Contrato: "contrato",
  Otro: "otro",
};

export default function AdminDocumentos({
 
  documentos = [],
  busqueda = "",
  filtroTipo = "Todos",
  totalDocs = 0,
  totalFacturas = 0,
  totalSize = "",
  
  modalAbierto = false,
  formDoc = {},
  errorForm = "",
  archivoNombre = "",
  
  onBuscar,
  onFiltroTipoChange,
  onAbrirModal,
  onCerrarModal,
  onFormChange,
  onArchivoChange,
  onSubir,
  onDescargar,
  onEliminar,
}) {
  return (
    <main className="ad">

      
      <header className="ad__header">
        <div>
          <h1 className="ad__titulo">Documentos y <span>Facturas</span></h1>
          <p className="ad__subtitulo">Almacena, organiza y descarga tus documentos contables.</p>
        </div>
        <button className="ad__btn-primary" onClick={onAbrirModal}>
          ⬆ Subir Documento
        </button>
      </header>

     
      <section className="ad__stats">
        <div className="ad__stat">
          <span className="ad__stat-icon">📁</span>
          <div>
            <span className="ad__stat-num">{totalDocs}</span>
            <span className="ad__stat-lbl">Documentos</span>
          </div>
        </div>
        <div className="ad__stat ad__stat--factura">
          <span className="ad__stat-icon">🧾</span>
          <div>
            <span className="ad__stat-num">{totalFacturas}</span>
            <span className="ad__stat-lbl">Facturas</span>
          </div>
        </div>
        <div className="ad__stat ad__stat--size">
          <span className="ad__stat-icon">💾</span>
          <div>
            <span className="ad__stat-num">{totalSize}</span>
            <span className="ad__stat-lbl">Almacenamiento</span>
          </div>
        </div>
      </section>

      
      <section className="ad__filtros">
        <div className="ad__search-box">
          <span className="ad__search-ico">🔍</span>
          <input
            className="ad__search"
            type="text"
            placeholder="Buscar documento..."
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
          />
          {busqueda && (
            <button className="ad__search-clear" onClick={() => onBuscar("")}>✕</button>
          )}
        </div>
        <div className="ad__tipos">
          {["Todos", "Factura", "Recibo", "Contrato", "Otro"].map((t) => (
            <button
              key={t}
              className={`ad__tipo-btn ${filtroTipo === t ? "ad__tipo-btn--on" : ""}`}
              onClick={() => onFiltroTipoChange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

     
      <section className="ad__docs-section">
        {documentos.length === 0 ? (
          <div className="ad__empty">
            <span>📭</span>
            <p>{busqueda ? "No se encontraron documentos." : "No hay documentos almacenados."}</p>
            {!busqueda && (
              <button className="ad__btn-primary" onClick={onAbrirModal}>
                Subir primer documento
              </button>
            )}
          </div>
        ) : (
          <div className="ad__grid">
            {documentos.map((doc) => (
              <div key={doc.id} className="ad__card">
                <div className="ad__card-icon">
                  {doc.tipo === "Factura"  ? "🧾" :
                   doc.tipo === "Recibo"   ? "📄" :
                   doc.tipo === "Contrato" ? "📋" : "📎"}
                </div>
                <div className="ad__card-info">
                  <span className="ad__card-nombre">{doc.nombre}</span>
                  <span className="ad__card-meta">
                    {doc.fecha} · {doc.size}
                  </span>
                  {doc.descripcion && (
                    <span className="ad__card-desc">{doc.descripcion}</span>
                  )}
                </div>
                <div className="ad__card-badge-wrap">
                  <span className={`ad__badge ad__badge--${TIPO_BADGE[doc.tipo] || "otro"}`}>
                    {doc.tipo}
                  </span>
                </div>
                <div className="ad__card-actions">
                  <button
                    className="ad__act ad__act--dl"
                    onClick={() => onDescargar(doc)}
                    title="Descargar"
                  >
                    ⬇️
                  </button>
                  <button
                    className="ad__act ad__act--del"
                    onClick={() => onEliminar(doc.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      
      {modalAbierto && (
        <div className="ad__overlay" onClick={onCerrarModal}>
          <div className="ad__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad__modal-head">
              <h2>⬆ Subir Documento</h2>
              <button className="ad__modal-x" onClick={onCerrarModal}>✕</button>
            </div>
            <div className="ad__modal-body">
              {errorForm && <div className="ad__error">{errorForm}</div>}
              <div className="ad__form-grid">
                <div className="ad__field ad__field--full">
                  <label>Nombre del documento *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formDoc.nombre || ""}
                    onChange={onFormChange}
                    placeholder="Ej: Factura Proveedor Enero 2025"
                  />
                </div>
                <div className="ad__field">
                  <label>Tipo *</label>
                  <select name="tipo" value={formDoc.tipo || ""} onChange={onFormChange} className="ad__select">
                    <option value="">Seleccionar tipo...</option>
                    <option value="Factura">Factura</option>
                    <option value="Recibo">Recibo</option>
                    <option value="Contrato">Contrato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="ad__field">
                  <label>Fecha del documento</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formDoc.fecha || ""}
                    onChange={onFormChange}
                  />
                </div>
                <div className="ad__field ad__field--full">
                  <label>Descripción (opcional)</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formDoc.descripcion || ""}
                    onChange={onFormChange}
                    placeholder="Breve descripción del documento"
                  />
                </div>
                <div className="ad__field ad__field--full">
                  <label>Archivo * (PDF, JPG, PNG, Excel)</label>
                  <label className="ad__file-label">
                    <span className="ad__file-icon">📎</span>
                    <span>{archivoNombre || "Haz clic para seleccionar archivo..."}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                      onChange={onArchivoChange}
                      className="ad__file-input"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="ad__modal-foot">
              <button className="ad__btn-secondary" onClick={onCerrarModal}>Cancelar</button>
              <button className="ad__btn-primary" onClick={onSubir}>
                Subir Documento
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}