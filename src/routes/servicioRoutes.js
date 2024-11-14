const express = require('express');
const { obtenerTiposServicio,consultarServiciosSolicitados, registrarServicio } = require('../controllers/servicioController');

const router = express.Router();
router.get('/solicitados/:fk_id_persona', consultarServiciosSolicitados);
router.get('/tipos', obtenerTiposServicio);
router.post('/registrar', registrarServicio);



module.exports = router;
