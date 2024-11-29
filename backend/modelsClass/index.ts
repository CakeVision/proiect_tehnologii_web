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

async function create_mock_data(){

        // Insert Administrator
        const admin = await User.create({
            user_id: 1,
            email: 'admin@company.com',
            password: 'hashed_password_1',
            user_type: 'Administrator',
            manager_id: null
          });
      
          // Insert Managers
          const managers = await User.bulkCreate([
            {
              user_id: 2,
              name: "gigel",
              email: 'manager1@company.com',
              password: 'hashed_password_2',
              user_type: 'Manager',
              manager_id: 1
            },
            {
              user_id: 3,
              name: "gigel",
              email: 'manager2@company.com',
              password: 'hashed_password_3',
              user_type: 'Manager',
              manager_id: 1
            },
            {
              user_id: 4,
              name: "gigel",
              email: 'manager3@company.com',
              password: 'hashed_password_4',
              user_type: 'Manager',
              manager_id: 1
            }
          ]);
      
          // Insert Executors
          const executors = await User.bulkCreate([
            {
              user_id: 5,
              name: "gigel",
              email: 'executor1@company.com',
              password: 'hashed_password_5',
              user_type: 'Executor',
              manager_id: 2
            },
            {
              user_id: 6,
              name: "gigel",
              email: 'executor2@company.com',
              password: 'hashed_password_6',
              user_type: 'Executor',
              manager_id: 2
            },
            {
              user_id: 7,
              name: "gigel",
              email: 'executor3@company.com',
              password: 'hashed_password_7',
              user_type: 'Executor',
              manager_id: 3
            },
            {
              user_id: 8,
              name: "gigel",
              email: 'executor4@company.com',
              password: 'hashed_password_8',
              user_type: 'Executor',
              manager_id: 3
            },
            {
              user_id: 9,
              name: "gigel",
              email: 'executor5@company.com',
              password: 'hashed_password_9',
              user_type: 'Executor',
              manager_id: 4
            },
            {
              user_id: 10,
              name: "gigel",
              email: 'executor6@company.com',
              password: 'hashed_password_10',
              user_type: 'Executor',
              manager_id: 4
            }
          ]);
      
          // Insert Tasks
          const tasks = await Task.bulkCreate([
            {
              task_id: 1,
              id_creator: 2,
              title: 'Implement new feature X'
            },
            {
              task_id: 2,
              id_creator: 2,
              title: 'Fix bug in module Y'
            },
            {
              task_id: 3,
              id_creator: 3,
              title: 'Update documentation'
            },
            {
              task_id: 4,
              id_creator: 3,
              title: 'Performance optimization'
            },
            {
              task_id: 5,
              id_creator: 4,
              title: 'Security audit'
            },
            {
              task_id: 6,
              id_creator: 4,
              title: 'Code review for project Z'
            }
          ]);
      
          // Insert Task Assignments
          await Assignment.bulkCreate([
            { task_id: 1, user_id: 5 },
            { task_id: 1, user_id: 6 },
            { task_id: 2, user_id: 5 },
            { task_id: 3, user_id: 7 },
            { task_id: 3, user_id: 8 },
            { task_id: 4, user_id: 7 },
            { task_id: 5, user_id: 9 },
            { task_id: 5, user_id: 10 },
            { task_id: 6, user_id: 9 }
          ]);
      
}

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

        await create_mock_data();
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

// Run the sync
syncDatabase();

export { sequelize };