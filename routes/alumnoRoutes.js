
const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumnoController');

router.post('/registrar', alumnoController.registrarAlumno);
router.post('/cargar-saldo', alumnoController.cargarSaldo);
router.put('/actualizar/:matricula', alumnoController.actualizarAlumno);
router.delete('/eliminar/:matricula', alumnoController.eliminarAlumno);


module.exports = router;
