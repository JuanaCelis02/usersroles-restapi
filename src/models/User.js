import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js' //permite crear tablas y diseñar las relaciones de la BD

//Definicion de tabla (nombre de tabla, objeto define campos de tabla)
export const User = sequelize.define('users',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    imageUrl: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    numberDocument: {
        type: DataTypes.STRING
        
    },
    bithDate: {
        type: DataTypes.DATE
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    registrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    direction: {
        type: DataTypes.STRING
    }
}, {
    timestamps:false
})