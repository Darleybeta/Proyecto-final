const API_URL = import.meta.env.VITE_API_URL || 'https://lukita-2si9.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

export const crearSolicitud = async (datos) => {
    const res = await fetch(`${API_URL}/negocios/solicitudes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return res.json();
};

// AUTH
export const login = async (correo, password) => {
    const res = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
    });
    return res.json();
};

export const registro = async (datos) => {
    const res = await fetch(`${API_URL}/auth/registro/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return res.json();
};

// NEGOCIOS
export const getNegocios = async () => {
    const res = await fetch(`${API_URL}/negocios/`, { headers: headers() });
    return res.json();
};

export const aprobarNegocio = async (id) => {
    const res = await fetch(`${API_URL}/negocios/${id}/aprobar/`, {
        method: 'POST',
        headers: headers()
    });
    return res.json();
};

export const rechazarNegocio = async (id) => {
    const res = await fetch(`${API_URL}/negocios/${id}/rechazar/`, {
        method: 'POST',
        headers: headers()
    });
    return res.json();
};

// TRANSACCIONES
export const getTransacciones = async (negocio_id) => {
    const res = await fetch(`${API_URL}/contabilidad/transacciones/?negocio_id=${negocio_id}`, {
        headers: headers()
    });
    return res.json();
};

export const crearTransaccion = async (datos) => {
    const res = await fetch(`${API_URL}/contabilidad/transacciones/`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

// PRODUCTOS
export const getProductos = async (negocio_id) => {
    const res = await fetch(`${API_URL}/inventario/productos/?negocio_id=${negocio_id}`, {
        headers: headers()
    });
    return res.json();
};

export const crearProducto = async (datos) => {
    const res = await fetch(`${API_URL}/inventario/productos/`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

export const getProductosBajoStock = async (negocio_id) => {
    const res = await fetch(`${API_URL}/inventario/productos/bajo_stock/?negocio_id=${negocio_id}`, {
        headers: headers()
    });
    return res.json();
};

// VENTAS
export const crearVenta = async (datos) => {
    const res = await fetch(`${API_URL}/inventario/ventas/`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

// REPORTES
export const getResumenFinanciero = async (negocio_id) => {
    const res = await fetch(`${API_URL}/reportes/resumen/?negocio_id=${negocio_id}`, {
        headers: headers()
    });
    return res.json();
};

// IA
export const preguntarIA = async (negocio_id, pregunta) => {
    const res = await fetch(`${API_URL}/ia/analizar/`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ negocio_id, pregunta })
    });
    return res.json();
};

export const actualizarProducto = async (id, datos) => {
    const res = await fetch(`${API_URL}/inventario/productos/${id}/`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

export const eliminarProducto = async (id) => {
    const res = await fetch(`${API_URL}/inventario/productos/${id}/`, {
        method: 'DELETE',
        headers: headers()
    });
    return res.ok;
};

// NÓMINA
export const getNomina = async (negocio_id) => {
    const res = await fetch(`${API_URL}/nomina/?negocio_id=${negocio_id}`, {
        headers: headers()
    });
    return res.json();
};

export const crearNomina = async (datos) => {
    const res = await fetch(`${API_URL}/nomina/`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

export const actualizarNomina = async (id, datos) => {
    const res = await fetch(`${API_URL}/nomina/${id}/`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

export const eliminarNomina = async (id) => {
    const res = await fetch(`${API_URL}/nomina/${id}/`, {
        method: 'DELETE',
        headers: headers()
    });
    return res.ok;
};

export const pagarNomina = async (id) => {
    const res = await fetch(`${API_URL}/nomina/${id}/pagar/`, {
        method: 'POST',
        headers: headers()
    });
    return res.json();
};

// FACTURAS
export const getFacturas = async (negocio_id) => {
    const res = await fetch(`${API_URL}/contabilidad/facturas/?negocio_id=${negocio_id}`, {
        headers: headers()
    });
    return res.json();
};

export const crearFactura = async (datos) => {
    const res = await fetch(`${API_URL}/contabilidad/facturas/`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

export const actualizarFactura = async (id, datos) => {
    const res = await fetch(`${API_URL}/contabilidad/facturas/${id}/`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(datos)
    });
    return res.json();
};

export const eliminarFactura = async (id) => {
    const res = await fetch(`${API_URL}/contabilidad/facturas/${id}/`, {
        method: 'DELETE',
        headers: headers()
    });
    return res.ok;
};

// DOCUMENTOS
export const getDocumentos = async () => {
    const res = await fetch(`${API_URL}/documentos/documentos/`, {
        headers: headers()
    });
    return res.json();
};

export const subirDocumento = async (formData) => {
    const res = await fetch(`${API_URL}/documentos/documentos/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        body: formData
    });
    return res.json();
};

export const eliminarDocumento = async (id) => {
    const res = await fetch(`${API_URL}/documentos/documentos/${id}/`, {
        method: 'DELETE',
        headers: headers()
    });
    return res.ok;
};
