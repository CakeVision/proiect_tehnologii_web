import { Model, DataTypes, Sequelize } from 'sequelize';

interface TokenAttributes {
    id: number;
    refreshToken: string;
    accessToken: string;
}
interface TokenCreationAttributes extends Omit<TokenAttributes, 'createdAt' | 'updatedAt'> {
    id: number;
}


class Token extends Model<TokenAttributes, TokenCreationAttributes> {
    static initModel(sequelize: Sequelize): typeof Token {
        Token.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: false,
                field: 'token_id',
            },
            refreshToken: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            accessToken: {
                type: DataTypes.STRING(300),
                allowNull: true,
            }

        }, {
            sequelize,
            tableName: 'Tokens',
            schema: 'public',
            timestamps: false,
        }
        )
        return Token;
    }
    static associate(models) {
        Token.belongsTo(models.User, {
            foreignKey: 'userId',
            targetKey: 'id'
        });
    }
}

export { Token, TokenAttributes as TokensAttributes }