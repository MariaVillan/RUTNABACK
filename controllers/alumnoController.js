const Alumno = require('../models/alumno');

// Registrar alumno
exports.registrarAlumno = async (req, res) => {
    try {
        const { matricula, pass, saldo } = req.body;
        const alumno = await Alumno.create({ matricula, pass, saldo });
        res.status(201).json(alumno);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar alumno
exports.actualizarAlumno = async (req, res) => {
    try {
        const { matricula } = req.params;
        const { pass, saldo } = req.body; 
        const alumno = await Alumno.findOne({ where: { matricula } });
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        if (pass !== undefined) alumno.pass = pass;
        if (saldo !== undefined) alumno.saldo = saldo;
        await alumno.save();
   
        const { pass: _, ...response } = alumno.toJSON();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar alumno
exports.eliminarAlumno = async (req, res) => {
    try {
        const { matricula } = req.params; 
        const alumno = await Alumno.findOne({ where: { matricula } });
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        await Alumno.destroy({ where: { matricula } });
        res.status(200).json({ message: 'Alumno eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Cargar saldo
exports.cargarSaldo = async (req, res) => {
    try {
        const { matricula, cantidad } = req.body;
        const alumno = await Alumno.findOne({ where: { matricula } });
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        alumno.saldo += parseFloat(cantidad);
        await alumno.save();

        const { pass: _, ...response } = alumno.toJSON();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

