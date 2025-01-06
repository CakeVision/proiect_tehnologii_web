import { Op } from "sequelize";
import { User, UserAttributes } from "../models/user.model";
import { Request, Response } from 'express';

function splitByCommas(str: string): string[] {
    return str.split(',').map(item => item.trim());
}

function getLastUrlParam(req: Request): string {
    // Get the path from the request URL
    const path = req.path;

    // Split by '/' and filter out empty strings
    const params = path.split('/').filter(Boolean);

    // Return the last parameter or empty string if none exists
    return params[params.length - 1] || '';
}

function stringToArray(input: string, sep: string = ',') {
    return input.split(sep).map(elem => elem.trim()).filter(elem => elem !== '')
}

export class UserController {
    async getAll(req, res) {
        try {
            console.log("Attempting to fetch users...");
            const users = await User.findAll();
            console.log("Users fetched:", users);
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    async getById(req, res) {
        try {
            const ids: string = getLastUrlParam(req);
            if (ids == "users") {
                return res.status(400).json({
                    "status": "Missing Params",
                    "message": `Provide at least one userId for this req`,
                });
            }
            const idArr: string[] = stringToArray(ids)
            const numIds: number[] = idArr
                .map(str => Number(str))
                .filter(num => !isNaN(num));
            const users: User[] = await User.findAll({
                where: {
                    id: {
                        [Op.in]: numIds,
                    }
                },
            })
            if (!users?.length) {
                return res.status(404).json({
                    "status": "DB Error/Wrong ids",
                    "message": `The ids provided have no associated users`,
                })
            }
            return res.status(200).json({
                "status": "Success",
                "message": `Users succesfully found`,
                "result": users.map(user => user.toPublicJSON()),
            })
        }
        catch (error) {
            return res.status(500).json({
                "status": "Generic Error",
                "message": `DB went poof`,
            });
        }
    }
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            return res.status(200).json({
                "status": "Invalid Params",
                "message": `One or more params are invalid for the user model`,
            })
        }
    }
    async modifyUser(req, res) {
        const id: number = Number(req.params.id);
        if (!id || id < 0) {
            return res.status(400).json({
                "status": "Error",
                "message": "Invalid user ID"
            });
        }

        // Update data comes from request body
        const updates: string[] = req.body;

        const user: User | null = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                "status": "Error",
                "message": `User with id: ${id} not found`
            });
        }

        // Define allowed fields
        const allowedFields: (keyof UserAttributes)[] = ['name', 'email', 'userType'];

        // Only update allowed fields from request body
        Object.entries(updates).forEach(([key, value]) => {
            if (allowedFields.includes(key as keyof UserAttributes)) {
                user.setDataValue(key as keyof UserAttributes, value);
            }
        });

        await user.save();

        return res.status(200).json({
            "status": "Success",
            "message": "User updated successfully",
            "result": user.toPublicJSON()
        });
    }
    async deleteUser(req, res) {
        const id: number = Number(req.params.id);
        if (!id || id < 0) {
            return res.status(400).json({
                "status": "Error",
                "message": "Invalid user ID"
            });
        }
        const count = await User.destroy({
            where: {
                id: id,
            },
        })
        if (!count) {
            return res.status(404).json({
                "status": "Error",
                "message": `Id: ${id}, not in db`,
            })
        }
        return res.status(204).json();
    }

}
