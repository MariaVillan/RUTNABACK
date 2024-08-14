const Usuario = require('../models/user');
const Log = require('../models/log');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { usuario, pass, rol, saldo } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { usuario } });
        if (usuarioExistente) {
            await Log.create({
                accion: 'Registrar Usuario',
                detalle: `Intento fallido de registro. El usuario con nombre ${usuario} ya existe.`,
                fecha: new Date()
            });
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const nuevoUsuario = await Usuario.create({ usuario, pass, rol, saldo });

        await Log.create({
            accion: 'Registrar Usuario',
            detalle: `Se registró un nuevo usuario con nombre ${usuario} y rol ${rol}.`,
            fecha: new Date()
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        await Log.create({
            accion: 'Registrar Usuario',
            detalle: `Error al registrar usuario: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

// Obtener choferes y administradores
exports.obtenerAdmins = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            where: {
                rol: ['chofer', 'admin']
            }
        });

        await Log.create({
            accion: 'Obtener Admins',
            detalle: `Se obtuvieron ${usuarios.length} usuarios con rol de chofer o admin.`,
            fecha: new Date()
        });

        res.json(usuarios);
    } catch (error) {
        await Log.create({
            accion: 'Obtener Admins',
            detalle: `Error al obtener admins y choferes: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

// Obtener alumnos
exports.obtenerAlumnos = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            where: {
                rol: 'alumno'
            }
        });

        await Log.create({
            accion: 'Obtener Alumnos',
            detalle: `Se obtuvieron ${usuarios.length} usuarios con rol de alumno.`,
            fecha: new Date()
        });

        res.json(usuarios);
    } catch (error) {
        await Log.create({
            accion: 'Obtener Alumnos',
            detalle: `Error al obtener alumnos: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario por nombre de usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { usuario } = req.params;
        const { pass, rol, saldo } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { usuario } });
        if (!usuarioExistente) {
            await Log.create({
                accion: 'Actualizar Usuario',
                detalle: `Usuario con nombre ${usuario} no encontrado.`,
                fecha: new Date()
            });
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (pass) usuarioExistente.pass = await bcrypt.hash(pass, 10);
        if (rol) usuarioExistente.rol = rol;
        if (saldo !== undefined) usuarioExistente.saldo = saldo;

        await usuarioExistente.save();

        await Log.create({
            accion: 'Actualizar Usuario',
            detalle: `Se actualizó el usuario con nombre ${usuario}.`,
            fecha: new Date()
        });

        res.json(usuarioExistente);
    } catch (error) {
        await Log.create({
            accion: 'Actualizar Usuario',
            detalle: `Error al actualizar usuario con nombre ${usuario}: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario por ID
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params; 

        const usuarioExistente = await Usuario.findOne({ where: { id } });
        if (!usuarioExistente) {
            await Log.create({
                accion: 'Eliminar Usuario',
                detalle: `Usuario con ID ${id} no encontrado.`,
                fecha: new Date()
            });
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const resultado = await Usuario.destroy({
            where: { id }
        });

        if (resultado === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        await Log.create({
            accion: 'Eliminar Usuario',
            detalle: `Se eliminó el usuario con ID ${id}.`,
            fecha: new Date()
        });

        res.status(204).end(); 
    } catch (error) {
        await Log.create({
            accion: 'Eliminar Usuario',
            detalle: `Error al eliminar usuario con ID ${id}: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { usuario, pass } = req.body;
        const user = await Usuario.findOne({ where: { usuario } });
        if (!user || !(await user.compararPass(pass))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ usuarioId: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cargar saldo para usuarios tipo alumno
exports.cargarSaldo = async (req, res) => {
    try {
        const { usuario, cantidad } = req.body;
        const alumno = await Usuario.findOne({ where: { usuario, rol: 'alumno' } });
        if (!alumno) {
            await Log.create({
                accion: 'Cargar Saldo',
                detalle: `Alumno ${usuario} no encontrado.`,
                fecha: new Date()
            });
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        const cantidadDecimal = parseFloat(cantidad);
        if (isNaN(cantidadDecimal)) {
            await Log.create({
                accion: 'Cargar Saldo',
                detalle: `Cantidad inválida ${cantidad} para el alumno ${usuario}.`,
                fecha: new Date()
            });
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        alumno.saldo = parseFloat(alumno.saldo) + cantidadDecimal;
        await alumno.save();

        await Log.create({
            accion: 'Cargar Saldo',
            detalle: `Se cargó un saldo de ${cantidad} al alumno ${usuario}.`,
            fecha: new Date()
        });

        const { pass: _, ...response } = alumno.toJSON();
        res.status(200).json(response);
    } catch (error) {
        await Log.create({
            accion: 'Cargar Saldo',
            detalle: `Error al cargar saldo para el alumno ${usuario}: ${error.message}`,
            fecha: new Date()
        });
        res.status(500).json({ error: error.message });
    }
};

//Logs
exports.obtenerLogs = async (req, res) => {
    try {
        const logs = await Log.findAll(); 
        res.status(200).json(logs); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
