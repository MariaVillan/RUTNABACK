const Usuario = require('../models/user');
const Ruta = require('../models/route');
const Boleto = require('../models/ticket');
const QRCode = require('qrcode');
const moment = require('moment');
const { Op } = require('sequelize');

// Comprar boleto
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

        res.json(boleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar boletos por nombre de usuario
exports.listarBoletos = async (req, res) => {
    const { usuario } = req.params;

    try {
        const usuarioEncontrado = await Usuario.findOne({ where: { usuario } });
        if (!usuarioEncontrado) return res.status(404).json({ error: 'Usuario no encontrado' });

        const ahora = moment().toDate();

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

// Ver saldo de usuario
exports.verSaldo = async (req, res) => {
    try {
        const usuario = req.user; 

        const usuarioEncontrado = await Usuario.findOne({ where: { usuario } });
        if (!usuarioEncontrado) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.status(200).json({ saldo: usuarioEncontrado.saldo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Escanear boleto 
exports.escanearBoleto = async (req, res) => {
    try {
        const { codigoQR } = req.body;
        if (!codigoQR) return res.status(400).json({ error: 'Código QR es necesario' });

        // Verificar si el boleto existe y si ha expirado
        const query = 'SELECT * FROM boletos WHERE codigo = ?';
        db.query(query, [codigoQR], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al consultar el boleto' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Boleto no encontrado' });
            }

            const boleto = results[0];
            const fechaExpiracion = new Date(boleto.expiracion);

            if (fechaExpiracion < new Date()) {
                return res.status(400).json({ error: 'Boleto expirado' });
            }

            // Eliminar el boleto
            const deleteQuery = 'DELETE FROM boletos WHERE codigo = ?';
            db.query(deleteQuery, [codigoQR], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al eliminar el boleto' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Boleto no encontrado' });
                }

                res.status(200).json({ mensaje: 'Boleto procesado exitosamente' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
