import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('task', {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'task_id'
    },
    id_creator: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false
    }
  }, {
    tableName: 'Tasks',
    timestamps: false
  });

export default Task