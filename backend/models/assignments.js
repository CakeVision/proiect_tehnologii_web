import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TaskAssignment = sequelize.define('taskassignment', {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'TaskAssignments',
    timestamps: false
  });

export default TaskAssignment