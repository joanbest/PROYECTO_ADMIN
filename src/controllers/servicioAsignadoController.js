const { sql, poolPromise } = require('../db/db');

// Función para obtener los servicios asignados a un empleado específico
const obtenerServiciosAsignados = async (req, res) => {
    const { id_empleado } = req.params; // Obtiene el ID del empleado desde los parámetros de la URL

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_empleado', sql.Int, id_empleado)
            .query(`
                SELECT 
                    aa.id_asignacion_actividad,
                    aa.fecha_hora_asignacion,
                    aa.fecha_hora_finalizacion,
                    aa.pago_empleado,
                    a.nombre_actividad,
                    s.direccion_servicio,
                    s.fecha_servicio
                FROM 
                    Asignacion_actividad AS aa
                LEFT JOIN 
                    Actividad AS a ON aa.fk_actividad = a.id_actividad
                LEFT JOIN 
                    Servicio AS s ON aa.fk_servicio = s.id_servicio
                WHERE 
                    aa.fk_persona = @id_empleado AND
                    aa.estado_asignacion_actividad = 1;  -- Solo asignaciones activas
            `);

        res.status(200).json(result.recordset); // Devuelve el resultado en formato JSON
    } catch (error) {
        console.error('Error al obtener servicios asignados:', error);
        res.status(500).send('Error al obtener servicios asignados');
    }
};

module.exports = { obtenerServiciosAsignados };
