const Ruta = require('../models/route');

// Agregar ruta
exports.agregarRuta = async (req, res) => {
    try {
        const { destino, precio } = req.body;

        // Verificar si ya existe una ruta con el mismo destino
        const rutaExistente = await Ruta.findOne({ where: { destino } });

        if (rutaExistente) {
            return res.status(400).json({ error: 'Ya existe una ruta con ese destino' });
        }

        // Crear la nueva ruta
        const nuevaRuta = await Ruta.create({ destino, precio });
        res.status(201).json(nuevaRuta);
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
        const { id } = req.params;
        const { destino, precio } = req.body;

        const ruta = await Ruta.findByPk(id);

        if (!ruta) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        ruta.destino = destino || ruta.destino;
        ruta.precio = precio || ruta.precio;
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
