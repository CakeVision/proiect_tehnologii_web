import { Model, DataTypes, Sequelize } from 'sequelize';
<<<<<<< Updated upstream:backend/models/task.ts
import {User} from './user'
import {Assignment} from './assignments'
=======
>>>>>>> Stashed changes:backend/models/task.model.ts


interface TaskAttributes {
    id: number;
    idCreator: number;
    title: string;
}
interface TaskCreationAttributes extends Omit<TaskAttributes, 'createdAt' | 'updatedAt'> {
    id
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type

class Task extends Model<TaskAttributes, TaskCreationAttributes>  {
      static initModel(sequelize: Sequelize): typeof Task{
        Task.init(
           {
             id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "task_id",
            },
            title: {
                type: DataTypes.STRING(200),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Title is required'
                    }
                }
            },
            idCreator: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'id_creator',
                references: {
                    model: 'Users',
                    key: 'user_id'
                }
            }
           },
           {
            sequelize,
            tableName: "Tasks",
           }
        );
        return Task;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static associate(models: any) {
        Task.belongsTo(models.User, { foreignKey: 'id_creator' });
        Task.belongsToMany(models.User, { through: models.Assignment, foreignKey: 'taskId', otherKey: 'userId' });
    }
}

export {Task, TaskAttributes}