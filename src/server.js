const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const servicioAsignadoRoutes = require('./routes/servicioAsignadoRoutes'); 
const productoRoutes = require('./routes/productoRoutes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());



// Configuración de la sesión
app.use(session({
    secret: 'mi_secreto_seguro', // Cambia esto por una cadena segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia a true si usas HTTPS en producción
}));

app.use(express.static('public'));

app.use('/api/auth', authRoutes); // Usar las rutas de autenticación
app.use('/api/admin', adminRoutes);
app.use('/api/servicio', servicioRoutes);
app.use('/api/productos', productoRoutes); // Rutas de productos
app.use('/api/servicioAsignado', servicioAsignadoRoutes);

// Ruta de inicio después del login
app.get('/servicio', (req, res) => { 
    if (req.session.user) {
        // Verifica si el usuario es administrador
        if (req.session.user.rol === 'Administrador') {
            // Redirige a la página de registro de empleados si es administrador
            res.sendFile(path.join(__dirname, '../public/crud.html'));
        } else {
            // De lo contrario, redirige a la página de servicio regular
            res.sendFile(path.join(__dirname, '../public/servicio.html'));
        }
    } else {
        // Redirige a la página de inicio de sesión si no hay sesión activa
        res.redirect('/');
    }
});

app.get('/api/auth/user-id', (req, res) => {
    if (req.session.fk_id_persona) {
        res.status(200).json({ fk_id_persona: req.session.fk_id_persona });
    } else {
        res.status(401).send('Usuario no autenticado');
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
