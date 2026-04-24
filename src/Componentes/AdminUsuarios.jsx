// Componentes/AdminUsuarios.jsx
// Solo JSX. Sin lógica ni estados.

import "../style/AdminUsuarios.css";

const ROL_BADGE = { Administrador: "admin", Vendedor: "vendedor" };

const TABS = [
  { id: "usuarios",    icon: "👥", label: "Usuarios"    },
  { id: "nomina",      icon: "💵", label: "Nómina"      },
  { id: "gastos",      icon: "💸", label: "Gastos"      },
  { id: "proveedores", icon: "🏭", label: "Proveedores" },
  { id: "servicios",   icon: "🔧", label: "Servicios"   },
  { id: "arriendo",    icon: "🏢", label: "Arriendo"    },
];

export default function AdminUsuarios({
  // Tab activo
  tabActivo = "usuarios",
  onCambiarTab,

  // ── Usuarios ──
  usuarios = [],
  busqueda = "",
  filtroRol = "Todos",
  totalUsuarios = 0,
  totalAdmins = 0,
  totalVendedores = 0,
  modalAbierto = false,
  usuarioEditando = null,
  formUsuario = {},
  errorFormUsuario = "",
  modalEliminarAbierto = false,
  usuarioAEliminar = null,
  onBuscar,
  onFiltroRolChange,
  onAbrirModalAgregar,
  onAbrirModalEditar,
  onCerrarModal,
  onFormChange,
  onGuardar,
  onAbrirConfirmarEliminar,
  onCerrarConfirmarEliminar,
  onConfirmarEliminar,

  // ── Nómina ──
  nominas = [],
  modalNominaAbierto = false,
  nominaEditando = null,
  formNomina = {},
  errorFormNomina = "",
  totalNominaCalculado = 0,
  onAbrirModalNomina,
  onAbrirEditarNomina,
  onCerrarModalNomina,
  onFormNominaChange,
  onGuardarNomina,
  onEliminarNomina,

  // ── Gastos ──
  gastos = [],
  modalGastoAbierto = false,
  gastoEditando = null,
  formGasto = {},
  errorFormGasto = "",
  onAbrirModalGasto,
  onAbrirEditarGasto,
  onCerrarModalGasto,
  onFormGastoChange,
  onGuardarGasto,
  onEliminarGasto,

  // ── Proveedores ──
  proveedores = [],
  modalProvAbierto = false,
  provEditando = null,
  formProv = {},
  errorFormProv = "",
  onAbrirModalProv,
  onAbrirEditarProv,
  onCerrarModalProv,
  onFormProvChange,
  onGuardarProv,
  onEliminarProv,

  // ── Servicios ──
  servicios = [],
  modalServAbierto = false,
  servEditando = null,
  formServ = {},
  errorFormServ = "",
  archivoServNombre = "",
  onAbrirModalServ,
  onAbrirEditarServ,
  onCerrarModalServ,
  onFormServChange,
  onArchivoServChange,
  onGuardarServ,
  onEliminarServ,
  onDescargarServ,

  // ── Arriendo ──
  arriendos = [],
  modalArriendoAbierto = false,
  arriendoEditando = null,
  formArriendo = {},
  errorFormArriendo = "",
  onAbrirModalArriendo,
  onAbrirEditarArriendo,
  onCerrarModalArriendo,
  onFormArriendoChange,
  onGuardarArriendo,
  onEliminarArriendo,
}) {
  return (
    <main className="au">

      {/* ── HEADER ── */}
      <header className="au__header">
        <div>
          <h1 className="au__titulo">Panel de <span>Administración</span></h1>
          <p className="au__subtitulo">Gestiona usuarios, nómina, gastos, proveedores y más.</p>
        </div>
        {tabActivo === "usuarios"    && <button className="au__btn-primary" onClick={onAbrirModalAgregar}>＋ Nuevo Usuario</button>}
        {tabActivo === "nomina"      && <button className="au__btn-primary" onClick={onAbrirModalNomina}>＋ Agregar Empleado</button>}
        {tabActivo === "gastos"      && <button className="au__btn-primary" onClick={onAbrirModalGasto}>＋ Registrar Gasto</button>}
        {tabActivo === "proveedores" && <button className="au__btn-primary" onClick={onAbrirModalProv}>＋ Nuevo Proveedor</button>}
        {tabActivo === "servicios"   && <button className="au__btn-primary" onClick={onAbrirModalServ}>⬆ Subir Servicio</button>}
        {tabActivo === "arriendo"    && <button className="au__btn-primary" onClick={onAbrirModalArriendo}>＋ Registrar Arriendo</button>}
      </header>

      {/* ── TABS ── */}
      <div className="au__tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`au__tab ${tabActivo === t.id ? "au__tab--on" : ""}`} onClick={() => onCambiarTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════
          TAB: USUARIOS
      ══════════════════════════════════ */}
      {tabActivo === "usuarios" && (
        <section className="au__section">
          <div className="au__stats">
            <div className="au__stat"><span className="au__stat-icon">👥</span><div><span className="au__stat-num">{totalUsuarios}</span><span className="au__stat-lbl">Total</span></div></div>
            <div className="au__stat au__stat--admin"><span className="au__stat-icon">🔐</span><div><span className="au__stat-num">{totalAdmins}</span><span className="au__stat-lbl">Admins</span></div></div>
            <div className="au__stat au__stat--vendedor"><span className="au__stat-icon">🛒</span><div><span className="au__stat-num">{totalVendedores}</span><span className="au__stat-lbl">Vendedores</span></div></div>
          </div>
          <div className="au__filtros">
            <div className="au__search-box">
              <span className="au__search-ico">🔍</span>
              <input className="au__search" type="text" placeholder="Buscar por nombre o correo..." value={busqueda} onChange={(e) => onBuscar(e.target.value)} />
              {busqueda && <button className="au__search-clear" onClick={() => onBuscar("")}>✕</button>}
            </div>
            <div className="au__roles-filter">
              {["Todos", "Administrador", "Vendedor"].map((rol) => (
                <button key={rol} className={`au__rol-btn ${filtroRol === rol ? "au__rol-btn--on" : ""}`} onClick={() => onFiltroRolChange(rol)}>{rol}</button>
              ))}
            </div>
          </div>
          <div className="au__table-section">
            {usuarios.length === 0 ? (
              <div className="au__empty"><span>👤</span><p>No hay usuarios registrados.</p></div>
            ) : (
              <div className="au__scroll">
                <table className="au__table">
                  <thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Fecha Registro</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="au__row">
                        <td><div className="au__user-cell"><div className="au__avatar">{u.nombre.charAt(0).toUpperCase()}</div><span className="au__user-nombre">{u.nombre}</span></div></td>
                        <td className="au__email">{u.correo}</td>
                        <td><span className={`au__badge au__badge--${ROL_BADGE[u.rol] || "default"}`}>{u.rol}</span></td>
                        <td><span className={`au__estado ${u.activo ? "au__estado--on" : "au__estado--off"}`}>{u.activo ? "● Activo" : "● Inactivo"}</span></td>
                        <td className="au__fecha">{u.fechaRegistro}</td>
                        <td><div className="au__actions">
                          <button className="au__act au__act--edit" onClick={() => onAbrirModalEditar(u)}>✏️</button>
                          <button className="au__act au__act--del" onClick={() => onAbrirConfirmarEliminar(u)}>🗑️</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          TAB: NÓMINA
      ══════════════════════════════════ */}
      {tabActivo === "nomina" && (
        <section className="au__section">
          <div className="au__table-section">
            {nominas.length === 0 ? (
              <div className="au__empty"><span>💵</span><p>No hay empleados en nómina.</p></div>
            ) : (
              <div className="au__scroll">
                <table className="au__table">
                  <thead>
                    <tr>
                      <th>Empleado</th><th>Cargo</th><th>Salario Base</th>
                      <th>Hrs. Extra</th><th>Recargos</th><th>Deducciones</th>
                      <th>Total a Pagar</th><th>Fecha Pago</th><th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nominas.map((n) => (
                      <tr key={n.id} className="au__row">
                        <td><span className="au__user-nombre">{n.nombre}</span></td>
                        <td>{n.cargo}</td>
                        <td>${Number(n.salarioBase).toLocaleString("es-CO")}</td>
                        <td>${Number(n.horasExtras || 0).toLocaleString("es-CO")}</td>
                        <td>${Number(n.recargos || 0).toLocaleString("es-CO")}</td>
                        <td className="au__nomina-deduccion">-${Number(n.deducciones || 0).toLocaleString("es-CO")}</td>
                        <td><strong className="au__nomina-total">${Number(n.totalPagar).toLocaleString("es-CO")}</strong></td>
                        <td className="au__fecha">{n.fechaPago}</td>
                        <td><div className="au__actions">
                          <button className="au__act au__act--edit" onClick={() => onAbrirEditarNomina(n)}>✏️</button>
                          <button className="au__act au__act--del" onClick={() => onEliminarNomina(n.id)}>🗑️</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          TAB: GASTOS
      ══════════════════════════════════ */}
      {tabActivo === "gastos" && (
        <section className="au__section">
          <div className="au__table-section">
            {gastos.length === 0 ? (
              <div className="au__empty"><span>💸</span><p>No hay gastos registrados.</p></div>
            ) : (
              <div className="au__scroll">
                <table className="au__table">
                  <thead><tr><th>Descripción</th><th>Categoría</th><th>Monto</th><th>Fecha</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {gastos.map((g) => (
                      <tr key={g.id} className="au__row">
                        <td><span className="au__user-nombre">{g.descripcion}</span></td>
                        <td>{g.categoria}</td>
                        <td>${Number(g.monto).toLocaleString("es-CO")}</td>
                        <td className="au__fecha">{g.fecha}</td>
                        <td><div className="au__actions">
                          <button className="au__act au__act--edit" onClick={() => onAbrirEditarGasto(g)}>✏️</button>
                          <button className="au__act au__act--del" onClick={() => onEliminarGasto(g.id)}>🗑️</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          TAB: PROVEEDORES
      ══════════════════════════════════ */}
      {tabActivo === "proveedores" && (
        <section className="au__section">
          <div className="au__table-section">
            {proveedores.length === 0 ? (
              <div className="au__empty"><span>🏭</span><p>No hay proveedores registrados.</p></div>
            ) : (
              <div className="au__scroll">
                <table className="au__table">
                  <thead><tr><th>Nombre</th><th>NIT/Cédula</th><th>Teléfono</th><th>Correo</th><th>Tipo</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {proveedores.map((p) => (
                      <tr key={p.id} className="au__row">
                        <td><span className="au__user-nombre">{p.nombre}</span></td>
                        <td className="au__email">{p.nit}</td>
                        <td>{p.telefono}</td>
                        <td className="au__email">{p.correo}</td>
                        <td><span className="au__badge au__badge--admin">{p.tipo}</span></td>
                        <td><div className="au__actions">
                          <button className="au__act au__act--edit" onClick={() => onAbrirEditarProv(p)}>✏️</button>
                          <button className="au__act au__act--del" onClick={() => onEliminarProv(p.id)}>🗑️</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          TAB: SERVICIOS
      ══════════════════════════════════ */}
      {tabActivo === "servicios" && (
        <section className="au__section">
          <div className="au__table-section">
            {servicios.length === 0 ? (
              <div className="au__empty"><span>🔧</span><p>No hay servicios registrados.</p></div>
            ) : (
              <div className="au__scroll">
                <table className="au__table">
                  <thead><tr><th>Servicio</th><th>Tipo</th><th>Monto</th><th>Fecha</th><th>Recibo</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {servicios.map((s) => (
                      <tr key={s.id} className="au__row">
                        <td><span className="au__user-nombre">{s.nombre}</span></td>
                        <td><span className="au__badge au__badge--vendedor">{s.tipo}</span></td>
                        <td>${Number(s.monto || 0).toLocaleString("es-CO")}</td>
                        <td className="au__fecha">{s.fecha}</td>
                        <td>
                          {s.archivoUrl ? (
                            <button className="au__act au__act--edit" onClick={() => onDescargarServ(s)} title="Descargar recibo">⬇️</button>
                          ) : (
                            <span className="au__sin-archivo">Sin archivo</span>
                          )}
                        </td>
                        <td><div className="au__actions">
                          <button className="au__act au__act--edit" onClick={() => onAbrirEditarServ(s)}>✏️</button>
                          <button className="au__act au__act--del" onClick={() => onEliminarServ(s.id)}>🗑️</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          TAB: ARRIENDO
      ══════════════════════════════════ */}
      {tabActivo === "arriendo" && (
        <section className="au__section">
          <div className="au__table-section">
            {arriendos.length === 0 ? (
              <div className="au__empty"><span>🏢</span><p>No hay arriendos registrados.</p></div>
            ) : (
              <div className="au__scroll">
                <table className="au__table">
                  <thead><tr><th>Descripción</th><th>Arrendador</th><th>Valor Mensual</th><th>Fecha Pago</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {arriendos.map((a) => (
                      <tr key={a.id} className="au__row">
                        <td><span className="au__user-nombre">{a.descripcion}</span></td>
                        <td>{a.arrendador}</td>
                        <td>${Number(a.valorMensual).toLocaleString("es-CO")}</td>
                        <td className="au__fecha">{a.fechaPago}</td>
                        <td><span className={`au__estado ${a.activo ? "au__estado--on" : "au__estado--off"}`}>{a.activo ? "● Activo" : "● Inactivo"}</span></td>
                        <td><div className="au__actions">
                          <button className="au__act au__act--edit" onClick={() => onAbrirEditarArriendo(a)}>✏️</button>
                          <button className="au__act au__act--del" onClick={() => onEliminarArriendo(a.id)}>🗑️</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          MODALES
      ══════════════════════════════════ */}

      {/* Modal Usuario */}
      {modalAbierto && (
        <div className="au__overlay" onClick={onCerrarModal}>
          <div className="au__modal" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head">
              <h2>{usuarioEditando ? "✏️ Editar Usuario" : "＋ Registrar Usuario"}</h2>
              <button className="au__modal-x" onClick={onCerrarModal}>✕</button>
            </div>
            <div className="au__modal-body">
              {errorFormUsuario && <div className="au__error">{errorFormUsuario}</div>}
              <div className="au__grid">
                <div className="au__field au__field--full"><label>Nombre completo *</label><input type="text" name="nombre" value={formUsuario.nombre || ""} onChange={onFormChange} placeholder="Nombre y apellido" /></div>
                <div className="au__field au__field--full"><label>Correo electrónico *</label><input type="email" name="correo" value={formUsuario.correo || ""} onChange={onFormChange} placeholder="correo@empresa.com" /></div>
                {!usuarioEditando && (<>
                  <div className="au__field"><label>Contraseña *</label><input type="password" name="contrasena" value={formUsuario.contrasena || ""} onChange={onFormChange} placeholder="Mínimo 8 caracteres" /></div>
                  <div className="au__field"><label>Confirmar contraseña *</label><input type="password" name="confirmarContrasena" value={formUsuario.confirmarContrasena || ""} onChange={onFormChange} placeholder="Repite la contraseña" /></div>
                </>)}
                <div className="au__field"><label>Rol *</label>
                  <select name="rol" value={formUsuario.rol || ""} onChange={onFormChange} className="au__select">
                    <option value="">Seleccionar rol...</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                  </select>
                </div>
                <div className="au__field"><label>Estado</label>
                  <select name="activo" value={formUsuario.activo !== undefined ? String(formUsuario.activo) : "true"} onChange={onFormChange} className="au__select">
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarModal}>Cancelar</button>
              <button className="au__btn-primary" onClick={onGuardar}>{usuarioEditando ? "Guardar Cambios" : "Registrar Usuario"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar Usuario */}
      {modalEliminarAbierto && usuarioAEliminar && (
        <div className="au__overlay" onClick={onCerrarConfirmarEliminar}>
          <div className="au__modal au__modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head"><h2>🗑️ Eliminar Usuario</h2><button className="au__modal-x" onClick={onCerrarConfirmarEliminar}>✕</button></div>
            <div className="au__modal-body">
              <div className="au__confirm-info">
                <div className="au__avatar au__avatar--lg">{usuarioAEliminar.nombre.charAt(0).toUpperCase()}</div>
                <div><p className="au__confirm-nombre">{usuarioAEliminar.nombre}</p><p className="au__confirm-correo">{usuarioAEliminar.correo}</p></div>
              </div>
              <p className="au__confirm-msg">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarConfirmarEliminar}>Cancelar</button>
              <button className="au__btn-danger" onClick={onConfirmarEliminar}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nómina */}
      {modalNominaAbierto && (
        <div className="au__overlay" onClick={onCerrarModalNomina}>
          <div className="au__modal" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head">
              <h2>{nominaEditando ? "✏️ Editar Empleado" : "＋ Agregar Empleado"}</h2>
              <button className="au__modal-x" onClick={onCerrarModalNomina}>✕</button>
            </div>
            <div className="au__modal-body">
              {errorFormNomina && <div className="au__error">{errorFormNomina}</div>}
              <div className="au__grid">
                <div className="au__field au__field--full"><label>Nombre del empleado *</label><input type="text" name="nombre" value={formNomina.nombre || ""} onChange={onFormNominaChange} placeholder="Nombre completo" /></div>
                <div className="au__field"><label>Cargo *</label><input type="text" name="cargo" value={formNomina.cargo || ""} onChange={onFormNominaChange} placeholder="Ej: Vendedor, Contador" /></div>
                <div className="au__field"><label>Fecha de Pago *</label><input type="date" name="fechaPago" value={formNomina.fechaPago || ""} onChange={onFormNominaChange} /></div>
                <div className="au__field"><label>Salario Base *</label><input type="number" name="salarioBase" value={formNomina.salarioBase || ""} onChange={onFormNominaChange} placeholder="0" min="0" /></div>
                <div className="au__field"><label>Horas Extra (valor $)</label><input type="number" name="horasExtras" value={formNomina.horasExtras || ""} onChange={onFormNominaChange} placeholder="0" min="0" /></div>
                <div className="au__field"><label>Recargos ($)</label><input type="number" name="recargos" value={formNomina.recargos || ""} onChange={onFormNominaChange} placeholder="0" min="0" /></div>
                <div className="au__field"><label>Deducciones ($)</label><input type="number" name="deducciones" value={formNomina.deducciones || ""} onChange={onFormNominaChange} placeholder="0" min="0" /></div>
                <div className="au__field">
                  <label>Total a Pagar</label>
                  <div className="au__nomina-total-box">
                    ${totalNominaCalculado.toLocaleString("es-CO")}
                  </div>
                </div>
              </div>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarModalNomina}>Cancelar</button>
              <button className="au__btn-primary" onClick={onGuardarNomina}>{nominaEditando ? "Guardar Cambios" : "Agregar"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gasto */}
      {modalGastoAbierto && (
        <div className="au__overlay" onClick={onCerrarModalGasto}>
          <div className="au__modal" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head"><h2>{gastoEditando ? "✏️ Editar Gasto" : "＋ Registrar Gasto"}</h2><button className="au__modal-x" onClick={onCerrarModalGasto}>✕</button></div>
            <div className="au__modal-body">
              {errorFormGasto && <div className="au__error">{errorFormGasto}</div>}
              <div className="au__grid">
                <div className="au__field au__field--full"><label>Descripción *</label><input type="text" name="descripcion" value={formGasto.descripcion || ""} onChange={onFormGastoChange} placeholder="Descripción del gasto" /></div>
                <div className="au__field"><label>Categoría *</label>
                  <select name="categoria" value={formGasto.categoria || ""} onChange={onFormGastoChange} className="au__select">
                    <option value="">Seleccionar...</option>
                    <option value="Operativo">Operativo</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="au__field"><label>Monto *</label><input type="number" name="monto" value={formGasto.monto || ""} onChange={onFormGastoChange} placeholder="0" min="0" /></div>
                <div className="au__field"><label>Fecha *</label><input type="date" name="fecha" value={formGasto.fecha || ""} onChange={onFormGastoChange} /></div>
              </div>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarModalGasto}>Cancelar</button>
              <button className="au__btn-primary" onClick={onGuardarGasto}>{gastoEditando ? "Guardar Cambios" : "Registrar"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Proveedor */}
      {modalProvAbierto && (
        <div className="au__overlay" onClick={onCerrarModalProv}>
          <div className="au__modal" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head"><h2>{provEditando ? "✏️ Editar Proveedor" : "＋ Nuevo Proveedor"}</h2><button className="au__modal-x" onClick={onCerrarModalProv}>✕</button></div>
            <div className="au__modal-body">
              {errorFormProv && <div className="au__error">{errorFormProv}</div>}
              <div className="au__grid">
                <div className="au__field au__field--full"><label>Nombre *</label><input type="text" name="nombre" value={formProv.nombre || ""} onChange={onFormProvChange} placeholder="Nombre o razón social" /></div>
                <div className="au__field"><label>NIT / Cédula *</label><input type="text" name="nit" value={formProv.nit || ""} onChange={onFormProvChange} placeholder="000000000" /></div>
                <div className="au__field"><label>Teléfono</label><input type="text" name="telefono" value={formProv.telefono || ""} onChange={onFormProvChange} placeholder="+57 300 000 0000" /></div>
                <div className="au__field"><label>Correo</label><input type="email" name="correo" value={formProv.correo || ""} onChange={onFormProvChange} placeholder="correo@proveedor.com" /></div>
                <div className="au__field"><label>Ciudad</label><input type="text" name="ciudad" value={formProv.ciudad || ""} onChange={onFormProvChange} placeholder="Ciudad" /></div>
                
                <div className="au__field"><label>Tipo *</label><input type="text" name="tipo" value={formProv.tipo || ""} onChange={onFormProvChange} placeholder="Ej: Insumos, Tecnología" /></div>
              </div>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarModalProv}>Cancelar</button>
              <button className="au__btn-primary" onClick={onGuardarProv}>{provEditando ? "Guardar Cambios" : "Registrar"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Servicio */}
      {modalServAbierto && (
        <div className="au__overlay" onClick={onCerrarModalServ}>
          <div className="au__modal" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head"><h2>{servEditando ? "✏️ Editar Servicio" : "⬆ Subir Servicio"}</h2><button className="au__modal-x" onClick={onCerrarModalServ}>✕</button></div>
            <div className="au__modal-body">
              {errorFormServ && <div className="au__error">{errorFormServ}</div>}
              <div className="au__grid">
                <div className="au__field au__field--full"><label>Nombre del servicio *</label><input type="text" name="nombre" value={formServ.nombre || ""} onChange={onFormServChange} placeholder="Ej: Factura luz, Recibo agua" /></div>
                <div className="au__field"><label>Tipo *</label>
                  <select name="tipo" value={formServ.tipo || ""} onChange={onFormServChange} className="au__select">
                    <option value="">Seleccionar...</option>
                    <option value="Luz">Luz</option>
                    <option value="Agua">Agua</option>
                    <option value="Internet">Internet</option>
                    <option value="Gas">Gas</option>
                    <option value="Teléfono">Teléfono</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="au__field"><label>Monto *</label><input type="number" name="monto" value={formServ.monto || ""} onChange={onFormServChange} placeholder="0" min="0" /></div>
                <div className="au__field"><label>Fecha *</label><input type="date" name="fecha" value={formServ.fecha || ""} onChange={onFormServChange} /></div>
                <div className="au__field au__field--full">
                  <label>Recibo / Comprobante (PDF, JPG, PNG)</label>
                  <label className="au__file-label">
                    <span>📎</span>
                    <span>{archivoServNombre || "Haz clic para seleccionar archivo..."}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onArchivoServChange} className="au__file-input" />
                  </label>
                </div>
              </div>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarModalServ}>Cancelar</button>
              <button className="au__btn-primary" onClick={onGuardarServ}>{servEditando ? "Guardar Cambios" : "Subir"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Arriendo */}
      {modalArriendoAbierto && (
        <div className="au__overlay" onClick={onCerrarModalArriendo}>
          <div className="au__modal" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head"><h2>{arriendoEditando ? "✏️ Editar Arriendo" : "＋ Registrar Arriendo"}</h2><button className="au__modal-x" onClick={onCerrarModalArriendo}>✕</button></div>
            <div className="au__modal-body">
              {errorFormArriendo && <div className="au__error">{errorFormArriendo}</div>}
              <div className="au__grid">
                <div className="au__field au__field--full"><label>Descripción *</label><input type="text" name="descripcion" value={formArriendo.descripcion || ""} onChange={onFormArriendoChange} placeholder="Ej: Oficina principal, Bodega" /></div>
                <div className="au__field"><label>Arrendador *</label><input type="text" name="arrendador" value={formArriendo.arrendador || ""} onChange={onFormArriendoChange} placeholder="Nombre del arrendador" /></div>
                <div className="au__field"><label>Valor Mensual *</label><input type="number" name="valorMensual" value={formArriendo.valorMensual || ""} onChange={onFormArriendoChange} placeholder="0" min="0" /></div>
                <div className="au__field"><label>Fecha de Pago *</label><input type="date" name="fechaPago" value={formArriendo.fechaPago || ""} onChange={onFormArriendoChange} /></div>
                <div className="au__field"><label>Estado</label>
                  <select name="activo" value={formArriendo.activo !== undefined ? String(formArriendo.activo) : "true"} onChange={onFormArriendoChange} className="au__select">
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarModalArriendo}>Cancelar</button>
              <button className="au__btn-primary" onClick={onGuardarArriendo}>{arriendoEditando ? "Guardar Cambios" : "Registrar"}</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}