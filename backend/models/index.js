import fs from 'fs'
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import { Task } from './task';
import { User } from './user';


const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost', // or your database host
    username: 'your_username',
    password: 'your_password',
    database: 'your_database',
    logging: console.log, // set to false to disable logging
    define: {
        timestamps: true // this will add createdAt and updatedAt fields
    }
});

// Initialize models
User.initModel(sequelize);
Task.initModel(sequelize);

// Set up associations
User.associate({ Task });
Task.associate({ User });

// Sync database
async function syncDatabase() {
    try {
        // force: true will drop tables if they exist
        // alter: true will alter existing tables to match the model
        // Using neither will only create tables if they don't exist
        await sequelize.sync({ 
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