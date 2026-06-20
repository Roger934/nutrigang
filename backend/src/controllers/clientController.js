const db = require('../config/db');

// #Cliente logueado
// Devuelve únicamente la información asociada al usuario autenticado.
const getClientProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [patients] = await db.query(
      `SELECT 
        id,
        user_id,
        full_name,
        age,
        gender,
        phone,
        notes,
        created_at
      FROM patients
      WHERE user_id = ?`,
      [userId]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        message: 'No existe un paciente vinculado a este usuario'
      });
    }

    const patient = patients[0];

    const [appointments] = await db.query(
      `SELECT 
        id,
        patient_id,
        appointment_date,
        status,
        notes
      FROM appointments
      WHERE patient_id = ?
      ORDER BY appointment_date ASC
      LIMIT 1`,
      [patient.id]
    );

    const [diets] = await db.query(
      `SELECT 
        id,
        patient_id,
        title,
        description,
        breakfast,
        snack1,
        lunch,
        snack2,
        dinner,
        created_at
      FROM diets
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 1`,
      [patient.id]
    );

    const [measurements] = await db.query(
      `SELECT 
        id,
        patient_id,
        weight,
        height,
        waist,
        hip,
        triceps,
        biceps,
        subscapular,
        suprailiac,
        cmb,
        created_at
      FROM measurements
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 1`,
      [patient.id]
    );

    const [calculations] = await db.query(
      `SELECT 
        id,
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
        carbs,
        created_at
      FROM nutrition_calculations
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 1`,
      [patient.id]
    );

    // #Respuestas y códigos HTTP adecuados
    // Devuelve información agrupada del paciente autenticado.
    res.status(200).json({
      patient,
      nextAppointment: appointments[0] || null,
      latestDiet: diets[0] || null,
      latestMeasurement: measurements[0] || null,
      latestCalculation: calculations[0] || null
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener información del cliente',
      error: error.message
    });
  }
};

module.exports = {
  getClientProfile
};