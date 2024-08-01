const { Sequelize, DataTypes } = require('sequelize');
const conexion = require('../config/database');

const Boleto = conexion.define('Boleto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Alumnos', // Nombre de la tabla debe coincidir
            key: 'matricula',
        },
    },
    destino: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Rutas', // Nombre de la tabla debe coincidir
            key: 'destino',
        },
    },
    codigoQR: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    expiracion: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'boletos',
    timestamps: false,
});

module.exports = Boleto;
