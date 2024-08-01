const Alumno = require('../models/alumno');
const Ruta = require('../models/route');
const Boleto = require('../models/ticket');
const QRCode = require('qrcode');
const moment = require('moment');
const { Op } = require('sequelize');

// Comprar boleto
exports.comprarBoleto = async (req, res) => {
    try {
        const { matricula, destino } = req.body;

        // Buscar alumno por matrícula
        const alumno = await Alumno.findOne({ where: { matricula } });
        if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

        // Buscar ruta por destino
        const ruta = await Ruta.findOne({ where: { destino } });
        if (!ruta) return res.status(404).json({ error: 'Ruta no encontrada' });

        // Verificar saldo del alumno
        if (alumno.saldo < ruta.precio) return res.status(400).json({ error: 'Saldo insuficiente' });

        // Actualizar saldo del alumno
        alumno.saldo -= ruta.precio;
        await alumno.save();

        // Generar código QR
        const codigoQR = await QRCode.toDataURL(`Boleto: ${alumno.matricula}-${ruta.destino}-${Date.now()}`);
        const expiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Crear boleto
        const boleto = await Boleto.create({ matricula: alumno.matricula, destino: ruta.destino, codigoQR, expiracion });

        res.json(boleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar boletos por matrícula
exports.listarBoletos = async (req, res) => {
    const { matricula } = req.params;

    try {
        // Obtener alumno por matrícula
        const alumno = await Alumno.findOne({ where: { matricula } });
        if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

        // Obtener la fecha y hora actual
        const ahora = moment().toDate();

        // Buscar boletos no expirados para el alumno específico
        const boletos = await Boleto.findAll({
            where: {
                matricula: alumno.matricula,
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
