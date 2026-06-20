const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificación de conexión al iniciar
(async () => {
  try {
    const connection = await pool.getConnection();

    console.log('✅ MySQL conectado correctamente');
    console.log(`📂 Base de datos: ${process.env.DB_NAME}`);

    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar MySQL');
    console.error(error.message);
  }
})();

module.exports = pool;