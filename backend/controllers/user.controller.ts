import { Op } from "sequelize";
import { User } from "../models/user.model";
import { Request, Response } from 'express';

function splitByCommas(str: string): string[] {
    return str.split(',').map(item => item.trim());
}

function getLastUrlParam(req: Request, res: Response): string {
    // Get the path from the request URL
    const path = req.path;

    // Split by '/' and filter out empty strings
    const params = path.split('/').filter(Boolean);

    // Return the last parameter or empty string if none exists
    return params[params.length - 1] || '';
}

export class UserController {

    async getById(req, res) {
        const ids: string = getLastUrlParam(req, res);
        if (ids == "users") {
            return res.status(400).json({
                "status": "Missing Params",
                "message": `Provide at least one userId for this req`,
            });
        }
        const users = User.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                }
            },
        })

    }
}
