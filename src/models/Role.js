import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Role = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roleName: {
        type: DataTypes.STRING
    },
    descriptionRole: {
        type: DataTypes.STRING
    },
    statusRole: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    creationDate: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
})