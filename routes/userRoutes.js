const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/registrar', userController.registrarUsuario);
router.post('/login', userController.login);
router.put('/actualizar/:id', userController.actualizarUsuario);
router.delete('/eliminar/:id', userController.eliminarUsuario);
router.get('/', userController.obtenerUsuarios);



module.exports = router;
