//Arranca la aplicaciòn

import app from './app.js'
import { sequelize } from "./database/database.js";

import "./models/Role.js"
import "./models/User.js"
import "./models/UserRole.js"


async function main(){
    try {
        await sequelize.sync({force:false});
        //await sequelize.authenticate(); comprobar coneccion
        app.listen(4000)
        console.log('Server is listening in port', 4000)
    } catch (error) {
        console.error('Unable to connect to the database', error)
    }
}

main();