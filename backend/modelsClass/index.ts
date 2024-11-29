import { Sequelize } from 'sequelize';
import { Task } from './task';
import { User } from './user';
import { Assignment } from './assignments';

console.log("Hello")

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost', // or your database host
    username: 'postgres',
    password: 'pass',
    database: 'techweb',
    logging: (msg) => console.log(`Sequelize: ${msg}`),
    define: {
        timestamps: true // this will add createdAt and updatedAt fields
    }
});


const models = {
    User: User.initModel(sequelize),
    Task: Task.initModel(sequelize),
    Assignment: Assignment.initModel(sequelize),
};

// Set up associations
User.associate(models);
Task.associate(models);

// Sync database
async function syncDatabase() {
    try {
        // force: true will drop tables if they exist
        // alter: true will alter existing tables to match the model
        // Using neither will only create tables if they don't exist
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        await sequelize.sync({ 
            force:true
            // force: true  // uncomment to drop and recreate tables
            // alter: true  // uncomment to alter existing tables
        });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

// Run the sync
syncDatabase();

export { sequelize };