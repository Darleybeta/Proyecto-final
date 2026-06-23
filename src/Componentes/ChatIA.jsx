import "../style/Chatia.css";

export default function ChatIA({
  // Mensajes
  mensajes = [],
  inputValor = "",
  cargando = false,
  // Sugerencias rápidas
  sugerenciasRapidas = [],
  // Handlers
  onInputChange,
  onEnviar,
  onKeyDown,
  onSugerencia,
  onLimpiarChat,
  // Ref para scroll
  mensajesEndRef,
}) {
  return (
    <main className="cia">

      {/* ── HEADER ── */}
      <header className="cia__header">
        <div className="cia__header-left">
          <div className="cia__avatar">
            <span className="cia__avatar-icon">🤖</span>
            <span className="cia__avatar-pulse" />
          </div>
          <div>
            <h1 className="cia__titulo">Agente <span>LukyIA</span></h1>
            <p className="cia__subtitulo">Asistente financiero inteligente · Solo administradores</p>
          </div>
        </div>
        <button
          className="cia__btn-limpiar"
          onClick={onLimpiarChat}
          title="Limpiar conversación"
        >
          🗑️ Limpiar chat
        </button>
      </header>

      {/* ── ÁREA DE CHAT ── */}
      <section className="cia__chat-area">

        {/* Mensaje de bienvenida cuando no hay mensajes */}
        {mensajes.length === 0 && (
          <div className="cia__bienvenida">
            <div className="cia__bienvenida-logo">
              <span>🤖</span>
            </div>
            <h2>¡Hola, Administrador!</h2>
            <p>
              Soy <strong>LukyIA</strong>, tu asistente financiero. Puedo ayudarte a analizar
              tu inventario, interpretar datos de ventas, detectar tendencias y responder
              preguntas sobre el sistema LukySystem.
            </p>
            <p className="cia__bienvenida-hint">¿Por dónde quieres empezar?</p>
          </div>
        )}

        {/* Lista de mensajes */}
        <div className="cia__mensajes">
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`cia__msg cia__msg--${msg.rol}`}
            >
              {msg.rol === "asistente" && (
                <div className="cia__msg-avatar">🤖</div>
              )}
              <div className="cia__msg-burbuja">
                {/* Render con saltos de línea */}
                {msg.texto.split("\n").map((linea, i) => (
                  <span key={i}>
                    {linea}
                    {i < msg.texto.split("\n").length - 1 && <br />}
                  </span>
                ))}
                <span className="cia__msg-hora">{msg.hora}</span>
              </div>
              {msg.rol === "usuario" && (
                <div className="cia__msg-avatar cia__msg-avatar--user">👤</div>
              )}
            </div>
          ))}

          {/* Indicador de escritura */}
          {cargando && (
            <div className="cia__msg cia__msg--asistente">
              <div className="cia__msg-avatar">🤖</div>
              <div className="cia__msg-burbuja cia__msg-burbuja--typing">
                <span className="cia__dot" />
                <span className="cia__dot" />
                <span className="cia__dot" />
              </div>
            </div>
          )}

          {/* Ancla para auto-scroll */}
          <div ref={mensajesEndRef} />
        </div>
      </section>

      {/* ── SUGERENCIAS RÁPIDAS ── */}
      {sugerenciasRapidas.length > 0 && mensajes.length === 0 && (
        <section className="cia__sugerencias">
          <p className="cia__sugerencias-titulo">Preguntas sugeridas</p>
          <div className="cia__sugerencias-grid">
            {sugerenciasRapidas.map((s, i) => (
              <button
                key={i}
                className="cia__sugerencia-btn"
                onClick={() => onSugerencia(s.texto)}
                disabled={cargando}
              >
                <span className="cia__sugerencia-icon">{s.icono}</span>
                <span>{s.texto}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── INPUT ── */}
      <footer className="cia__footer">
        <div className="cia__input-wrapper">
          <textarea
            className="cia__input"
            placeholder="Escribe tu pregunta al asistente financiero..."
            value={inputValor}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={cargando}
          />
          <button
            className={`cia__btn-enviar ${cargando ? "cia__btn-enviar--loading" : ""}`}
            onClick={onEnviar}
            disabled={cargando || !inputValor.trim()}
            title="Enviar (Enter)"
          >
            {cargando ? "⏳" : "➤"}
          </button>
        </div>
        <p className="cia__footer-hint">
          Presiona <kbd>Enter</kbd> para enviar · <kbd>Shift+Enter</kbd> para nueva línea
        </p>
      </footer>

    </main>
  );
}