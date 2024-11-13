const express = require('express');
const { obtenerServiciosAsignados } = require('../controllers/servicioAsignadoController');
const router = express.Router();

// Ruta para obtener los servicios asignados a un empleado
router.get('/servicioAsignado/:id_empleado', obtenerServiciosAsignados);

module.exports = router;