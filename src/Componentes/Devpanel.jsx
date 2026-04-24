// Componentes/DevPanel.jsx
// Solo JSX. Sin lógica ni estados.

import "../style/DevPanel.css";

const ESTADO_CLASS = { Activa: "activa", Inactiva: "inactiva", Pendiente: "pendiente" };

export default function DevPanel({
  // Vista activa: "empresas" | "solicitudes" | "usuarios"
  vistaActiva = "empresas",
  onCambiarVista,

  // ── Empresas ──
  empresas = [],
  busquedaEmpresa = "",
  onBuscarEmpresa,
  onVerUsuarios,
  onAbrirModalEmpresa,
  onEditarEmpresa,
  onEliminarEmpresa,

  // ── Solicitudes de contacto ──
  solicitudes = [],
  busquedaSolicitud = "",
  onBuscarSolicitud,
  onAprobarSolicitud,
  onRechazarSolicitud,

  // ── Usuarios de empresa seleccionada ──
  empresaSeleccionada = null,
  usuariosEmpresa = [],
  onVolverEmpresas,
  passwordsVisibles = {},
  onTogglePassword,

  // ── Stats ──
  totalEmpresas = 0,
  totalActivas = 0,
  totalSolicitudes = 0,

  // ── Modal empresa ──
  modalAbierto = false,
  empresaEditando = null,
  formEmpresa = {},
  errorForm = "",
  onCerrarModal,
  onFormEmpresaChange,
  onGuardarEmpresa,
}) {
  return (
    <main className="dev">

      {/* ── HEADER ── */}
      <header className="dev__header">
        <div className="dev__header-left">
          <div className="dev__header-badge">DEV TEAM</div>
          <div>
            <h1 className="dev__titulo">Panel de <span>Administración</span></h1>
            <p className="dev__subtitulo">Gestión global de empresas y cuentas del sistema.</p>
          </div>
        </div>
        {vistaActiva === "empresas" && (
          <button className="dev__btn-primary" onClick={onAbrirModalEmpresa}>
            ＋ Nueva Empresa
          </button>
        )}
        {vistaActiva === "usuarios" && (
          <button className="dev__btn-secondary" onClick={onVolverEmpresas}>
            ← Volver a Empresas
          </button>
        )}
      </header>

      {/* ── STATS ── */}
      <section className="dev__stats">
        <div className="dev__stat">
          <span className="dev__stat-icon">🏢</span>
          <div>
            <span className="dev__stat-num">{totalEmpresas}</span>
            <span className="dev__stat-lbl">Empresas Registradas</span>
          </div>
        </div>
        <div className="dev__stat dev__stat--green">
          <span className="dev__stat-icon">✅</span>
          <div>
            <span className="dev__stat-num">{totalActivas}</span>
            <span className="dev__stat-lbl">Empresas Activas</span>
          </div>
        </div>
        <div className="dev__stat dev__stat--gold">
          <span className="dev__stat-icon">📨</span>
          <div>
            <span className="dev__stat-num">{totalSolicitudes}</span>
            <span className="dev__stat-lbl">Solicitudes Pendientes</span>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <div className="dev__tabs">
        <button
          className={`dev__tab ${vistaActiva === "empresas" ? "dev__tab--on" : ""}`}
          onClick={() => onCambiarVista("empresas")}
        >
          🏢 Empresas
        </button>
        <button
          className={`dev__tab ${vistaActiva === "solicitudes" ? "dev__tab--on" : ""}`}
          onClick={() => onCambiarVista("solicitudes")}
        >
          📨 Solicitudes
          {totalSolicitudes > 0 && (
            <span className="dev__tab-badge">{totalSolicitudes}</span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════
          VISTA: EMPRESAS
      ══════════════════════════════════════════ */}
      {vistaActiva === "empresas" && (
        <section className="dev__section">
          <div className="dev__search-box">
            <span className="dev__search-ico">🔍</span>
            <input
              className="dev__search"
              type="text"
              placeholder="Buscar empresa por nombre o NIT..."
              value={busquedaEmpresa}
              onChange={(e) => onBuscarEmpresa(e.target.value)}
            />
            {busquedaEmpresa && (
              <button className="dev__search-clear" onClick={() => onBuscarEmpresa("")}>✕</button>
            )}
          </div>

          {empresas.length === 0 ? (
            <div className="dev__empty">
              <span>🏢</span>
              <p>{busquedaEmpresa ? "No se encontraron empresas." : "No hay empresas registradas aún."}</p>
              {!busquedaEmpresa && (
                <button className="dev__btn-primary" onClick={onAbrirModalEmpresa}>
                  Registrar primera empresa
                </button>
              )}
            </div>
          ) : (
            <div className="dev__scroll">
              <table className="dev__table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>NIT</th>
                    <th>Correo contacto</th>
                    <th>Teléfono</th>
                    <th>Usuarios</th>
                    <th>Fecha registro</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((e) => (
                    <tr key={e.id} className="dev__row">
                      <td>
                        <div className="dev__empresa-cell">
                          <div className="dev__empresa-avatar">
                            {e.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="dev__empresa-nombre">{e.nombre}</span>
                            <span className="dev__empresa-sector">{e.sector}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="dev__nit">{e.nit}</span></td>
                      <td className="dev__correo">{e.correo}</td>
                      <td>{e.telefono}</td>
                      <td>
                        <button
                          className="dev__usuarios-link"
                          onClick={() => onVerUsuarios(e)}
                        >
                          👥 {e.cantidadUsuarios}
                        </button>
                      </td>
                      <td className="dev__fecha">{e.fechaRegistro}</td>
                      <td>
                        <span className={`dev__badge dev__badge--${ESTADO_CLASS[e.estado] || "inactiva"}`}>
                          {e.estado}
                        </span>
                      </td>
                      <td>
                        <div className="dev__actions">
                          <button
                            className="dev__act dev__act--edit"
                            onClick={() => onEditarEmpresa(e)}
                            title="Editar empresa"
                          >
                            ✏️
                          </button>
                          <button
                            className="dev__act dev__act--del"
                            onClick={() => onEliminarEmpresa(e.id)}
                            title="Eliminar empresa"
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
      )}

      {/* ══════════════════════════════════════════
          VISTA: SOLICITUDES DE CONTACTO
      ══════════════════════════════════════════ */}
      {vistaActiva === "solicitudes" && (
        <section className="dev__section">
          <div className="dev__search-box">
            <span className="dev__search-ico">🔍</span>
            <input
              className="dev__search"
              type="text"
              placeholder="Buscar solicitud..."
              value={busquedaSolicitud}
              onChange={(e) => onBuscarSolicitud(e.target.value)}
            />
            {busquedaSolicitud && (
              <button className="dev__search-clear" onClick={() => onBuscarSolicitud("")}>✕</button>
            )}
          </div>

          {solicitudes.length === 0 ? (
            <div className="dev__empty">
              <span>📭</span>
              <p>No hay solicitudes pendientes.</p>
            </div>
          ) : (
            <div className="dev__solicitudes-grid">
              {solicitudes.map((s) => (
                <div key={s.id} className="dev__solicitud-card">
                  <div className="dev__solicitud-head">
                    <div className="dev__empresa-avatar">{s.empresa.charAt(0).toUpperCase()}</div>
                    <div>
                      <span className="dev__empresa-nombre">{s.empresa}</span>
                      <span className="dev__solicitud-fecha">{s.fecha}</span>
                    </div>
                    <span className="dev__badge dev__badge--pendiente">Pendiente</span>
                  </div>
                  <div className="dev__solicitud-datos">
                    <div className="dev__solicitud-dato">
                      <span className="dev__solicitud-lbl">Contacto</span>
                      <span>{s.contacto}</span>
                    </div>
                    <div className="dev__solicitud-dato">
                      <span className="dev__solicitud-lbl">Correo</span>
                      <span>{s.correo}</span>
                    </div>
                    <div className="dev__solicitud-dato">
                      <span className="dev__solicitud-lbl">Teléfono</span>
                      <span>{s.telefono}</span>
                    </div>
                    <div className="dev__solicitud-dato">
                      <span className="dev__solicitud-lbl">NIT</span>
                      <span>{s.nit}</span>
                    </div>
                  </div>
                  {s.mensaje && (
                    <p className="dev__solicitud-msg">"{s.mensaje}"</p>
                  )}
                  <div className="dev__solicitud-actions">
                    <button
                      className="dev__btn-aprobar"
                      onClick={() => onAprobarSolicitud(s)}
                    >
                      ✓ Aprobar y crear cuenta
                    </button>
                    <button
                      className="dev__btn-rechazar"
                      onClick={() => onRechazarSolicitud(s.id)}
                    >
                      ✕ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════
          VISTA: USUARIOS DE EMPRESA
      ══════════════════════════════════════════ */}
      {vistaActiva === "usuarios" && empresaSeleccionada && (
        <section className="dev__section">
          <div className="dev__usuarios-header">
            <div className="dev__empresa-avatar dev__empresa-avatar--lg">
              {empresaSeleccionada.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="dev__usuarios-titulo">{empresaSeleccionada.nombre}</h2>
              <span className="dev__usuarios-sub">NIT: {empresaSeleccionada.nit} · {usuariosEmpresa.length} usuarios registrados</span>
            </div>
          </div>

          {usuariosEmpresa.length === 0 ? (
            <div className="dev__empty">
              <span>👤</span>
              <p>Esta empresa no tiene usuarios registrados.</p>
            </div>
          ) : (
            <div className="dev__scroll">
              <table className="dev__table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Contraseña</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha registro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosEmpresa.map((u) => (
                    <tr key={u.id} className="dev__row">
                      <td>
                        <div className="dev__user-cell">
                          <div className="dev__user-avatar">
                            {u.nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="dev__user-nombre">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="dev__correo">{u.correo}</td>
                      <td>
                        <div className="dev__password-cell">
                          <span className="dev__password-text">
                            {passwordsVisibles[u.id] ? u.password : "••••••••"}
                          </span>
                          <button
                            className="dev__password-toggle"
                            onClick={() => onTogglePassword(u.id)}
                            title={passwordsVisibles[u.id] ? "Ocultar" : "Revelar"}
                          >
                            {passwordsVisibles[u.id] ? "🙈" : "👁"}
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`dev__badge ${u.rol === "Administrador" ? "dev__badge--admin" : "dev__badge--vendedor"}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`dev__estado ${u.activo ? "dev__estado--on" : "dev__estado--off"}`}>
                          {u.activo ? "● Activo" : "● Inactivo"}
                        </span>
                      </td>
                      <td className="dev__fecha">{u.fechaRegistro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── MODAL CREAR / EDITAR EMPRESA ── */}
      {modalAbierto && (
        <div className="dev__overlay" onClick={onCerrarModal}>
          <div className="dev__modal" onClick={(e) => e.stopPropagation()}>
            <div className="dev__modal-head">
              <h2>{empresaEditando ? "✏️ Editar Empresa" : "🏢 Registrar Empresa"}</h2>
              <button className="dev__modal-x" onClick={onCerrarModal}>✕</button>
            </div>
            <div className="dev__modal-body">
              {errorForm && <div className="dev__error">{errorForm}</div>}
              <div className="dev__grid">
                <div className="dev__field dev__field--full">
                  <label>Nombre de la empresa *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formEmpresa.nombre || ""}
                    onChange={onFormEmpresaChange}
                    placeholder="Razón social"
                  />
                </div>
                <div className="dev__field">
                  <label>NIT *</label>
                  <input
                    type="text"
                    name="nit"
                    value={formEmpresa.nit || ""}
                    onChange={onFormEmpresaChange}
                    placeholder="000000000-0"
                  />
                </div>
                <div className="dev__field">
                  <label>Sector</label>
                  <input
                    type="text"
                    name="sector"
                    value={formEmpresa.sector || ""}
                    onChange={onFormEmpresaChange}
                    placeholder="Ej: Comercio, Salud..."
                  />
                </div>
                <div className="dev__field">
                  <label>Correo de contacto *</label>
                  <input
                    type="email"
                    name="correo"
                    value={formEmpresa.correo || ""}
                    onChange={onFormEmpresaChange}
                    placeholder="correo@empresa.com"
                  />
                </div>
                <div className="dev__field">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formEmpresa.telefono || ""}
                    onChange={onFormEmpresaChange}
                    placeholder="+57 300 000 0000"
                  />
                </div>
                <div className="dev__field">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formEmpresa.ciudad || ""}
                    onChange={onFormEmpresaChange}
                    placeholder="Bogotá, Medellín..."
                  />
                </div>
                <div className="dev__field">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formEmpresa.estado || "Activa"}
                    onChange={onFormEmpresaChange}
                    className="dev__select"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div className="dev__field dev__field--full">
                  <label>Notas internas</label>
                  <input
                    type="text"
                    name="notas"
                    value={formEmpresa.notas || ""}
                    onChange={onFormEmpresaChange}
                    placeholder="Observaciones del equipo dev (opcional)"
                  />
                </div>
              </div>
            </div>
            <div className="dev__modal-foot">
              <button className="dev__btn-secondary" onClick={onCerrarModal}>Cancelar</button>
              <button className="dev__btn-primary" onClick={onGuardarEmpresa}>
                {empresaEditando ? "Guardar Cambios" : "Registrar Empresa"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}