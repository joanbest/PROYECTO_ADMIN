

async function cargarRoles() {
    try {
        const response = await fetch('/api/admin/roles');
        if (!response.ok) throw new Error('Error al obtener los roles');
        
        const roles = await response.json();
        const rolSelect = document.getElementById('id_rol');

        // Vacía el combo box antes de llenarlo
        rolSelect.innerHTML = '<option value="">Seleccione un rol</option>';

        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.id_rol;
            option.textContent = rol.nombre_rol;
            rolSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los roles:', error);
        alert('No se pueden cargar los roles en este momento');
    }
}

// Llama a la función cargarRoles cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarRoles);

// Manejo del envío del formulario para registrar el usuario

document.getElementById('registroUsuarioForm').addEventListener('submit', async function(event) {
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
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Usuario registrado exitosamente');
            document.getElementById('registroUsuarioForm').reset();
        } else {
            alert('Error al registrar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el usuario');
    }
});

function logout() {
    window.location.href = '/api/auth/logout';
}