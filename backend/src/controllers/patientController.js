const db = require('../config/db');

// #Altas a la base de datos
// Permite registrar un nuevo paciente en MySQL desde una API REST.
const createPatient = async (req, res) => {
  try {
    const { user_id, full_name, age, gender, phone, notes } = req.body;

    // #Validaciones de datos en backend
    // Verifica datos obligatorios antes de guardar en la base de datos.
    if (!full_name) {
      return res.status(400).json({ message: 'El nombre del paciente es obligatorio' });
    }

    const [result] = await db.query(
      `INSERT INTO patients 
      (user_id, full_name, age, gender, phone, notes) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id || null, full_name, age || null, gender || null, phone || null, notes || null]
    );

    // #Respuestas y códigos HTTP adecuados
    // Devuelve 201 cuando el recurso fue creado correctamente.
    res.status(201).json({
      message: 'Paciente registrado correctamente',
      patientId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar paciente',
      error: error.message
    });
  }
};

// #Consultas a la base de datos
// Obtiene todos los pacientes registrados.
const getPatients = async (req, res) => {
  try {
    const [patients] = await db.query('SELECT * FROM patients ORDER BY id DESC');

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener pacientes',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Busca un paciente específico usando el parámetro :id.
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const [patients] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.status(200).json(patients[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener paciente',
      error: error.message
    });
  }
};

// #Cambios a registros en la base de datos
// Actualiza información de un paciente existente.
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, full_name, age, gender, phone, notes } = req.body;

    if (!full_name) {
      return res.status(400).json({ message: 'El nombre del paciente es obligatorio' });
    }

    const [result] = await db.query(
      `UPDATE patients 
       SET user_id = ?, full_name = ?, age = ?, gender = ?, phone = ?, notes = ?
       WHERE id = ?`,
      [user_id || null, full_name, age || null, gender || null, phone || null, notes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.status(200).json({ message: 'Paciente actualizado correctamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar paciente',
      error: error.message
    });
  }
};

// #Bajas a registros en la base de datos
// Elimina un paciente por su id.
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM patients WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.status(200).json({ message: 'Paciente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar paciente',
      error: error.message
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
};