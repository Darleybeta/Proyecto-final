import { useNavigate } from "react-router-dom";
import Inicio from "../Componentes/Inicio";
import Footer from "../Componentes/Footer";

export default function InicioPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/inicio");
  };

  const handleRegister = () => {
    navigate("/registro");
  };

  return (
    <div>
    <Inicio
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
    <Footer/>
    </div>
  );
}