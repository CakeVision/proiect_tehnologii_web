import { Task } from './task.model';
import { User, UserType } from './user.model';
import { Assignment } from './assignment.model';
import { Token } from './token.model';
import { Tags } from './tags.model';
import { TagLink } from './tag_link.model';
import { Sequelize } from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


console.log("Hello")
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true
    }
  },
  logging: (msg) => console.log(`Sequelize: ${msg}`),
  define: {
    timestamps: true
  }
});


async function generateTokens(user: User) {
  const accessToken = jwt.sign(
    {
      userId: user.getDataValue('id'),
      email: user.getDataValue('email'),
      userType: user.getDataValue('userType'),
    },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.getDataValue('id'),
      userType: user.getDataValue('userType')
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

const models = {
  User: User.initModel(sequelize),
  Task: Task.initModel(sequelize),
  Assignment: Assignment.initModel(sequelize),
  Token: Token.initModel(sequelize),
  Tags: Tags.initModel(sequelize),
  TagLink: TagLink.initModel(sequelize),
};

// Set up associations
User.associate(models);
Task.associate(models);
Assignment.associate(models)
Token.associate(models);
Tags.associate(models);
TagLink.associate(models);

async function create_mock_data() {
  // Insert Administrator
  await User.create({
    name: "gigel",
    userType: 'Administrator',
    email: 'admin@company.com',
    password: 'hashed_password_1',
    lastLogin: new Date(),
    managerId: undefined
  });
  // Insert Managers
  await User.bulkCreate([
    {
      name: "gigel",
      email: 'manager1@company.com',
      password: 'hashed_password_2',
      userType: 'Manager',
      lastLogin: new Date(),

    },
    {
      name: "gigel",
      email: 'manager2@company.com',
      password: 'hashed_password_3',
      lastLogin: new Date(),
      userType: 'Manager',
      managerId: 1
    },
    {
      name: "gigel",
      email: 'manager3@company.com',
      password: 'hashed_password_4',
      userType: 'Manager',
      lastLogin: new Date(),
      managerId: 1
    },
    {
      name: "username",
      email: "user@example.com",
      password: "password",
      userType: "Executor",
      lastLogin: new Date(),
      managerId: 1
    },
  ]);

  // Insert Executors
  await User.bulkCreate([
    {
      name: "gigel",
      email: 'executor1@company.com',
      password: 'hashed_password_5',
      userType: 'Executor',
      lastLogin: new Date(),
      managerId: 2
    },
    {
      name: "gigel",
      email: 'executor2@company.com',
      password: 'hashed_password_6',
      userType: 'Executor',
      lastLogin: new Date(),
      managerId: 2
    },
    {
      name: "gigel",
      email: 'executor3@company.com',
      password: 'hashed_password_7',
      userType: 'Executor',
      lastLogin: new Date(),
      managerId: 3
    },
    {
      name: "gigel",
      email: 'executor4@company.com',
      password: 'hashed_password_8',
      userType: 'Executor',
      lastLogin: new Date(),
      managerId: 3
    },
    {
      name: "gigel",
      email: 'executor5@company.com',
      password: 'hashed_password_9',
      userType: 'Executor',
      lastLogin: new Date(),
      managerId: 4
    },
    {
      name: "gigel",
      email: 'executor6@company.com',
      password: 'hashed_password_10',
      userType: 'Executor',
      lastLogin: new Date(),
      managerId: 4
    }

  ]);


  // Insert Tasks
  await Task.bulkCreate([
    {
      idCreator: 2,
      title: 'Implement new feature X',
    },
    {
      idCreator: 2,
      title: 'Fix bug in module Y'
    },
    {
      idCreator: 3,
      title: 'Update documentation'
    },
    {
      idCreator: 3,
      title: 'Performance optimization'
    },
    {
      idCreator: 4,
      title: 'Security audit'
    },
    {
      idCreator: 4,
      title: 'Code review for project Z'
    }
  ]);


  await Token.create({
    id: 1,
    refreshToken: "",
    accessToken: ""
  });
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
      force: false
      // force: true  // uncomment to drop and recreate tables
      // alter: true  // uncomment to alter existing tables
    });
    //    const user1 = await User.create({
    //      name: 'John Doe',
    //      email: 'john@example.com',
    //      password: 'password123',
    //      userType: UserType.USER,
    //      lastLogin: new Date()
    //    });
    //    await generateTokens(user1);
    //
    //    const user2 = await User.create({
    //      name: 'Jane Smith',
    //      email: 'jane@example.com',
    //      password: 'password456',
    //      userType: UserType.MANAGER,
    //      lastLogin: new Date()
    //    });
    //
    //    await generateTokens(user2);
    //
    //    const user3 = await User.create({
    //      name: 'Bob Wilson',
    //      email: 'bob@example.com',
    //      password: 'password789',
    //      userType: UserType.ADMIN,
    //      lastLogin: new Date()
    //    });
    //
    //    await generateTokens(user3);
    //    // Create tasks
    //    const task1 = await Task.create({
    //      title: 'Complete Project A',
    //      idCreator: user1.getDataValue('id')
    //    });
    //
    //    const task2 = await Task.create({
    //      title: 'Review Documentation',
    //      idCreator: user2.getDataValue('id')
    //    });
    //
    //    const task3 = await Task.create({
    //      title: 'Deploy Application',
    //      idCreator: user3.getDataValue('id')
    //    });
    //    const assignment1 = await Assignment.create({
    //      userId: user1.getDataValue('id'),
    //      taskId: task2.getDataValue('id')  // John is assigned to Jane's task
    //    });
    //
    //    const assignment2 = await Assignment.create({
    //      userId: user2.getDataValue('id'),
    //      taskId: task3.getDataValue('id')  // Jane is assigned to Bob's task
    //    });
    //
    //    const assignment3 = await Assignment.create({
    //      userId: user3.getDataValue('id'),
    //      taskId: task1.getDataValue('id')  // Bob is assigned to John's task
    //    });
    //
    //    await create_mock_data();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

export { sequelize, syncDatabase };
