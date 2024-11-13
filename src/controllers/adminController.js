const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../db/db');

const obtenerUsuarios = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM VistaUsuarios');
        result.recordset.map(usuario => {
            usuario.fecha_nacimiento_persona = usuario.fecha_nacimiento_persona
                ? usuario.fecha_nacimiento_persona.toISOString().split('T')[0]
                : null;
            return usuario;
        });
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al obtener usuarios');
    }
};

const obtenerUsuario = async (req, res) => {
    const { id_persona } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_persona', sql.Int, id_persona)
            .query(`
                SELECT id_persona, nombre_usuario, email_persona, fecha_nacimiento_persona, fk_rol
                FROM Persona
                WHERE id_persona = @id_persona
            `);
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error al obtener usuario');
    }
};

function esMayorDeEdad(dateborn) {
    const hoy = new Date();
    const fechaNacimiento = new Date(dateborn);
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    return (edad > 18) || (edad === 18 && hoy >= new Date(fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() + 18)));
}

const registrarUsuario = async (req, res) => {
    const { firstname, secondname, firstlastname, secondlastname, dateborn, email, username, password, telephone, address, id_rol } = req.body.data;

    if (!esMayorDeEdad(dateborn)) {
        return res.status(400).send('El usuario debe ser mayor de 18 años');
    }

    try {
        const pool = await poolPromise;

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inicia una transacción
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Inserta el teléfono
            const telephoneResult = await transaction.request()
                .input('telephone', sql.BigInt, telephone)
                .query(`INSERT INTO Telefono_persona (telefono_persona) OUTPUT INSERTED.id_telefono_persona VALUES (@telephone)`);
            const telephoneId = telephoneResult.recordset[0].id_telefono_persona;

            // Inserta la dirección
            const addressResult = await transaction.request()
                .input('address', sql.NVarChar, address)
                .query(`INSERT INTO Direccion_persona (direccion_persona) OUTPUT INSERTED.id_direccion_persona VALUES (@address)`);
            const addressId = addressResult.recordset[0].id_direccion_persona;

            // Inserta el usuario
            await transaction.request()
                .input('nombre1_persona', sql.NVarChar, firstname)
                .input('nombre2_persona', sql.NVarChar, secondname)
                .input('apellido1_persona', sql.NVarChar, firstlastname)
                .input('apellido2_persona', sql.NVarChar, secondlastname)
                .input('fecha_nacimiento_persona', sql.Date, dateborn)
                .input('email_persona', sql.NVarChar, email)
                .input('nombre_usuario', sql.NVarChar, username)
                .input('contrasenia_usuario', sql.NVarChar, hashedPassword)
                .input('fk_rol', sql.Int, id_rol)
                .input('fk_telefono_persona', sql.Int, telephoneId)
                .input('fk_direccion_persona', sql.Int, addressId)
                .execute('sp_InsertarUsuario');

            // Confirma la transacción
            await transaction.commit();
            res.status(201).send('Usuario registrado exitosamente');
        } catch (error) {
            await transaction.rollback(); // Reversión en caso de error en la transacción
            throw error;
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
};
const obtenerRoles = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id_rol, nombre_rol FROM Rol');
        
        res.status(200).json(result.recordset); 
     } catch (error) {
            console.error('Error al obtener los roles:', error);
            res.status(500).send('Error al obtener los roles');
        }
    };


    const actualizarUsuario = async (req, res) => {
        const { id_persona, nombre_usuario, email_persona, fecha_nacimiento_persona, fk_rol } = req.body;
        try {
            const pool = await poolPromise;
            // Inicia una transacción
            const transaction = new sql.Transaction(pool);
            await transaction.begin();
            try {
            await transaction.request()
                .input('id_persona', sql.Int, id_persona)
                .input('nombre_usuario', sql.NVarChar, nombre_usuario)
                .input('email_persona', sql.NVarChar, email_persona)
                .input('fecha_nacimiento_persona', sql.Date, fecha_nacimiento_persona)
                .input('fk_rol', sql.Int, fk_rol)
                .execute('sp_ActualizarDatosUsuario');
            await transaction.commit();
            res.status(201).send('Usuario registrado exitosamente');
        } catch (error) {
            await transaction.rollback(); // Reversión en caso de error en la transacción
            throw error;
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).send('Error al actualizar el usuario');
    }
};
    
    // Eliminar un usuario por ID
    const eliminarUsuario = async (req, res) => {
        const { id_persona } = req.params;
        try {
            const pool = await poolPromise;
            // Inicia una transacción
            const transaction = new sql.Transaction(pool);
            await transaction.begin();
            try{
            await transaction.request()
                .input('id_persona', sql.Int, id_persona)
                .execute('sp_EliminarUsuario');
            
            await transaction.commit();
            res.status(200).send('Usuario eliminado exitosamente');
        } catch (error) {
            await transaction.rollback(); // Reversión en caso de error en la transacción
            throw error;
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).send('Error al eliminar el usuario');
    }
};
    
   
module.exports = { obtenerUsuarios, registrarUsuario, actualizarUsuario, obtenerUsuario, eliminarUsuario, obtenerRoles};
