
function logout() {
    window.location.href = '/api/auth/logout';
}


document.getElementById('mostrarFormularioBtn').addEventListener('click', () => {
    const formulario = document.getElementById('formularioSolicitudServicio');
    formulario.classList.toggle('d-none'); // Muestra u oculta el formulario
});
// Cargar los tipos de servicio en el combo box
async function cargarTiposServicio() {
    try {
        const response = await fetch('/api/servicio/tipos');
        const tiposServicio = await response.json();

        const tipoServicioSelect = document.getElementById('tipoServicio');
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

// Llama a la función para cargar el combo box cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarTiposServicio);

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
        const fk_id_persona = 1; // Obtener el ID del usuario autenticado en la sesión

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

async function cargarServiciosSolicitados(id_persona) {
    try {
        const response = await fetch(`/api/servicio/solicitados/${id_persona}`);
        const servicios = await response.json();

        const tbody = document.querySelector('#tablaServiciosSolicitados tbody');
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
