const Usuario = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre_usuario, pass, rol } = req.body;
        const usuario = await Usuario.create({ nombre_usuario, pass, rol });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//Obtener todo
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Actualizar usuario por ID
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params; 
        const { nombre_usuario, pass, rol } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (nombre_usuario) usuario.nombre_usuario = nombre_usuario;
        if (pass) usuario.pass = await bcrypt.hash(pass, 10);
        if (rol) usuario.rol = rol;

        await usuario.save();

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Eliminar
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
        const { nombre_usuario, pass } = req.body;
        const usuario = await Usuario.findOne({ where: { nombre_usuario } });
        if (!usuario || !(await usuario.compararPass(pass))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ usuarioId: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

