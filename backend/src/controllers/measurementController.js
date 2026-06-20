const db = require('../config/db');

// #Altas a la base de datos
// Registra mediciones antropométricas de un paciente.
const createMeasurement = async (req, res) => {
  try {
    const {
      patient_id,
      weight,
      height,
      waist,
      hip,
      triceps,
      biceps,
      subscapular,
      suprailiac,
      cmb
    } = req.body;

    // #Validaciones de datos en backend
    // Verifica paciente, peso y talla antes de registrar mediciones.
    if (!patient_id || !weight || !height) {
      return res.status(400).json({
        message: 'Paciente, peso y talla son obligatorios'
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
      `INSERT INTO measurements
      (
        patient_id,
        weight,
        height,
        waist,
        hip,
        triceps,
        biceps,
        subscapular,
        suprailiac,
        cmb
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        weight,
        height,
        waist || null,
        hip || null,
        triceps || null,
        biceps || null,
        subscapular || null,
        suprailiac || null,
        cmb || null
      ]
    );

    // #Respuestas y códigos HTTP adecuados
    // Devuelve 201 cuando la medición fue creada correctamente.
    res.status(201).json({
      message: 'Medición registrada correctamente',
      measurementId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar medición',
      error: error.message
    });
  }
};

// #Consultas a la base de datos
// Obtiene todas las mediciones junto con el nombre del paciente.
const getMeasurements = async (req, res) => {
  try {
    const [measurements] = await db.query(
      `SELECT
        measurements.id,
        measurements.patient_id,
        patients.full_name AS patient_name,
        measurements.weight,
        measurements.height,
        measurements.waist,
        measurements.hip,
        measurements.triceps,
        measurements.biceps,
        measurements.subscapular,
        measurements.suprailiac,
        measurements.cmb,
        measurements.created_at
      FROM measurements
      INNER JOIN patients ON measurements.patient_id = patients.id
      ORDER BY measurements.created_at DESC`
    );

    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener mediciones',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Obtiene una medición específica usando el parámetro :id.
const getMeasurementById = async (req, res) => {
  try {
    const { id } = req.params;

    const [measurements] = await db.query(
      `SELECT
        measurements.id,
        measurements.patient_id,
        patients.full_name AS patient_name,
        measurements.weight,
        measurements.height,
        measurements.waist,
        measurements.hip,
        measurements.triceps,
        measurements.biceps,
        measurements.subscapular,
        measurements.suprailiac,
        measurements.cmb,
        measurements.created_at
      FROM measurements
      INNER JOIN patients ON measurements.patient_id = patients.id
      WHERE measurements.id = ?`,
      [id]
    );

    if (measurements.length === 0) {
      return res.status(404).json({
        message: 'Medición no encontrada'
      });
    }

    res.status(200).json(measurements[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener medición',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Obtiene todas las mediciones de un paciente específico usando :patientId.
const getMeasurementsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const [measurements] = await db.query(
      `SELECT *
       FROM measurements
       WHERE patient_id = ?
       ORDER BY created_at DESC`,
      [patientId]
    );

    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener mediciones del paciente',
      error: error.message
    });
  }
};

// #Cambios a registros en la base de datos
// Actualiza mediciones antropométricas existentes.
const updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      weight,
      height,
      waist,
      hip,
      triceps,
      biceps,
      subscapular,
      suprailiac,
      cmb
    } = req.body;

    if (!patient_id || !weight || !height) {
      return res.status(400).json({
        message: 'Paciente, peso y talla son obligatorios'
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
      `UPDATE measurements
       SET
        patient_id = ?,
        weight = ?,
        height = ?,
        waist = ?,
        hip = ?,
        triceps = ?,
        biceps = ?,
        subscapular = ?,
        suprailiac = ?,
        cmb = ?
       WHERE id = ?`,
      [
        patient_id,
        weight,
        height,
        waist || null,
        hip || null,
        triceps || null,
        biceps || null,
        subscapular || null,
        suprailiac || null,
        cmb || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Medición no encontrada'
      });
    }

    res.status(200).json({
      message: 'Medición actualizada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar medición',
      error: error.message
    });
  }
};

// #Bajas a registros en la base de datos
// Elimina una medición usando su id.
const deleteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM measurements WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Medición no encontrada'
      });
    }

    res.status(200).json({
      message: 'Medición eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar medición',
      error: error.message
    });
  }
};

module.exports = {
  createMeasurement,
  getMeasurements,
  getMeasurementById,
  getMeasurementsByPatient,
  updateMeasurement,
  deleteMeasurement
};