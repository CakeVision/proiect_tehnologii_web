import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';
import { Task } from './task.model';

interface AssignmentAttributes {
    taskId: number
    userId: number
}
//interface AssignmentCreationAttributes extends Omit<AssignmentAttributes, 'createdAt' | 'updatedAt'> {
//    id
//}
class Assignment extends Model<AssignmentAttributes> {

    static initModel(sequelize: Sequelize): typeof Assignment {
        Assignment.init({
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: 'user_id',

            },
            taskId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: 'task_id',

            }
        },
            {
                sequelize,
                tableName: "TaskAssignments",
                schema: 'public',

            }
        );
        return Assignment;
    }
    static associate(models) {
        //
        //        Assignment.belongsTo(models.User, {
        //            foreignKey: 'userId',
        //            targetKey: 'userId'
        //        });
        //        Assignment.belongsTo(models.Task, {
        //            foreignKey: 'taskId',
        //            targetKey: 'taskId'
        //        });
    }
}

export { Assignment, AssignmentAttributes }
