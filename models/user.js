const { Sequelize } = require('sequelize');
const conexion = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = conexion.define('Usuarios', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    pass: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    rol: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    saldo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,  
        defaultValue: 0.00  
    }
});

Usuario.beforeCreate(async (usuario) => {
    usuario.pass = await bcrypt.hash(usuario.pass, 10);
});

Usuario.prototype.compararPass = async function (pass) {
    return bcrypt.compare(pass, this.pass);
};

module.exports = Usuario;

