const { Sequelize } = require('sequelize');
const conexion = require('../config/database');

const Boleto = conexion.define('Boletos', {
    usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios', // Nombre de la tabla debe coincidir
            key: 'id',
        },
    },
    rutaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Rutas',
            key: 'id',
        },
    },
    codigoQR: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    expiracion: {
        type: Sequelize.DATE,
        allowNull: false,
    },
});

module.exports = Boleto;
