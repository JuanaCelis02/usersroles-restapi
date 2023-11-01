import { Sequelize } from "sequelize";

//Name DB, DB, password
export const sequelize = new Sequelize('railway', 'postgres', 'RTyBktNoPF0VypbQ0RUO', {
     host: 'containers-us-west-62.railway.app',
     dialect: 'postgres',
     port: '5874'
})