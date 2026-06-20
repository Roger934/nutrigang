const express = require('express');

const {
  createDiet,
  getDiets,
  getDietById,
  getDietsByPatient,
  updateDiet,
  deleteDiet
} = require('../controllers/dietController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// #Arquitectura basada en rutas, controladores y middlewares
// Define las rutas del módulo de dietas y delega la lógica al controlador.

// #Rutas protegidas
// Todas las rutas requieren token JWT válido.
router.use(verifyToken);

// #Autorización por rol
// Solo el administrador/nutriólogo puede administrar dietas.
router.use(verifyAdmin);

// #Creación de APIs REST
// Endpoints CRUD para dietas asignadas a pacientes.
router.post('/', createDiet);
router.get('/', getDiets);
router.get('/patient/:patientId', getDietsByPatient);
router.get('/:id', getDietById);
router.put('/:id', updateDiet);
router.delete('/:id', deleteDiet);

module.exports = router;