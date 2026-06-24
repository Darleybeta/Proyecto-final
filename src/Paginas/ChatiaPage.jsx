import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ChatIA from "../Componentes/ChatIA";
import Footer from "../Componentes/Footer";

const SUGERENCIAS = [
  { icono: "📦", texto: "¿Cómo puedo interpretar mi reporte de inventario?" },
  { icono: "💰", texto: "¿Qué significa el valor total en inventario?" },
  { icono: "⚠️", texto: "¿Qué debo hacer cuando un producto está en stock bajo?" },
  { icono: "📊", texto: "¿Cómo puedo mejorar la gestión de mis productos?" },
  { icono: "🧾", texto: "¿Para qué sirve el módulo de documentos?" },
  { icono: "👥", texto: "¿Cómo gestiono los usuarios del sistema?" },
];

function horaActual() {
  return new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

let nextMsgId = 1;

export default function ChatIAPage({ usuarioActual }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (usuarioActual && usuarioActual.rol !== "Administrador" && usuarioActual.rol !== "admin") {
      navigate("/Inventario");
    }
  }, [usuarioActual, navigate]);

  const [mensajes, setMensajes] = useState([]);
  const [inputValor, setInputValor] = useState("");
  const [cargando, setCargando] = useState(false);
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  const enviarMensaje = useCallback(async (textoInput) => {
    const texto = (textoInput ?? inputValor).trim();
    if (!texto || cargando) return;

    const msgUsuario = {
      id: nextMsgId++,
      rol: "usuario",
      texto,
      hora: horaActual(),
    };

    setMensajes((prev) => [...prev, msgUsuario]);
    setInputValor("");
    setCargando(true);

    try {
      const response = await fetch("https://lukita-2si9.onrender.com/api/ia/analizar/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          negocio_id: usuarioActual?.negocio_id,
          pregunta: texto,
        }),
      });

      console.log("STATUS:", response.status);
      const data = await response.json();
      console.log("RESPUESTA:", data);

      const respuestaTexto = data?.respuesta || "Lo siento, no pude procesar tu consulta.";

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
      console.error("ERROR COMPLETO:", err);
      setMensajes((prev) => [
        ...prev,
        {
          id: nextMsgId++,
          rol: "asistente",
          texto: `⚠️ Error: ${err.message}`,
          hora: horaActual(),
        },
      ]);
    } finally {
      setCargando(false);
    }
  }, [inputValor, mensajes, cargando, usuarioActual]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const handleSugerencia = (texto) => enviarMensaje(texto);

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
