//Arranca la aplicaciòn

import app from './app.js'
import { sequelize } from "./database/database.js";

import "./models/Role.js"
import "./models/User.js"
import "./models/UserRole.js"

import dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT;

async function main(){
    try {
        await sequelize.sync({force:false});
        app.listen(PORT)
        console.log('Server is listening in port', PORT)
    } catch (error) {
        console.error('Unable to connect to the database', error)
    }
}

main();