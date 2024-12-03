import { Model, DataTypes, Sequelize } from 'sequelize';


interface AssignmentAttributes {
    taskId: number
    userId: number
}

class Assignment extends Model implements AssignmentAttributes {
    public taskId!: number
    public userId!: number

    static initModel(sequelize: Sequelize): typeof Assignment{
        Assignment.init({
            task_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: "task_id"
              },
              user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: "user_id"
              }
            },
            {
                sequelize,
                tableName: "TaskAssignments",
            }
        );
        return Assignment;
    }
}

export {Assignment}
