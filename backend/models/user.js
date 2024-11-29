import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'user_id'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Users',
  timestamps: false
});

export default User
