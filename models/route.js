const { Sequelize, DataTypes } = require('sequelize');
const conexion = require('../config/database');

const Ruta = conexion.define('Ruta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    destino: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'rutas',
    timestamps: false 
});

module.exports = Ruta;
