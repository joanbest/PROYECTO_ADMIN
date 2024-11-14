
        // ID del empleado en sesión, reemplaza con el ID del empleado autenticado
        const empleadoId = req.session.user.id_persona; // Ejemplo

        // Función para cargar los servicios asignados desde el backend
        async function cargarServiciosAsignados(id_empleado) {
            try {
                const response = await fetch(`/api/servicioAsignado/servicio/${id_empleado}`);
                const serviciosAsignados = await response.json();

                const tbody = document.querySelector('#tablaServiciosAsignados tbody');
                tbody.innerHTML = ''; // Limpia la tabla antes de llenarla

                serviciosAsignados.forEach(servicio => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${servicio.id_asignacion_actividad}</td>
                        <td>${servicio.nombre_actividad || 'No asignada'}</td>
                        <td>${servicio.direccion_servicio}</td>
                        <td>${servicio.fecha_servicio}</td>
                        <td>${servicio.fecha_hora_asignacion}</td>
                        <td>${servicio.fecha_hora_finalizacion || 'Pendiente'}</td>
                        <td>${servicio.pago_empleado}</td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error al cargar servicios asignados:', error);
            }
        }

        // Cargar los servicios asignados al cargar la página
        document.addEventListener('DOMContentLoaded', () => {
            cargarServiciosAsignados(empleadoId);
        });
  