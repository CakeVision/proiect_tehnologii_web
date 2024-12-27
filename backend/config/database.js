import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  'taskappdb',      // Database name
  'robert4',            // Username
  '09082002',        // Password (set to `undefined` if not required)
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log, // Enable logging
  }
);

export default sequelize;
