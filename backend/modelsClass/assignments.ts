import { Model, DataTypes, Sequelize } from 'sequelize';


interface AssignmentAttributes {
    taskId: Number
    userId: Number
}

class Assignment extends Model implements AssignmentAttributes {
    public taskId: Number
    public userId: Number

    static initModel(sequelize: Sequelize): typeof Assignment{
        Assignment.init({
            task_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
              },
              user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
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
