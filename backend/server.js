const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const measurementRoutes = require('./src/routes/measurementRoutes');
const calculationRoutes = require('./src/routes/calculationRoutes');
const dietRoutes = require('./src/routes/dietRoutes');
const clientRoutes = require('./src/routes/clientRoutes');


require('dotenv').config();

const db = require('./src/config/db');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/client', clientRoutes);


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API NutriGang funcionando correctamente'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');

    res.status(200).json({
      message: 'Conexión a MySQL funcionando',
      database: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al conectar con MySQL',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});