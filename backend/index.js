import express from 'express';
import sequelize from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';

// Import all models
import User from './models/user.js';
import Task from './models/task.js';
import TaskAssignment from './models/assignments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Define model associations
User.hasMany(User, { as: 'subordinates', foreignKey: 'manager_id' });
User.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });

User.hasMany(Task, { foreignKey: 'id_creator' });
Task.belongsTo(User, { foreignKey: 'id_creator' });

Task.belongsToMany(User, { through: TaskAssignment, foreignKey: 'task_id' });
User.belongsToMany(Task, { through: TaskAssignment, foreignKey: 'user_id' });

// Routes
app.use('/api/users', userRoutes);

// Database sync and server start
async function startServer() {
  try {
    // Using force: true will drop and recreate all tables
    // Remove force: true in production!
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

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
            email: 'manager1@company.com',
            password: 'hashed_password_2',
            user_type: 'Manager',
            manager_id: 1
          },
          {
            user_id: 3,
            email: 'manager2@company.com',
            password: 'hashed_password_3',
            user_type: 'Manager',
            manager_id: 1
          },
          {
            user_id: 4,
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
            email: 'executor1@company.com',
            password: 'hashed_password_5',
            user_type: 'Executor',
            manager_id: 2
          },
          {
            user_id: 6,
            email: 'executor2@company.com',
            password: 'hashed_password_6',
            user_type: 'Executor',
            manager_id: 2
          },
          {
            user_id: 7,
            email: 'executor3@company.com',
            password: 'hashed_password_7',
            user_type: 'Executor',
            manager_id: 3
          },
          {
            user_id: 8,
            email: 'executor4@company.com',
            password: 'hashed_password_8',
            user_type: 'Executor',
            manager_id: 3
          },
          {
            user_id: 9,
            email: 'executor5@company.com',
            password: 'hashed_password_9',
            user_type: 'Executor',
            manager_id: 4
          },
          {
            user_id: 10,
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
        await TaskAssignment.bulkCreate([
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
    

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();