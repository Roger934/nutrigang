const express = require('express');
const { getClientProfile } = require('../controllers/clientController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// #Rutas protegidas
// El cliente debe estar autenticado para consultar su información.
router.use(verifyToken);

// #Creación de APIs REST
// API de solo lectura para el cliente logueado.
router.get('/profile', getClientProfile);

module.exports = router;