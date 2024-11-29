// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Task } from '../models';
import { Model, DataTypes, Sequelize } from 'sequelize';


interface TaskAttributes {
    id: number;
    idCreator: number;
    title: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

class Task extends Model implements TaskAttributes {
    public id!: number;
    public idCreator!: number;
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