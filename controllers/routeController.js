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

// Actualizar ruta por ID
exports.actualizarRuta = async (req, res) => {
    try {
        const { id } = req.params; // Obtener ID de los parámetros de la URL
        const { precio } = req.body; // Obtener precio del cuerpo de la solicitud

        // Buscar la ruta por ID
        const ruta = await Ruta.findByPk(id);

        if (!ruta) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        // Actualizar el precio si se proporciona
        if (precio !== undefined) ruta.precio = precio;
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
