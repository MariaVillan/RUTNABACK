const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authenticateToken = require('../middleware/auth');

router.post('/comprar', authenticateToken, ticketController.comprarBoleto);
router.get('/listar', ticketController.listarBoletos);
router.get('/versaldo', authenticateToken, ticketController.verSaldo);
router.post('/escanearBoleto', ticketController.buscarBoleto, ticketController.escanearBoleto);


module.exports = router;
