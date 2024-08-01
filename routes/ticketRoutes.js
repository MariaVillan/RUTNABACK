const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/comprar', ticketController.comprarBoleto);
router.get('/listar/:matricula', ticketController.listarBoletos);
router.post('/escanear', ticketController.escanearBoleto);

module.exports = router;
