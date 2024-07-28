const Ruta = require('../models/route');

// Agregar ruta
exports.agregarRuta = async (req, res) => {
    try {
        const { destino, precio } = req.body;
        const ruta = await Ruta.create({ destino, precio });
        res.status(201).json(ruta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar ruta
exports.eliminarRuta = async (req, res) => {
    try {
        const { id } = req.params;
        await Ruta.destroy({ where: { id } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
