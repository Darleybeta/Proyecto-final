// Componentes/Inicio.jsx
// Solo JSX. Sin lógica ni estados.

import "../style/Inicio.css";

const SERVICIOS = [
  {
    icon: "📊",
    nombre: "Gestión Contable",
    desc: "Registra ingresos, egresos y gastos fácilmente. Gestiona facturas y mantén tus finanzas siempre al día.",
  },
  {
    icon: "📦",
    nombre: "Control de Inventario",
    desc: "Registra productos, controla el stock y recibe alertas automáticas cuando el inventario esté bajo.",
  },
  {
    icon: "📈",
    nombre: "Reportes Financieros",
    desc: "Genera reportes automáticos, visualiza balances y exporta tus estados financieros en PDF o Excel.",
  },
  {
    icon: "🤖",
    nombre: "Agente con IA",
    desc: "Analiza tus datos financieros, genera proyecciones y recibe recomendaciones en lenguaje sencillo.",
  },
  {
    icon: "🧾",
    nombre: "Gestión de Ventas",
    desc: "Registra ventas y facturas. El inventario se actualiza automáticamente con cada transacción.",
  },
  {
    icon: "🔐",
    nombre: "Administración de Usuarios",
    desc: "El administrador gestiona roles, permisos y accesos para mantener la seguridad del sistema.",
  },
];

const POR_QUE = [
  {
    icon: "⚡",
    titulo: "Todo en un solo lugar",
    texto: "Contabilidad, inventario, ventas y reportes integrados en una sola plataforma.",
  },
  {
    icon: "🧠",
    titulo: "Inteligencia Artificial",
    texto: "Nuestro agente IA interpreta tus datos y te explica el estado de tu negocio en términos simples.",
  },
  {
    icon: "📤",
    titulo: "Exportación fácil",
    texto: "Descarga tus reportes en PDF o Excel con un solo clic para compartirlos con quien necesites.",
  },
  {
    icon: "🔔",
    titulo: "Alertas automáticas",
    texto: "Recibe notificaciones de bajo stock y mantente siempre informado sin esfuerzo extra.",
  },
];

export default function Inicio({ onLogin, onRegister }) {
  return (
    <main className="inicio">

      {/* ── Hero ── */}
      <section className="inicio__hero">
        <div className="inicio__circle-top" />
        <div className="inicio__circle-bottom" />

        <div className="inicio__logo-wrapper">
          <div className="inicio__logo-outer">
            <div className="inicio__logo-inner">
              <span className="inicio__logo-symbol">₡</span>
            </div>
          </div>
        </div>

        <h1 className="inicio__hero-title">
          Luky<span>System</span>
        </h1>
        <p className="inicio__hero-sub">
          La plataforma contable inteligente que simplifica la gestión financiera
          de tu negocio con reportes automáticos e inteligencia artificial.
        </p>

        <div className="inicio__hero-buttons">
          <button className="inicio__btn-primary" onClick={onLogin}>
            Iniciar Sesión
          </button>
          <button className="inicio__btn-secondary" onClick={onRegister}>
            Contactar Asesor
          </button>
        </div>
      </section>

      {/* ── Quiénes somos ── */}
      <section className="inicio__about">
        <p className="inicio__section-label">Quiénes somos</p>
        <h2 className="inicio__section-title">
          Soluciones contables <span>inteligentes</span>
        </h2>
        <p className="inicio__about-text">
          Somos una empresa especializada en desarrollo de software contable. 
          Nuestro sistema nació para simplificar la administración financiera de 
          pequeñas y medianas empresas, combinando automatización e inteligencia 
          artificial para que tú te enfoques en hacer crecer tu negocio.
        </p>

        <div className="inicio__stats">
          <div className="inicio__stat">
            <span className="inicio__stat-number">IA</span>
            <span className="inicio__stat-label">Análisis financiero</span>
          </div>
        </div>
      </section>

      {}
      <section className="inicio__services">
        <p className="inicio__section-label">Lo que ofrecemos</p>
        <h2 className="inicio__section-title">
          Nuestros <span>servicios</span>
        </h2>

        <div className="inicio__services-grid">
          {SERVICIOS.map((s) => (
            <div className="inicio__service-card" key={s.nombre}>
              <div className="inicio__service-icon">{s.icon}</div>
              <h3 className="inicio__service-name">{s.nombre}</h3>
              <p className="inicio__service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section className="inicio__why">
        <p className="inicio__section-label">Por qué elegirnos</p>
        <h2 className="inicio__section-title">
          La diferencia que <span>marca</span>
        </h2>

        <div className="inicio__why-grid">
          {POR_QUE.map((item) => (
            <div className="inicio__why-item" key={item.titulo}>
              <div className="inicio__why-icon">{item.icon}</div>
              <h4 className="inicio__why-title">{item.titulo}</h4>
              <p className="inicio__why-text">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="inicio__cta">
        <h2 className="inicio__cta-title">
          ¿Listo para <span>empezar</span>?
        </h2>
        <p className="inicio__cta-sub">
          Accede a tu cuenta o contacta a un asesor para conocer el plan ideal para tu empresa.
        </p>
        <div className="inicio__hero-buttons">
          <button className="inicio__btn-primary" onClick={onLogin}>
            Iniciar Sesión
          </button>
          <button className="inicio__btn-secondary" onClick={onRegister}>
            Contactar Asesor
          </button>
        </div>
      </section>

    </main>
  );
}