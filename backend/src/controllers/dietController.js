const db = require('../config/db');

// #Altas a la base de datos
// Registra una dieta manual asignada a un paciente.
const createDiet = async (req, res) => {
  try {
    const {
      patient_id,
      title,
      description,
      breakfast,
      snack1,
      lunch,
      snack2,
      dinner
    } = req.body;

    // #Validaciones de datos en backend
    // Verifica que exista paciente y título de la dieta.
    if (!patient_id || !title) {
      return res.status(400).json({
        message: 'Paciente y título de la dieta son obligatorios'
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
      `INSERT INTO diets
      (
        patient_id,
        title,
        description,
        breakfast,
        snack1,
        lunch,
        snack2,
        dinner
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        title,
        description || null,
        breakfast || null,
        snack1 || null,
        lunch || null,
        snack2 || null,
        dinner || null
      ]
    );

    // #Respuestas y códigos HTTP adecuados
    // Devuelve 201 cuando la dieta fue creada correctamente.
    res.status(201).json({
      message: 'Dieta registrada correctamente',
      dietId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar dieta',
      error: error.message
    });
  }
};

// #Consultas a la base de datos
// Obtiene todas las dietas junto con el nombre del paciente.
const getDiets = async (req, res) => {
  try {
    const [diets] = await db.query(
      `SELECT
        diets.id,
        diets.patient_id,
        patients.full_name AS patient_name,
        diets.title,
        diets.description,
        diets.breakfast,
        diets.snack1,
        diets.lunch,
        diets.snack2,
        diets.dinner,
        diets.created_at
      FROM diets
      INNER JOIN patients ON diets.patient_id = patients.id
      ORDER BY diets.created_at DESC`
    );

    res.status(200).json(diets);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener dietas',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Obtiene una dieta específica mediante el parámetro :id.
const getDietById = async (req, res) => {
  try {
    const { id } = req.params;

    const [diets] = await db.query(
      `SELECT
        diets.id,
        diets.patient_id,
        patients.full_name AS patient_name,
        diets.title,
        diets.description,
        diets.breakfast,
        diets.snack1,
        diets.lunch,
        diets.snack2,
        diets.dinner,
        diets.created_at
      FROM diets
      INNER JOIN patients ON diets.patient_id = patients.id
      WHERE diets.id = ?`,
      [id]
    );

    if (diets.length === 0) {
      return res.status(404).json({
        message: 'Dieta no encontrada'
      });
    }

    res.status(200).json(diets[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener dieta',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Consulta las dietas asignadas a un paciente específico.
const getDietsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const [diets] = await db.query(
      `SELECT *
       FROM diets
       WHERE patient_id = ?
       ORDER BY created_at DESC`,
      [patientId]
    );

    res.status(200).json(diets);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener dietas del paciente',
      error: error.message
    });
  }
};

// #Cambios a registros en la base de datos
// Actualiza una dieta existente.
const updateDiet = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      title,
      description,
      breakfast,
      snack1,
      lunch,
      snack2,
      dinner
    } = req.body;

    if (!patient_id || !title) {
      return res.status(400).json({
        message: 'Paciente y título de la dieta son obligatorios'
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
      `UPDATE diets
       SET
        patient_id = ?,
        title = ?,
        description = ?,
        breakfast = ?,
        snack1 = ?,
        lunch = ?,
        snack2 = ?,
        dinner = ?
       WHERE id = ?`,
      [
        patient_id,
        title,
        description || null,
        breakfast || null,
        snack1 || null,
        lunch || null,
        snack2 || null,
        dinner || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Dieta no encontrada'
      });
    }

    res.status(200).json({
      message: 'Dieta actualizada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar dieta',
      error: error.message
    });
  }
};

// #Bajas a registros en la base de datos
// Elimina una dieta usando su id.
const deleteDiet = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM diets WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Dieta no encontrada'
      });
    }

    res.status(200).json({
      message: 'Dieta eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar dieta',
      error: error.message
    });
  }
};

module.exports = {
  createDiet,
  getDiets,
  getDietById,
  getDietsByPatient,
  updateDiet,
  deleteDiet
};