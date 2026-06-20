const db = require('../config/db');

// #Altas a la base de datos
// Registra una nueva cita asociada a un paciente.
const createAppointment = async (req, res) => {
  try {
    const { patient_id, appointment_date, status = 'pending', notes } = req.body;

    // #Validaciones de datos en backend
    // Verifica que la cita tenga paciente y fecha antes de guardarse.
    if (!patient_id || !appointment_date) {
      return res.status(400).json({
        message: 'El paciente y la fecha de la cita son obligatorios'
      });
    }

    const [patient] = await db.query(
      'SELECT id FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        message: 'El paciente no existe'
      });
    }

    const [result] = await db.query(
      `INSERT INTO appointments 
      (patient_id, appointment_date, status, notes)
      VALUES (?, ?, ?, ?)`,
      [patient_id, appointment_date, status, notes || null]
    );

    // #Respuestas y códigos HTTP adecuados
    // Devuelve 201 cuando la cita fue creada correctamente.
    res.status(201).json({
      message: 'Cita registrada correctamente',
      appointmentId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar cita',
      error: error.message
    });
  }
};

// #Consultas a la base de datos
// Obtiene todas las citas junto con el nombre del paciente.
const getAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query(
      `SELECT 
        appointments.id,
        appointments.patient_id,
        patients.full_name AS patient_name,
        appointments.appointment_date,
        appointments.status,
        appointments.notes
      FROM appointments
      INNER JOIN patients ON appointments.patient_id = patients.id
      ORDER BY appointments.appointment_date ASC`
    );

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener citas',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Obtiene una cita específica usando el parámetro :id.
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [appointments] = await db.query(
      `SELECT 
        appointments.id,
        appointments.patient_id,
        patients.full_name AS patient_name,
        appointments.appointment_date,
        appointments.status,
        appointments.notes
      FROM appointments
      INNER JOIN patients ON appointments.patient_id = patients.id
      WHERE appointments.id = ?`,
      [id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        message: 'Cita no encontrada'
      });
    }

    res.status(200).json(appointments[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener cita',
      error: error.message
    });
  }
};

// #Cambios a registros en la base de datos
// Actualiza la fecha, estado o notas de una cita.
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, appointment_date, status, notes } = req.body;

    if (!patient_id || !appointment_date) {
      return res.status(400).json({
        message: 'El paciente y la fecha de la cita son obligatorios'
      });
    }

    const [patient] = await db.query(
      'SELECT id FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        message: 'El paciente no existe'
      });
    }

    const [result] = await db.query(
      `UPDATE appointments
       SET patient_id = ?, appointment_date = ?, status = ?, notes = ?
       WHERE id = ?`,
      [patient_id, appointment_date, status || 'pending', notes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Cita no encontrada'
      });
    }

    res.status(200).json({
      message: 'Cita actualizada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar cita',
      error: error.message
    });
  }
};

// #Bajas a registros en la base de datos
// Elimina una cita usando su id.
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM appointments WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Cita no encontrada'
      });
    }

    res.status(200).json({
      message: 'Cita eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar cita',
      error: error.message
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};