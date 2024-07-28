const Usuario = require('../models/user');
const Ruta = require('../models/route');
const Boleto = require('../models/ticket');
const QRCode = require('qrcode');
const moment = require('moment');
const { Op } = require('sequelize'); // Importar Op
// Comparar boletos
exports.comprarBoleto = async (req, res) => {
    try {
        const { usuarioId, rutaId } = req.body;
        const usuario = await Usuario.findByPk(usuarioId);
        const ruta = await Ruta.findByPk(rutaId);
        if (!usuario || !ruta) return res.status(404).json({ error: 'Usuario o ruta no encontrados' });
        if (usuario.saldo < ruta.precio) return res.status(400).json({ error: 'Saldo insuficiente' });

        usuario.saldo -= ruta.precio;
        await usuario.save();

        const codigoQR = await QRCode.toDataURL(`Boleto: ${usuarioId}-${rutaId}-${Date.now()}`);
        const expiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const boleto = await Boleto.create({ usuarioId, rutaId, codigoQR, expiracion });
        res.json(boleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Listar boletos por id
exports.listarBoletos = async (req, res) => {
    const { usuarioId } = req.params;
    
    try {
        // Obtener la fecha y hora actual
        const ahora = moment().toDate();

        // Buscar boletos no expirados para el usuario específico
        const boletos = await Boleto.findAll({
            where: {
                usuarioId: usuarioId,
                expiracion: {
                    [Op.gt]: ahora // [Op.gt] significa "mayor que"
                }
            }
        });

        // Enviar respuesta
        res.status(200).json(boletos);
    } catch (error) {
        console.error('Error al listar boletos:', error);
        res.status(500).json({ mensaje: 'Error al listar boletos' });
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
