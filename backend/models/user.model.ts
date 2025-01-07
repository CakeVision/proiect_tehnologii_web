/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Task } from '../models';
import { Model, DataTypes, Sequelize, BelongsToManyGetAssociationsMixin } from 'sequelize';
import { Task } from './task.model'
import { Token } from './token.model';
import { Assignment } from './assignment.model';


enum UserType {
  USER = 'Executor',
  MANAGER = 'Manager',
  ADMIN = 'Administrator',
}

interface UserAttributes {
  id: number;
  name: string;
  userType: string;
  email: string;
  password: string;
  lastLogin: Date;
  managerId?: number
}
interface UserInstance extends Model<UserAttributes, UserCreationAttributes> {
  addTask: (task: Task) => Promise<void>;
  getTasks: () => Promise<Task[]>;
  setTasks: (tasks: Task[]) => Promise<void>;
  removeTask: (task: Task) => Promise<void>;
}


interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserPublicAttributes extends Omit<UserAttributes, 'password' | 'refreshToken'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserInstance {

  declare id: number;
  declare name: string;
  declare userType: string;
  declare email: string;
  declare password: string;
  declare lastLogin: Date;
  declare managerId?: number;

  declare getTasks: BelongsToManyGetAssociationsMixin<Task>;  // Add this declaration
  declare addTask: (task: Task) => Promise<void>;
  declare setTasks: (tasks: Task[]) => Promise<void>;
  declare removeTask: (task: Task) => Promise<void>;

  public async getUserTasks(taskWhereOptions = {}) {
    return this.getTasks({
      where: taskWhereOptions
    });
  }
  public static isValidUserType(type: string): type is UserType {
    return Object.values(UserType).includes(type as UserType);
  };
  public toPublicJSON(): UserPublicAttributes {
    //put all class fields you DONT want public first, then ...result
    const { password, ...public_user } = this.toJSON();
    return public_user
  }
  static initModel(sequelize: Sequelize): typeof User {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id'
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'name'
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: {
            msg: "must be a valid email"
          },
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      userType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "user_type",

      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }

    }, {
      sequelize,
      tableName: 'Users',
      schema: 'public',
      timestamps: false,
      hooks: {
      }
    }
    )
    return User;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any) {
    User.belongsToMany(models.Task,
      { through: models.Assignment, foreignKey: 'userId', otherKey: 'taskId' });
  }
}

export { User, UserAttributes, UserCreationAttributes, UserPublicAttributes, UserType };
