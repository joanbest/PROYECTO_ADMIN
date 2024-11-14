
function logout() {
    window.location.href = '/api/auth/logout';
}


document.getElementById('abrirModalBtn').addEventListener('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('solicitudModal'));
    modal.show();
});

document.getElementById('solicitudModal').addEventListener('hidden.bs.modal', () => {
    // Remover manualmente cualquier overlay en caso de que no se elimine
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open'); // Remueve la clase que podría deshabilitar el scroll
    document.body.style.paddingRight = ''; // Limpia estilos adicionales
});

// Cargar los tipos de servicio en el combo box
// Escucha el evento de apertura del modal para cargar los tipos de servicio
document.getElementById('solicitudModal').addEventListener('shown.bs.modal', cargarTiposServicio);

async function cargarTiposServicio() {
    try {
        const response = await fetch('/api/servicio/tipos');
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const tiposServicio = await response.json();
        const tipoServicioSelect = document.getElementById('tipoServicio');
        
        // Limpiar las opciones anteriores
        tipoServicioSelect.innerHTML = '<option value="">Seleccione un tipo de servicio</option>';
        
        // Añadir los nuevos tipos de servicio
        tiposServicio.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_tipo_servicio;
            option.textContent = tipo.nombre_tipo_servicio;
            tipoServicioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los tipos de servicio:', error);
    }
}


//manejo de la fecha en el formulario de solicitud


document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').setAttribute('min', hoy);
});





// Manejo del envío del formulario para registrar la solicitud

document.getElementById('solicitudForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const direccion_servicio = document.getElementById('direccion').value;
    const fecha_servicio = document.getElementById('fecha').value;
    const costo_servicio = 50000;
    const fk_id_tipo_servicio = document.getElementById('tipoServicio').value;

  

    try {
         // Obtener el ID del usuario autenticado en la sesión
         const fk_id_persona = 1;
        const response = await fetch('/api/servicio/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                direccion_servicio,
                fecha_servicio,
                costo_servicio,
                fk_id_persona,
                fk_id_tipo_servicio
            })
        });

        if (response.ok) {
            alert('Solicitud de servicio registrada exitosamente');
            document.getElementById('solicitudForm').reset(); // Resetea el formulario
            document.getElementById('formularioSolicitudServicio').classList.add('d-none'); // Oculta el formulario después de registrar

            // Muestra y carga la tabla con los servicios solicitados
            const tablaServicios = document.getElementById('tablaServiciosSolicitados');
            tablaServicios.classList.remove('d-none'); // Muestra la tabla
            cargarServiciosSolicitados(fk_id_persona); // Carga los servicios solicitados en la tabla
        
        } else {
            const errorMessage = await response.text();
            alert('Error: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud. Inténtalo de nuevo.');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener el `fk_id_persona` desde la sesión del backend
        const response = await fetch('/api/auth/user-id');
        if (!response.ok) {
            throw new Error('No se pudo obtener el ID del usuario');
        }

        const data = await response.json();
        const fk_id_persona = data.fk_id_persona;

        // Cargar los servicios solicitados para el usuario autenticado
        cargarServiciosSolicitados(fk_id_persona);
    } catch (error) {
        console.error('Error al cargar el ID del usuario:', error);
    }
});

async function cargarServiciosSolicitados(fk_id_persona) {
    try {
        const response = await fetch(`/api/servicio/solicitados/${fk_id_persona}`);
        
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const servicios = await response.json();
        
        const tbody = document.querySelector('#tablaServiciosSolicitados tbody');
        if (!tbody) {
            console.error('Elemento de tabla no encontrado: #tablaServiciosSolicitados tbody');
            return;
        }

        tbody.innerHTML = ''; // Limpia la tabla antes de cargar los datos

        servicios.forEach(servicio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${servicio.nombre_tipo_servicio}</td>
                <td>${servicio.direccion_servicio}</td>
                <td>${servicio.fecha_servicio}</td>
                <td>${servicio.estado_servicio}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar servicios solicitados:', error);
    }
}



// Carga la tabla cuando la página se carga
// document.addEventListener('DOMContentLoaded', () => {
//     const usuario_id = 1; // Reemplaza con el ID del usuario en sesión
//     cargarServiciosSolicitados(usuario_id);
// });
// Mostrar u ocultar el formulario de solicitud de servicio
