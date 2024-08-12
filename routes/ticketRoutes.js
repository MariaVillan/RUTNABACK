const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authenticateToken = require('../middleware/auth');

router.post('/comprar', authenticateToken, ticketController.comprarBoleto);
router.get('/listar/:usuario', authenticateToken, ticketController.listarBoletos);
router.post('/escanear', authenticateToken, ticketController.escanearBoleto);

module.exports = router;
