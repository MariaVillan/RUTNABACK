const { Sequelize } = require('sequelize');
const conexion = require('../config/database');

const Ruta = conexion.define('Rutas', {
    destino: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    precio: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
});

module.exports = Ruta;
