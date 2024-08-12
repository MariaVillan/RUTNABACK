const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController'); 
const authenticateToken = require('../middleware/auth');

router.post('/agregar', authenticateToken, routeController.agregarRuta);
router.get('/', authenticateToken, routeController.obtenerRutas); 
router.put('/actualizar/:id', authenticateToken, routeController.actualizarRuta);
router.delete('/eliminar/:id', authenticateToken, routeController.eliminarRuta);

module.exports = router;

