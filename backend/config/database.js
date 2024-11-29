import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  'TaskAppDb',      // Database name
  'tav',            // Username
  undefined,        // Password (set to `undefined` if not required)
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log, // Enable logging
  }
);

export default sequelize;
