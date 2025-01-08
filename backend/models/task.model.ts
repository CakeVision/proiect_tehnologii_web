import { Model, DataTypes, Sequelize, EnumDataType } from 'sequelize';

enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    ARCHIVED = 'ARCHIVED'
}

interface TaskAttributes {
    id: number;
    idCreator: number;
    title: string;
    description: string;
    status: TaskStatus;
}
interface TaskCreationAttributes extends Omit<TaskAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {
}

class Task extends Model<TaskAttributes, TaskCreationAttributes> {
    static initModel(sequelize: Sequelize): typeof Task {
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
                    defaultValue: "title",
                    validate: {
                        notEmpty: {
                            msg: 'Title is required'
                        }
                    }
                },
                description: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    defaultValue: null,
                },
                status: {
                    type: DataTypes.ENUM(...Object.values(TaskStatus)),
                    allowNull: false,
                    defaultValue: TaskStatus.TODO,
                    validate: {
                        isIn: {
                            args: [Object.values(TaskStatus)],
                            msg: 'Invalid status value'
                        }
                    }
                },
                idCreator: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                    field: 'id_creator',
                    //  references: {
                    //      model: 'Users',
                    //      key: 'user_id'
                    //  }
                }
            },
            {
                sequelize,
                tableName: "Tasks",
                schema: 'public',
            }
        );
        return Task;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static associate(models: any) {
        Task.belongsToMany(models.User, { through: models.Assignment, foreignKey: 'taskId', otherKey: 'userId' });
        Task.belongsToMany(models.Tags, { through: models.TagLink, foreignKey: 'taskId', otherKey: 'tagId' });
    }
}

export { Task, TaskAttributes }
