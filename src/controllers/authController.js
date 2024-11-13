const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../db/db');

// Registro de usuario en varias tablas
const registerUser = async (req, res) => {
    const { firstname, secondname, firstlastname, secondlastname, dateborn, email, username, password, telephone, address } = req.body;

    const hoy = new Date();
    const fechaNacimiento = new Date(dateborn);
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const esMayorDeEdad = (edad > 18) || (edad === 18 && hoy >= new Date(fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() + 18)));

    if (!esMayorDeEdad) {
        return res.status(400).send('El usuario debe ser mayor de 18 años');
    }

    
    let transaction;
    try {
        const pool = await poolPromise;

        // Inicio de la transacción
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        // Inserta el registro en la tabla `telefono`
        const telephoneResult = await transaction.request()
            .input('telephone', sql.BigInt, telephone)
            .query(`INSERT INTO Telefono_persona (telefono_persona) OUTPUT INSERTED.id_telefono_persona VALUES (@telephone)`);
        const telephoneId = telephoneResult.recordset[0].id_telefono_persona;

        // Inserta el registro en la tabla `direccion`
        const addressResult = await transaction.request()
            .input('address', sql.NVARCHAR, address)
            .query(`INSERT INTO Direccion_persona (direccion_persona) OUTPUT INSERTED.id_direccion_persona VALUES (@address)`);
        const addressId = addressResult.recordset[0].id_direccion_persona;

        

        // Hashea la contraseña antes de insertarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserta el registro en la tabla `persona` usando las claves foráneas `telefono_id` y `direccion_id`
        await transaction.request()
            .input('nombre1_persona', sql.NVARCHAR, firstname)
            .input('nombre2_persona', sql.NVARCHAR, secondname)
            .input('apellido1_persona', sql.NVARCHAR, firstlastname)
            .input('apellido2_persona', sql.NVARCHAR, secondlastname) 
            .input('fecha_nacimiento_persona', sql.Date, fechaNacimiento)   
            .input('email_persona', sql.NVARCHAR, email)            
            .input('nombre_usuario', sql.NVARCHAR, username)        
            .input('contrasenia_usuario', sql.NVARCHAR, hashedPassword) 
            .input('fk_telefono_persona', sql.Int, telephoneId)   
            .input('fk_direccion_persona', sql.Int, addressId)     
            .execute('sp_InsertarPersona');

        // Confirma la transacción
        await transaction.commit();
        res.status(201).send('Registro exitoso');
    } catch (error) {
        console.error('Error al registrar usuario:', error);

        // Revertir la transacción en caso de error, si la transacción existe
        if (transaction) await transaction.rollback();

        res.status(500).send('Error al registrar usuario');
    }
};


// Inicio de sesión de usuario
// Ejemplo en loginUser
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT p.id_persona, p.nombre_usuario, p.contrasenia_usuario, r.nombre_rol, pr.nombre_permiso
                FROM Persona AS p
                INNER JOIN Rol AS r ON p.fk_rol = r.id_rol
                INNER JOIN Permiso_rol AS rp ON rp.fk_rol = r.id_rol
                INNER JOIN Permiso AS pr ON rp.fk_permiso = pr.id_permiso
                WHERE p.nombre_usuario = @username
            `);

        const user = result.recordset[0];
        if (!user) return res.status(400).send('Usuario no encontrado');

        const isMatch = await bcrypt.compare(password, user.contrasenia_usuario);
        if (!isMatch) return res.status(400).send('Contraseña incorrecta');

        // Obtiene todos los permisos del usuario
        const permisos = result.recordset.map(row => row.nombre_permiso);

        // Guarda el usuario, rol y permisos en la sesión
        req.session.user = {
            id_persona: user.id_persona,
            username: user.nombre_usuario,
            rol: user.nombre_rol,
            permisos
        };
        let redirectTo = '/';
        if (user.nombre_rol === 'Administrador') {
            redirectTo = '/crud.html'; // Página de crud de usuarios
        } else if(user.nombre_rol === 'empleado'){
            redirectTo = '/serviciosAsignados.html';
        }else{    
            redirectTo = '/servicio'; // Página general de servicios para rol cliente, empleado
        
        }
        return res.status(200).json({ message: 'Inicio de sesión exitoso', redirectTo });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
};

// Cierre de sesión del usuario
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/'); // Redirige al usuario a la página principal después del logout
    });
};






module.exports = { registerUser, loginUser, logoutUser};

