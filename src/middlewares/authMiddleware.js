// Middleware para verificar el rol de administrador
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'Administrador') {
        return next(); // El usuario es administrador, continúa
    }
    return res.status(403).send('Acceso denegado: solo administradores pueden realizar esta acción');
};

module.exports = { isAdmin };
