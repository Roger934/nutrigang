const express = require('express');
const { register, login, getClientUsers } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// #Creación de APIs REST
// Lista usuarios cliente para vincularlos con pacientes.
router.get('/clients', verifyToken, verifyAdmin, getClientUsers);

module.exports = router;