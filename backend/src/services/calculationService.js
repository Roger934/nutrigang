// #Manejo de datos y lógica
// Centraliza las fórmulas nutricionales fuera del controlador.

const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
};

const getBmiDiagnosis = (bmi) => {
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidad I';
  if (bmi < 40) return 'Obesidad II';
  return 'Obesidad III';
};

const calculateIdealWeight = (heightCm) => {
  const heightM = heightCm / 100;
  return 22 * (heightM * heightM);
};

const calculateLorentzWeight = (heightCm, gender) => {
  if (gender === 'female') {
    return heightCm - 100 - ((heightCm - 150) / 2.5);
  }

  return heightCm - 100 - ((heightCm - 150) / 4);
};

const calculateWaistHipIndex = (waist, hip) => {
  if (!waist || !hip) return null;
  return waist / hip;
};

const calculateSkinfoldSum = (triceps, biceps, subscapular, suprailiac) => {
  return Number(triceps || 0) +
    Number(biceps || 0) +
    Number(subscapular || 0) +
    Number(suprailiac || 0);
};

const calculateMifflin = (weight, heightCm, age, gender) => {
  if (gender === 'female') {
    return (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
  }

  return (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
};

const calculateHarrisBenedict = (weight, heightCm, age, gender) => {
  if (gender === 'female') {
    return 655.1 + (9.563 * weight) + (1.850 * heightCm) - (4.676 * age);
  }

  return 66.5 + (13.75 * weight) + (5.003 * heightCm) - (6.755 * age);
};

const calculateTotalCalories = (basalEnergy, activityFactor, goalAdjustment) => {
  return basalEnergy + (basalEnergy * activityFactor) + (basalEnergy * goalAdjustment);
};

const calculateMacros = (totalCalories) => {
  const proteinPercentage = 0.25;
  const fatPercentage = 0.25;
  const carbPercentage = 0.50;

  const proteins = (totalCalories * proteinPercentage) / 4;
  const fats = (totalCalories * fatPercentage) / 9;
  const carbs = (totalCalories * carbPercentage) / 4;

  return {
    proteins,
    fats,
    carbs
  };
};

const round = (value) => {
  if (value === null || value === undefined) return null;
  return Number(value.toFixed(2));
};

const calculateNutritionData = ({
  weight,
  height,
  age,
  gender,
  waist,
  hip,
  triceps,
  biceps,
  subscapular,
  suprailiac,
  activityFactor = 0.2,
  goalAdjustment = 0
}) => {
  const bmi = calculateBMI(weight, height);
  const bmiDiagnosis = getBmiDiagnosis(bmi);
  const idealWeight = calculateIdealWeight(height);
  const lorentzWeight = calculateLorentzWeight(height, gender);
  const waistHipIndex = calculateWaistHipIndex(waist, hip);
  const skinfoldSum = calculateSkinfoldSum(triceps, biceps, subscapular, suprailiac);
  const mifflin = calculateMifflin(weight, height, age, gender);
  const harrisBenedict = calculateHarrisBenedict(weight, height, age, gender);
  const totalCalories = calculateTotalCalories(mifflin, activityFactor, goalAdjustment);
  const macros = calculateMacros(totalCalories);

  return {
    bmi: round(bmi),
    bmiDiagnosis,
    idealWeight: round(idealWeight),
    lorentzWeight: round(lorentzWeight),
    waistHipIndex: round(waistHipIndex),
    skinfoldSum: round(skinfoldSum),
    mifflin: round(mifflin),
    harrisBenedict: round(harrisBenedict),
    totalCalories: round(totalCalories),
    proteins: round(macros.proteins),
    fats: round(macros.fats),
    carbs: round(macros.carbs)
  };
};

module.exports = {
  calculateNutritionData
};