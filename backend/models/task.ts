// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Task } from '../models';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.ts'


interface TaskAttributes {
    id: number;
    idCreator: User;
    title: string;
}

interface TaskCreationAttributes extends Omit<TaskAttributes, 'id'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public idCreator: User;
    public title: string;

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
                    key: 'id'
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
    static associate(models: any) {
        Task.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'creator_id'
        });
    }
}

export {Task, TaskAttributes}

// task_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     field: 'task_id'
//   },
//   id_creator: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   title: {
//     type: DataTypes.STRING(250),
//     allowNull: false
//   }
// }, {
//   tableName: 'Tasks',
//   timestamps: false
// }