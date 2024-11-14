const { sql, poolPromise } = require('../db/db');



const registrarServicio = async (req, res) => {
    const { direccion_servicio, fecha_servicio, costo_servicio, fk_id_tipo_servicio } = req.body;


   const  fk_id_persona = req.session.user.id_persona; // Obtén el id_persona de la sesión
   
    if (!fk_id_persona) {
        return res.status(401).send('Usuario no autenticado');
    }


    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('direccion_servicio', sql.NVarChar, direccion_servicio)
            .input('fecha_servicio', sql.Date, fecha_servicio)
            .input('costo_servicio', sql.Float, costo_servicio)
            .input('fk_id_persona', sql.Int, fk_id_persona)
            .input('fk_id_tipo_servicio', sql.Int, fk_id_tipo_servicio)
            .execute('sp_InsertarServicio');
         
        res.status(201).send('Solicitud de servicio registrada exitosamente');
    } catch (error) {
        console.error('Error al registrar el servicio:', error);
        res.status(500).send('Error al registrar el servicio');
    }
};
const obtenerTiposServicio = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id_tipo_servicio, nombre_tipo_servicio FROM Tipo_servicio');
        
        res.status(200).json(result.recordset); // Enviar todos los tipos de servicio como JSON
    } catch (error) {
        console.error('Error al obtener los tipos de servicio:', error);
        res.status(500).send('Error al obtener los tipos de servicio');
    }
};

const consultarServiciosSolicitados = async (req, res) => { 
    const { fk_id_persona } = req.params;

    console.log('fk_id_persona recibido:', fk_id_persona); // Verificación

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('fk_id_persona', sql.Int, fk_id_persona)
            .query(`
                SELECT nombre_tipo_servicio, direccion_servicio, fecha_servicio, estado_servicio 
                FROM VistaServicios 
                WHERE fk_id_persona = @fk_id_persona;
            `);

        // Verifica si hay resultados en la consulta
        if (result.recordset.length === 0) {
            console.warn(`No se encontraron servicios para fk_id_persona = ${fk_id_persona}`);
            return res.status(404).json({ message: 'No se encontraron servicios para el usuario especificado' });
        }

        // Devuelve los datos en formato JSON
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al consultar servicios solicitados:', error.message); // Detalles del error
        res.status(500).json({ error: 'Error al consultar servicios solicitados', details: error.message });
    }
};


module.exports = { obtenerTiposServicio, consultarServiciosSolicitados,registrarServicio };
