const express = require('express');
const { obtenerUsuarios, registrarUsuario, actualizarUsuario, obtenerUsuario, eliminarUsuario, obtenerRoles } = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


// Rutas de administración de usuarios
router.get('/usuarios', obtenerUsuarios);           // Obtener todos los usuarios
router.get('/roles', obtenerRoles);                 // Obtener todos los roles
router.post('/registrar', registrarUsuario);            // Registrar nuevo usuario
router.put('/actualizar', actualizarUsuario);       // Actualizar usuario
router.get('/usuario/:id_persona', obtenerUsuario);// Obtener un usuario específico
router.delete('/usuarios/:id_persona', eliminarUsuario); 



module.exports = router;
