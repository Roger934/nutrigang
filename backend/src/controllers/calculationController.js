const db = require('../config/db');
const { calculateNutritionData } = require('../services/calculationService');

// #Creación de APIs REST
// Calcula indicadores nutricionales y los guarda en MySQL.
const createCalculation = async (req, res) => {
  try {
    const {
      patient_id,
      measurement_id,
      activity_factor = 0.2,
      goal_adjustment = 0
    } = req.body;

    // #Validaciones de datos en backend
    // Verifica que exista paciente y medición para poder calcular.
    if (!patient_id || !measurement_id) {
      return res.status(400).json({
        message: 'Paciente y medición son obligatorios'
      });
    }

    const [patients] = await db.query(
      'SELECT id, age, gender FROM patients WHERE id = ?',
      [patient_id]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        message: 'Paciente no encontrado'
      });
    }

    const [measurements] = await db.query(
      'SELECT * FROM measurements WHERE id = ? AND patient_id = ?',
      [measurement_id, patient_id]
    );

    if (measurements.length === 0) {
      return res.status(404).json({
        message: 'Medición no encontrada para este paciente'
      });
    }

    const patient = patients[0];
    const measurement = measurements[0];

    const calculation = calculateNutritionData({
      weight: Number(measurement.weight),
      height: Number(measurement.height),
      age: Number(patient.age),
      gender: patient.gender,
      waist: Number(measurement.waist),
      hip: Number(measurement.hip),
      triceps: Number(measurement.triceps),
      biceps: Number(measurement.biceps),
      subscapular: Number(measurement.subscapular),
      suprailiac: Number(measurement.suprailiac),
      activityFactor: Number(activity_factor),
      goalAdjustment: Number(goal_adjustment)
    });

    const [result] = await db.query(
      `INSERT INTO nutrition_calculations
      (
        patient_id,
        bmi,
        bmi_diagnosis,
        ideal_weight,
        lorentz_weight,
        waist_hip_index,
        skinfold_sum,
        mifflin,
        harris_benedict,
        total_calories,
        proteins,
        fats,
        carbs
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        calculation.bmi,
        calculation.bmiDiagnosis,
        calculation.idealWeight,
        calculation.lorentzWeight,
        calculation.waistHipIndex,
        calculation.skinfoldSum,
        calculation.mifflin,
        calculation.harrisBenedict,
        calculation.totalCalories,
        calculation.proteins,
        calculation.fats,
        calculation.carbs
      ]
    );

    // #Respuestas y códigos HTTP adecuados
    // Devuelve 201 cuando el cálculo fue generado y guardado correctamente.
    res.status(201).json({
      message: 'Cálculo nutricional generado correctamente',
      calculationId: result.insertId,
      calculation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al generar cálculo nutricional',
      error: error.message
    });
  }
};

// #Consultas a la base de datos
// Obtiene todos los cálculos registrados.
const getCalculations = async (req, res) => {
  try {
    const [calculations] = await db.query(
      `SELECT
        nutrition_calculations.*,
        patients.full_name AS patient_name
      FROM nutrition_calculations
      INNER JOIN patients ON nutrition_calculations.patient_id = patients.id
      ORDER BY nutrition_calculations.created_at DESC`
    );

    res.status(200).json(calculations);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener cálculos',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Obtiene un cálculo específico usando :id.
const getCalculationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [calculations] = await db.query(
      `SELECT
        nutrition_calculations.*,
        patients.full_name AS patient_name
      FROM nutrition_calculations
      INNER JOIN patients ON nutrition_calculations.patient_id = patients.id
      WHERE nutrition_calculations.id = ?`,
      [id]
    );

    if (calculations.length === 0) {
      return res.status(404).json({
        message: 'Cálculo no encontrado'
      });
    }

    res.status(200).json(calculations[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener cálculo',
      error: error.message
    });
  }
};

// #Rutas con parámetros
// Obtiene los cálculos asociados a un paciente usando :patientId.
const getCalculationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const [calculations] = await db.query(
      `SELECT *
       FROM nutrition_calculations
       WHERE patient_id = ?
       ORDER BY created_at DESC`,
      [patientId]
    );

    res.status(200).json(calculations);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener cálculos del paciente',
      error: error.message
    });
  }
};

// #Bajas a registros en la base de datos
// Elimina un cálculo nutricional por su id.
const deleteCalculation = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM nutrition_calculations WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Cálculo no encontrado'
      });
    }

    res.status(200).json({
      message: 'Cálculo eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar cálculo',
      error: error.message
    });
  }
};

module.exports = {
  createCalculation,
  getCalculations,
  getCalculationById,
  getCalculationsByPatient,
  deleteCalculation
};