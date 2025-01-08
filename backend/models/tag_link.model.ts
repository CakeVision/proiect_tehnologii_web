import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';
import { Task } from './task.model';

interface TagLinkAttributes {
    taskId: number
    tagId: number
}
//interface AssignmentCreationAttributes extends Omit<AssignmentAttributes, 'createdAt' | 'updatedAt'> {
//    id
//}
class TagLink extends Model<TagLinkAttributes> {

    static initModel(sequelize: Sequelize): typeof TagLink {
        TagLink.init({
            taskId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: 'user_id',

            },
            tagId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: 'task_id',

            }
        },
            {
                sequelize,
                tableName: "TagLink",
                schema: 'public',

            }
        );
        return TagLink;
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

export { TagLink, TagLinkAttributes }
