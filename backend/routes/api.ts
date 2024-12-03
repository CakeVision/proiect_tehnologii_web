/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Task } from '../models';
import { Model, DataTypes, Sequelize } from 'sequelize';

const router: Router = express.Router();

interface user_attributes {
    id : number;
    name: string;
    password: string;

}

interface task_attribute{
    id: number;
    description: string;
}
  
interface UserCreationAttributes extends Omit<user_attributes, 'id' | 'createdAt' | 'updatedAt'> {
    password: string;
}

interface UserPublicAttributes extends Omit<user_attributes, 'password' | 'refreshToken'> {}

class User extends Model<user_attributes, UserCreationAttributes> implements user_attributes {
    public id!: number;
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
        User.init(
        {
            id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            },
            email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
            },
            password: {
            type: DataTypes.STRING,
            allowNull: false,
            },
            firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            },
            lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            }
        },{

        }
        )
        return User;
    }
}
