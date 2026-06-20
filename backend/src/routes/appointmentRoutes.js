const express = require('express');

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// #Arquitectura basada en rutas, controladores y middlewares
// Las rutas delegan la lógica de citas al controlador correspondiente.

// #Rutas protegidas
// Todas las rutas requieren un token JWT válido.
router.use(verifyToken);

// #Autorización por rol
// Solo el administrador/nutriólogo puede administrar citas.
router.use(verifyAdmin);

// #Creación de APIs REST
// Endpoints CRUD para el módulo de citas.
router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;