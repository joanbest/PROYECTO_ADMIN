function showForm(formType) {
    // Ocultar todos los formularios
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar el formulario seleccionado
    if (formType === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelectorAll('.tab')[0].classList.add('active');
    } else if (formType === 'register') {
        document.getElementById('registerForm').classList.add('active');
        document.querySelectorAll('.tab')[1].classList.add('active');
    }
}

function showRecoveryForm() {
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById('recoveryForm').classList.add('active');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            // Redirige a la página indicada en el backend
            window.location.href = result.redirectTo;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema al iniciar sesión. Inténtalo de nuevo.');
    }
}


async function handleRegister(event) {
    event.preventDefault();
    let isValid = true;

    const fields = {
        'primer-nombre': 'El primer nombre es requerido',
        'primer-apellido': 'El primer apellido es requerido',
        'fecha-nacimiento': 'La fecha de nacimiento es requerida',
        'email': 'El email es requerido',
        'username': 'El nombre de usuario es requerido',
        'password': 'La contraseña es requerida',
        'telefono': 'El teléfono es requerido',
        'direccion': 'La dirección es requerida'
    };

    // Validar campos requeridos
    for (let [id, message] of Object.entries(fields)) {
        const value = document.getElementById(id).value;
        if (!value) {
            document.getElementById(`${id}-error`).textContent = message;
            document.getElementById(`${id}-error`).style.display = 'block';
            isValid = false;
        } else {
            document.getElementById(`${id}-error`).style.display = 'none';
        }
    }

    // Validaciones específicas de email y contraseña
    const email = document.getElementById('email').value;
    if (email && !validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Email inválido';
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    }

    

    if (isValid) {
        try {
            const formData = {
                firstname: document.getElementById('primer-nombre').value,
                secondname: document.getElementById('segundo-nombre').value,
                firstlastname: document.getElementById('primer-apellido').value,
                secondlastname: document.getElementById('segundo-apellido').value,
                dateborn: document.getElementById('fecha-nacimiento').value,
                email,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                telephone: document.getElementById('telefono').value,
                address: document.getElementById('direccion').value,
            };

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const message = await response.text();
            if (response.ok) {
                document.getElementById('register-success').style.display = 'block';
                alert('Registro exitoso');
                showForm('login');
            } else {
                alert(`Error: ${message}`);
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Hubo un problema al registrarse. Inténtalo de nuevo.');
        }
    }
    return false;
}
