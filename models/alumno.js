const { Sequelize } = require('sequelize');
const conexion = require('../config/database');
const bcrypt = require('bcryptjs');

const Alumno = conexion.define('Alumnos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    matricula: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    pass: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    saldo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    }
});

Alumno.beforeCreate(async (alumno) => {
    alumno.pass = await bcrypt.hash(alumno.pass, 10);
});

Alumno.prototype.compararPass = async function (pass) {
    return bcrypt.compare(pass, this.pass);
};

module.exports = Alumno;
