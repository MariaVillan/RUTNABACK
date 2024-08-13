const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authenticateToken = require('../middleware/auth');

router.post('/comprar', authenticateToken, ticketController.comprarBoleto);
router.get('/listar', ticketController.listarBoletos);
router.post('/escanear', authenticateToken, ticketController.escanearBoleto);
router.get('/versaldo', authenticateToken, ticketController.verSaldo);


module.exports = router;
