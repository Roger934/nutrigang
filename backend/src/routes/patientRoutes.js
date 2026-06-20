const express = require('express');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// #Arquitectura basada en rutas, controladores y middlewares
// Este archivo define rutas y delega la lógica al controlador.

// #Rutas protegidas
// Todas las rutas requieren token JWT válido.
router.use(verifyToken);

// #Autorización por rol
// Solo el administrador/nutriólogo puede administrar pacientes.
router.use(verifyAdmin);

// #Creación de APIs REST
// Endpoints CRUD para pacientes.
router.post('/', createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;