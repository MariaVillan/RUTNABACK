require('dotenv').config(); // Carga las variables de entorno desde .env

const Sequelize = require('sequelize');

// Reemplaza `process.env.MYSQLHOST` con la dirección IP obtenida
const conexion = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
  host: '123.456.789.012', // Reemplaza esto con la dirección IP de tu base de datos
  port: process.env.MYSQLPORT,
  dialect: 'mysql',
  define: {
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Verificar la conexión
conexion.authenticate()
  .then(() => {
    console.log('Conexión de la bd establecida correctamente.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = conexion;
