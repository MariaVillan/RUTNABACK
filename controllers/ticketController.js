const Usuario = require('../models/user');
const Ruta = require('../models/route');
const Boleto = require('../models/ticket');
const QRCode = require('qrcode');
const moment = require('moment');
const { Op } = require('sequelize');
const Log = require('../models/log');

exports.comprarBoleto = async (req, res) => {
    try {
        const { usuario, destino } = req.body;

        const usuarioEncontrado = await Usuario.findOne({ where: { usuario } });
        if (!usuarioEncontrado) return res.status(404).json({ error: 'Usuario no encontrado' });

        const ruta = await Ruta.findOne({ where: { destino } });
        if (!ruta) return res.status(404).json({ error: 'Ruta no encontrada' });

        if (usuarioEncontrado.saldo < ruta.precio) return res.status(400).json({ error: 'Saldo insuficiente' });

        usuarioEncontrado.saldo -= ruta.precio;
        await usuarioEncontrado.save();

        const codigoQR = await QRCode.toDataURL(`Boleto: ${usuarioEncontrado.usuario}-${ruta.destino}-${Date.now()}`);
        const expiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const boleto = await Boleto.create({
            matricula: usuarioEncontrado.usuario,
            destino: ruta.destino, 
            codigoQR, 
            expiracion
        });

        // Registro en la tabla logs
        await Log.create({
            accion: 'Comprar boleto',
            detalle: `El alumno con matricula ${usuarioEncontrado.matricula} compró un boleto para ${ruta.destino}`,
            fecha: new Date(),
        });

        res.json(boleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar boletos por el usuario obtenido del token
exports.listarBoletos = async (req, res) => {
    try {
        // Obtener usuarioId desde el token decodificado
        const usuarioId = req.user.usuarioId;

        // Buscar el usuario por id
        const usuarioEncontrado = await Usuario.findOne({ where: { id: usuarioId } });
        if (!usuarioEncontrado) return res.status(404).json({ error: 'Usuario no encontrado' });

        const ahora = moment().toDate();

        // Obtener boletos asociados al usuario con el id
        const boletos = await Boleto.findAll({
            where: {
                matricula: usuarioEncontrado.usuario, 
                expiracion: {
                    [Op.gt]: ahora 
                }
            }
        });

        res.status(200).json(boletos);
    } catch (error) {
        console.error('Error al listar boletos:', error);
        res.status(500).json({ mensaje: 'Error al listar boletos' });
    }
};


//Ver saldo
exports.verSaldo = async (req, res) => {
    try {
        const usuarioId = req.user.usuarioId;

        const usuarioEncontrado = await Usuario.findOne({ where: { id: usuarioId } });
        if (!usuarioEncontrado) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.status(200).json({ saldo: usuarioEncontrado.saldo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Escanear boletos
exports.escanearBoleto = async (req, res) => {
    try {
        const { codigoQR } = req.body;
        const boleto = await Boleto.findOne({ where: { codigoQR } });
        if (!boleto) return res.status(404).json({ error: 'Boleto no encontrado' });
        
        if (boleto.expiracion < new Date()) {
            return res.status(400).json({ error: 'Boleto expirado' });
        }

        await Boleto.destroy({ where: { codigoQR } });
        res.json({ mensaje: 'Boleto procesado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};