const express = require('express');
const { consultarServiciosSolicitados,obtenerTiposServicio, registrarServicio } = require('../controllers/servicioController');

const router = express.Router();
router.get('/solicitados/:id_persona', consultarServiciosSolicitados);
router.get('/tipos', obtenerTiposServicio);
router.post('/registrar', registrarServicio);



module.exports = router;
