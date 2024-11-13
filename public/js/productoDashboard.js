async function cargarTiposProducto() {
    const response = await fetch('/api/productos/tipos');
    const tipos = await response.json();
    const tipoSelect = document.getElementById('tipo_producto');
    
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id_tipo_producto;
        option.textContent = tipo.nombre_tipo_producto;
        tipoSelect.appendChild(option);
    });
}

async function cargarPresentacionesProducto() {
    const response = await fetch('/api/productos/presentaciones');
    const presentaciones = await response.json();
    const presentacionSelect = document.getElementById('presentacion_producto');
    
    presentaciones.forEach(presentacion => {
        const option = document.createElement('option');
        option.value = presentacion.id_presentacion_producto;
        option.textContent = presentacion.nombre_presentacion_producto;
        presentacionSelect.appendChild(option);
    });
}

// Maneja el envío del formulario para crear un producto
document.getElementById('registroProductoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre_producto = document.getElementById('nombre_producto').value;
    const cantidad_producto = document.getElementById('cantidad_producto').value;
    const contenido_neto = document.getElementById('contenido_neto').value;
    const tipo_producto = document.getElementById('tipo_producto').value;
    const presentacion_producto = document.getElementById('presentacion_producto').value;

    try {
        const response = await fetch('/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_producto,
                contenido_neto,
                cantidad_producto,
                fk_tipo_producto: tipo_producto,
                fk_presentacion_producto: presentacion_producto
            })
        });

        if (response.ok) {
            alert('Producto registrado exitosamente');
            document.getElementById('registroProductoForm').reset();
        } else {
            alert('Error al registrar el producto');
        }
    } catch (error) {
        console.error('Error al registrar producto:', error);
    }
});

// Llama a las funciones para cargar las opciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarTiposProducto();
    cargarPresentacionesProducto();
});
