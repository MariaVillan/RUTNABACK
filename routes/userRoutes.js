const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

router.post('/registrarUsuario', userController.registrarUsuario);
router.get('/obtenerAdmins', userController.obtenerAdmins);
router.get('/obtenerAlumnos', userController.obtenerAlumnos);
router.put('/actualizarUsuario/:id', authenticateToken, userController.actualizarUsuario);
router.delete('/eliminarUsuario/:id', authenticateToken, userController.eliminarUsuario);
router.post('/login', userController.login);
router.post('/cargarSaldo', authenticateToken, userController.cargarSaldo);
router.get('/logs', userController.obtenerLogs);


module.exports = router;
