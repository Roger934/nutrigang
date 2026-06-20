const express = require('express');

const {
  createMeasurement,
  getMeasurements,
  getMeasurementById,
  getMeasurementsByPatient,
  updateMeasurement,
  deleteMeasurement
} = require('../controllers/measurementController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// #Arquitectura basada en rutas, controladores y middlewares
// Las rutas de mediciones delegan la lógica al controlador.

// #Rutas protegidas
// Todas las rutas requieren token JWT válido.
router.use(verifyToken);

// #Autorización por rol
// Solo el administrador/nutriólogo puede administrar mediciones.
router.use(verifyAdmin);

// #Creación de APIs REST
// Endpoints CRUD para mediciones antropométricas.
router.post('/', createMeasurement);
router.get('/', getMeasurements);
router.get('/patient/:patientId', getMeasurementsByPatient);
router.get('/:id', getMeasurementById);
router.put('/:id', updateMeasurement);
router.delete('/:id', deleteMeasurement);

module.exports = router;