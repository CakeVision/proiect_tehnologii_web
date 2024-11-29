/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Task } from '../models';
import { Model, DataTypes, Sequelize } from 'sequelize';
import {Task} from './task'


enum UserType {
    USER = 'user',
    MANAGER = 'manager',
    ADMIN = 'admin',
}

interface UserAttributes {
    id : number;
    name: string;
    userType: string;
    email: string;
    password: string;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
    password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserPublicAttributes extends Omit<UserAttributes, 'password' | 'refreshToken'> {}

class User extends Model implements UserAttributes {
    public id!: number;
    public name!: string;
    public userType!: string;
    public email!: string;
    public password!: string;

    // /**
    //  * get full_name
    //  */
    // public get full_name():string {
    //     return this.full_name
    // }
    public toPublicJSON(): UserPublicAttributes {
        //put all class fields you DONT want public first, then ...result
        const {password, ...public_user} = this.toJSON();
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
                allowNull: false
              },
              email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate:{
                    isEmail:{
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
                validate: {
                    isIn: [Object.values(UserType)]
                }
              },
              
            },{
            sequelize,
            tableName: 'Users',
            hooks: {
              beforeSave: async (user: User) => {
                // Add any pre-save hooks here
                // For example, hashing password if modified
                // if (user.changed('password')) {
                //   user.password = await bcrypt.hash(user.password, 10);
                // }
              },
            },
        }
        )
        return User;
    }
    //FIXME: May need to change type Model to any, but unsure
    //TODO: Add association with Task
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     static associate(models: any) {
        User.belongsTo(User, {
            as: 'manager',
            foreignKey: 'manager_id'
        }); 
        User.hasMany(User, {
            as: 'subordinates',
            foreignKey: 'manager_id'
        });

        User.hasMany(Task, {
            foreignKey: 'userId',
            as: 'tasks'
        });
  }
}

export { User, UserAttributes, UserCreationAttributes, UserPublicAttributes };