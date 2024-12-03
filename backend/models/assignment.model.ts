import { Model, DataTypes, Sequelize } from 'sequelize';

interface AssignmentAttributes {
    id:number
    taskId: number
    userId: number
}
interface AssignmentCreationAttributes extends Omit<AssignmentAttributes, 'createdAt' | 'updatedAt'> {
    id
}
class Assignment extends Model<AssignmentAttributes,AssignmentCreationAttributes>  {

    static initModel(sequelize: Sequelize): typeof Assignment{
        Assignment.init({
            id:{
                type: DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                field: 'id'
            },
            taskId: {
                type: DataTypes.INTEGER,
                unique:false,
                field: "task_id"
              },
              userId: {
                type: DataTypes.INTEGER,
                unique:false,
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
    static associate(models){
        Assignment.belongsTo(models.User);
        Assignment.belongsTo(models.Task);
    }
}

export {Assignment}
