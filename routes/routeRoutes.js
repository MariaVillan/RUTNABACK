const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController'); 

router.post('/agregar', routeController.agregarRuta);
router.get('/', routeController.obtenerRutas); 
router.put('/actualizar/:destino', routeController.actualizarRuta);
router.delete('/eliminar/:id', routeController.eliminarRuta);

module.exports = router;

