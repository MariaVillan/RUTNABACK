const Usuario = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { usuario, pass, rol, saldo } = req.body;
        const nuevoUsuario = await Usuario.create({ usuario, pass, rol, saldo });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
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
        res.json(usuarios);
    } catch (error) {
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
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Actualizar usuario por ID
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params; 
        const { usuario, pass, rol, saldo } = req.body;

        const usuarioExistente = await Usuario.findByPk(id);
        if (!usuarioExistente) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (usuario) usuarioExistente.usuario = usuario;
        if (pass) usuarioExistente.pass = await bcrypt.hash(pass, 10);
        if (rol) usuarioExistente.rol = rol;
        if (saldo !== undefined) usuarioExistente.saldo = saldo;

        await usuarioExistente.save();

        res.json(usuarioExistente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params; 
        const resultado = await Usuario.destroy({
            where: { id }
        });

        if (resultado === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.status(204).end(); 
    } catch (error) {
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
        res.json({ token, rol: user.rol }); // Incluye el rol en la respuesta
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
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Convertir cantidad a número
        const cantidadDecimal = parseFloat(cantidad);
        if (isNaN(cantidadDecimal)) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        // Incrementar el saldo
        alumno.saldo = parseFloat(alumno.saldo) + cantidadDecimal;
        await alumno.save();

        // Retornar el usuario actualizado sin el campo de pass
        const { pass: _, ...response } = alumno.toJSON();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener logs
exports.logs = async (req, res) => {
    try {
        const logs = await Log.findAll({
            attributes: ['accion', 'detalle', 'fecha'] 
        });

        res.status(200).json(logs);
    } catch (error) {
        console.error('Error al obtener los registros:', error);
        res.status(500).json({ error: error.message });
    }
};

