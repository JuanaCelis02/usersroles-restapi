import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Role } from "./Role.js";

export const UserRole = sequelize.define('userRole', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

User.belongsToMany(Role, {through: UserRole})
Role.belongsToMany(User, {through: UserRole})

