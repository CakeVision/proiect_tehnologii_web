import { Model, Sequelize, DataTypes } from 'sequelize';

enum ColorChoices {
    RED = "red",
    BLUE = "blue",
    GREEN = "green",
    Yellow = "yellow",
}

interface TagAttributes {
    id: number;
    name: string;
    color: ColorChoices;
}
interface TagCreationAttributes extends Omit<TagAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}

class Tags extends Model<TagAttributes, TagCreationAttributes> {
    declare id: number;
    declare name: string;
    declare color: ColorChoices;


    static initModel(sequelize: Sequelize): typeof Tags {
        Tags.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'tag_id'
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                field: 'name'
            },
            color: {
                type: DataTypes.ENUM(...Object.values(ColorChoices)),
                allowNull: false,
                defaultValue: ColorChoices.RED
            },
        },
            {
                sequelize,
                tableName: 'Tags',
                schema: 'public',
                timestamps: false,
                hooks: {
                }
            }

        )
        return Tags;
    }
    static associate(models: any) {
        Tags.belongsToMany(models.Task, { through: models.TagLink, foreignKey: 'tagId', otherKey: 'taskId' });
    }

}

export { Tags, TagAttributes, TagCreationAttributes };
