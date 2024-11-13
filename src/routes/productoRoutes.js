const express = require('express');
const { crearProducto, obtenerTiposProducto, obtenerPresentacionesProducto } = require('../controllers/productoController');
const router = express.Router();

router.post('/', crearProducto); // Ruta para crear un producto
router.get('/tipos', obtenerTiposProducto); // Ruta para obtener tipos de producto
router.get('/presentaciones', obtenerPresentacionesProducto); // Ruta para obtener presentaciones de producto

module.exports = router;
