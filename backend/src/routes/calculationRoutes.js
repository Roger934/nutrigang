const express = require('express');

const {
  createCalculation,
  getCalculations,
  getCalculationById,
  getCalculationsByPatient,
  deleteCalculation
} = require('../controllers/calculationController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// #Arquitectura basada en rutas, controladores y middlewares
// Define endpoints y delega los cálculos al controlador y servicio.

// #Rutas protegidas
// Requiere token JWT válido para usar la API.
router.use(verifyToken);

// #Autorización por rol
// Solo el administrador/nutriólogo puede generar y consultar cálculos.
router.use(verifyAdmin);

// #Creación de APIs REST
// API REST para cálculos nutricionales.
router.post('/', createCalculation);
router.get('/', getCalculations);
router.get('/patient/:patientId', getCalculationsByPatient);
router.get('/:id', getCalculationById);
router.delete('/:id', deleteCalculation);

module.exports = router;