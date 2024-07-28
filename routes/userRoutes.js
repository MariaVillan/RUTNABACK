const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/registrar', userController.registrarUsuario);
router.post('/login', userController.login);
router.post('/cargar-saldo', userController.cargarSaldo);

module.exports = router;
