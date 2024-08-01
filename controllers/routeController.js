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

// Obtener rutas
exports.obtenerRutas = async (req, res) => {
    try {
        const rutas = await Ruta.findAll();
        res.json(rutas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar ruta por destino
exports.actualizarRuta = async (req, res) => {
    try {
        const { destino } = req.params; // Obtener destino de los parámetros de la URL
        const { nuevoDestino, precio } = req.body; // Obtener datos de actualización del cuerpo de la solicitud

        // Buscar la ruta por destino
        const ruta = await Ruta.findOne({ where: { destino } });

        if (!ruta) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        // Actualizar la ruta
        if (nuevoDestino) ruta.destino = nuevoDestino; // Actualizar el destino si se proporciona
        if (precio !== undefined) ruta.precio = precio; // Actualizar el precio si se proporciona
        await ruta.save();

        res.status(200).json(ruta);
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
