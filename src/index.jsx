import React from "react";
import { createRoot } from 'react-dom/client'
import App from './Componentes/App'
import RegistroPage from "./Paginas/RegistroPage";

const contenedor = document.getElementById('root');
const root = createRoot(contenedor)
root.render(<App/>)