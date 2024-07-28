const Usuario = require('../models/user');
const jwt = require('jsonwebtoken');


// Registrar usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre_usuario, pass, rol, saldo } = req.body;
        const usuario = await Usuario.create({ nombre_usuario, pass, rol, saldo });
        res.status(201).json(usuario);
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

// Cargar saldo
exports.cargarSaldo = async (req, res) => {
    try {
        const { usuarioId, cantidad } = req.body;
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        usuario.saldo += cantidad;
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
