const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas de usuarios
router.post('/registrarUsuario', userController.registrarUsuario);
router.get('/obtenerAdmins', userController.obtenerAdmins);
router.get('/obtenerAlumnos', userController.obtenerAlumnos);
router.put('/actualizarUsuario/:id', userController.actualizarUsuario);
router.delete('/eliminarUsuario/:id', userController.eliminarUsuario);
router.post('/login', userController.login);
router.post('/cargarSaldo', userController.cargarSaldo);


module.exports = router;
