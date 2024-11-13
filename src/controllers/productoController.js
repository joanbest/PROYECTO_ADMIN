const { sql, poolPromise } = require('../db/db');

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    const { nombre_producto,contenido_neto, cantidad_producto, fk_tipo_producto, fk_presentacion_producto } = req.body;
    
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_producto', sql.NVarChar, nombre_producto)
            .input('contenido_neto', sql.NVarChar, contenido_neto)
            .input('cantidad_producto', sql.Int, cantidad_producto)
            .input('fk_tipo_producto', sql.Int, fk_tipo_producto)
            .input('fk_presentacion_producto', sql.Int, fk_presentacion_producto)
            .query(`
                INSERT INTO Producto (nombre_producto,
                contenido_neto, cantidad_producto, fk_tipo_producto, fk_presentacion_producto)
                VALUES (@nombre_producto, @contenido_neto,@cantidad_producto, @fk_tipo_producto, @fk_presentacion_producto)
            `);

        res.status(201).send('Producto registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar producto:', error);
        res.status(500).send('Error al registrar producto');
    }
};

// Obtener tipos de producto
const obtenerTiposProducto = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id_tipo_producto, nombre_tipo_producto FROM Tipo_producto WHERE estado_tipo_producto = 1');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener tipos de producto:', error);
        res.status(500).send('Error al obtener tipos de producto');
    }
};

// Obtener presentaciones de producto
const obtenerPresentacionesProducto = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id_presentacion_producto, nombre_presentacion_producto FROM Presentacion_producto');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener presentaciones de producto:', error);
        res.status(500).send('Error al obtener presentaciones de producto');
    }
};

module.exports = { crearProducto, obtenerTiposProducto, obtenerPresentacionesProducto };
