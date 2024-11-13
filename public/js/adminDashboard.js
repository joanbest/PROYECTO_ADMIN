


// Función para cargar usuarios en la tabla
async function cargarUsuarios() {
    try {
        const response = await fetch('/api/admin/usuarios'); // URL del endpoint
        const usuarios = await response.json();

        const tbody = document.querySelector('#usuariosTable tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de agregar datos

        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.id_persona}</td>
                <td>${usuario.nombre_usuario}</td>
                <td>${usuario.email_persona}</td>
                <td>${usuario.fecha_nacimiento_persona}</td>
                <td>${usuario.rol}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="abrirModalActualizar(${usuario.id_persona})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="abrirModalEliminar(${usuario.id_persona})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Llama a cargarUsuarios cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarUsuarios);

async function cargarRoles() {
    let roles = JSON.parse(sessionStorage.getItem('roles'));

    if (!roles) {
        try {
            const response = await fetch('/api/admin/roles');
            if (!response.ok) throw new Error('Error al obtener los roles');

            roles = await response.json();
            sessionStorage.setItem('roles', JSON.stringify(roles));
        } catch (error) {
            console.error('Error al cargar roles:', error);
            return;
        }
    }

    const rolSelect = document.getElementById('id_rol');
    rolSelect.innerHTML = '<option value="">Seleccione un rol</option>';
    roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id_rol;
        option.textContent = rol.nombre_rol;
        rolSelect.appendChild(option);
    });
}


// Llama a la función cargarRoles cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarRoles);

document.getElementById('crearUsuarioForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const data = {
        firstname: document.getElementById('primer-nombre').value,
        secondname: document.getElementById('segundo-nombre').value,
        firstlastname: document.getElementById('primer-apellido').value,
        secondlastname: document.getElementById('segundo-apellido').value,
        dateborn: document.getElementById('fecha-nacimiento').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        telephone: document.getElementById('telefono').value,
        address: document.getElementById('direccion').value,
        id_rol: document.getElementById('id_rol').value
    };

    try {
        const response = await fetch('/api/admin/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data }) // Enviar el objeto `data` correctamente
        });

        if (response.ok) {
            alert('Usuario creado exitosamente');
            document.getElementById('crearUsuarioForm').reset();
            $('#crearUsuarioModal').modal('hide'); // Cerrar modal
            cargarUsuarios(); // Recargar lista de usuarios
        } else {
            const errorText = await response.text();
            alert(`Error al crear usuario: ${errorText}`);
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario');
    }
});



document.getElementById('actualizarUsuarioForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id_persona = document.getElementById('id_persona_actualizar').value;
    const nombre_usuario = document.getElementById('nombre_usuario_actualizar').value;
    const email_persona = document.getElementById('email_persona_actualizar').value;
    const fecha_nacimiento_persona = document.getElementById('fecha_nacimiento_persona_actualizar').value;
    const fk_rol = document.getElementById('rol_id_actualizar').value;

    try {
        const response = await fetch('/api/admin/actualizar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_persona, nombre_usuario, email_persona, fecha_nacimiento_persona, fk_rol })
        });
        
        if (response.ok) {
            alert('Usuario actualizado exitosamente');
            const modal = bootstrap.Modal.getInstance(document.getElementById('actualizarUsuarioModal'));
            modal.hide(); // Cerrar modal
            cargarUsuarios(); // Recargar lista de usuarios
        } else {
            alert('Error al actualizar el usuario');
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
});



document.getElementById('confirmarEliminarBtn').addEventListener('click', async function () {
    const id_persona = document.getElementById('id_persona_eliminar').value;

    try {
        const response = await fetch(`/api/admin/usuarios/${id_persona}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Usuario eliminado');
            $('#eliminarUsuarioModal').modal('hide');
            cargarUsuarios();
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
});
async function abrirModalActualizar(id_persona) {
    try {
        const response = await fetch(`/api/admin/usuarios/${id_persona}`);
        const usuario = await response.json();

        // Rellenar el modal de actualización con los datos del usuario
        document.getElementById('id_persona_actualizar').value = usuario.id_persona;
        document.getElementById('nombre_usuario_actualizar').value = usuario.nombre_usuario;
        document.getElementById('email_persona_actualizar').value = usuario.email_persona;
        document.getElementById('fecha_nacimiento_persona_actualizar').value = usuario.fecha_nacimiento_persona;
        document.getElementById('rol_id_actualizar').value = usuario.fk_rol;

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('actualizarUsuarioModal'));
        modal.show();
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
    }
}

function abrirModalEliminar(id_persona) {
    document.getElementById('id_persona_eliminar').value = id_persona; // Guardar el ID en un campo oculto
    const modal = new bootstrap.Modal(document.getElementById('eliminarUsuarioModal'));
    modal.show();
}

document.getElementById('confirmarEliminarBtn').addEventListener('click', async function () {
    const id_persona = document.getElementById('id_persona_eliminar').value;

    try {
        const response = await fetch(`/api/admin/usuarios/${id_persona}`, { method: 'DELETE' });
        
        if (response.ok) {
            alert('Usuario eliminado exitosamente');
            const modal = bootstrap.Modal.getInstance(document.getElementById('eliminarUsuarioModal'));
            modal.hide();
            cargarUsuarios();
        } else {
            alert('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
});



function logout() {
    window.location.href = '/api/auth/logout';
}