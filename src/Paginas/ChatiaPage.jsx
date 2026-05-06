// Paginas/ChatIAPage.jsx
// Toda la lógica, estados y llamada a la API de IA van aquí.

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ChatIA from "../Componentes/ChatIA";
import Footer from "../Componentes/Footer";

// ── Sugerencias rápidas para el administrador ─────────
const SUGERENCIAS = [
  { icono: "📦", texto: "¿Cómo puedo interpretar mi reporte de inventario?" },
  { icono: "💰", texto: "¿Qué significa el valor total en inventario?" },
  { icono: "⚠️",  texto: "¿Qué debo hacer cuando un producto está en stock bajo?" },
  { icono: "📊", texto: "¿Cómo puedo mejorar la gestión de mis productos?" },
  { icono: "🧾", texto: "¿Para qué sirve el módulo de documentos?" },
  { icono: "👥", texto: "¿Cómo gestiono los usuarios del sistema?" },
];

// ── Sistema prompt para el asistente ─────────────────
const SYSTEM_PROMPT = `Eres LukyIA, el asistente financiero e inteligente del sistema LukySystem, 
una plataforma contable para pequeñas y medianas empresas colombianas.

Solo hablas con administradores del sistema. Tu rol es:
- Ayudar a interpretar datos de inventario, ventas y documentos contables
- Explicar conceptos financieros en términos simples
- Dar recomendaciones sobre gestión de inventario y flujo de caja
- Orientar sobre el uso correcto del sistema LukySystem
- Responder preguntas sobre contabilidad básica para PyMEs colombianas

Siempre responde en español. Sé conciso, claro y profesional pero amigable.
Usa emojis con moderación para hacer las respuestas más legibles.
Si te preguntan algo fuera de tu dominio (finanzas, inventario, el sistema), 
redirige amablemente hacia temas relacionados con la gestión empresarial.`;

// ── Utilidad: hora actual ─────────────────────────────
function horaActual() {
  return new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

let nextMsgId = 1;

export default function ChatIAPage({ usuarioActual }) {
  const navigate = useNavigate();

  // Redirigir si no es administrador
  useEffect(() => {
    if (usuarioActual && usuarioActual.rol !== "Administrador") {
      navigate("/Inventario");
    }
  }, [usuarioActual, navigate]);

  // ── Estado ──────────────────────────────────────────
  const [mensajes, setMensajes] = useState([]);
  const [inputValor, setInputValor] = useState("");
  const [cargando, setCargando]     = useState(false);

  const mensajesEndRef = useRef(null);

  // ── Auto-scroll al último mensaje ───────────────────
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  // ── Enviar mensaje a la API ──────────────────────────
  const enviarMensaje = useCallback(async (textoInput) => {
    const texto = (textoInput ?? inputValor).trim();
    if (!texto || cargando) return;

    // Agregar mensaje del usuario
    const msgUsuario = {
      id: nextMsgId++,
      rol: "usuario",
      texto,
      hora: horaActual(),
    };
    const nuevosMsg = [...mensajes, msgUsuario];
    setMensajes(nuevosMsg);
    setInputValor("");
    setCargando(true);

    try {
      // Construir historial para la API (sin el system message)
      const historial = nuevosMsg.map((m) => ({
        role: m.rol === "usuario" ? "user" : "assistant",
        content: m.texto,
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: historial,
        }),
      });

      const data = await response.json();
      const respuestaTexto =
        data?.content?.find((b) => b.type === "text")?.text ||
        "Lo siento, no pude procesar tu consulta. Intenta de nuevo.";

      setMensajes((prev) => [
        ...prev,
        {
          id: nextMsgId++,
          rol: "asistente",
          texto: respuestaTexto,
          hora: horaActual(),
        },
      ]);
    } catch (err) {
      setMensajes((prev) => [
        ...prev,
        {
          id: nextMsgId++,
          rol: "asistente",
          texto: "⚠️ Ocurrió un error al conectar con el asistente. Verifica tu conexión e intenta de nuevo.",
          hora: horaActual(),
        },
      ]);
    } finally {
      setCargando(false);
    }
  }, [inputValor, mensajes, cargando]);

  // ── Handlers ─────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const handleSugerencia = (texto) => {
    enviarMensaje(texto);
  };

  const handleLimpiarChat = () => {
    if (mensajes.length === 0) return;
    if (!window.confirm("¿Limpiar toda la conversación?")) return;
    setMensajes([]);
  };

  return (
    <div>
      <ChatIA
        mensajes={mensajes}
        inputValor={inputValor}
        cargando={cargando}
        sugerenciasRapidas={SUGERENCIAS}
        mensajesEndRef={mensajesEndRef}
        onInputChange={setInputValor}
        onEnviar={() => enviarMensaje()}
        onKeyDown={handleKeyDown}
        onSugerencia={handleSugerencia}
        onLimpiarChat={handleLimpiarChat}
      />
      <Footer />
    </div>
  );
}