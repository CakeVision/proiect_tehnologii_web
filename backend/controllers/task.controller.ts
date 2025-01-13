import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { Assignment } from "../models/assignment.model";
import jwt from 'jsonwebtoken'

const buildParamDict = (fields: Record<string, any>) =>
    Object.entries(fields)
        .reduce((clause, [key, value]) =>
            value !== undefined ? { ...clause, [key]: value } : clause,
            {});

export class TaskController {
    async create(req, res) {
        const {
            title ,
            idCreator,
            description,
            status,
        } = req.params;

        const params = buildParamDict(req.params)
        const empty = Object.values(params).length < 2
        if (empty) {
          return res.status(400).json({
                "status": "Missing Non-optional Params",
                "message": `Provide at least one of ${Object.keys({ title, idCreator }).join(', ')}`,
            });
        }
        const task = await Task.create({ idCreator, title });
        task.update({description, status})
        return res.status(200).json({
            "message": `Creation Succesful`,
            "task": task
        });

    }
    async alter(req, res) {
        const {
            idTask,
            title ,
            idCreator,
            description,
            status,
        } = req.params;

        const params = buildParamDict(req.params)
        const validParamCount = Object.values(params).filter(param => param != null).length;
        if (validParamCount == 0) {
            return res.status(400).json({
                "status": "Missing Params",
                "message": `Provide at least one of ${Object.keys({ title, idCreator }).join(', ')}`,
            });
        }
        if(validParamCount == 1){
            return res.status(400).json({
                "status": "Missing Params",
                "message": `Provide at least one of ${Object.keys({ title, idCreator }).join(', ')}`,
            });
        }

        const task = await Task.findByPk(idTask)
        if (!task) {
            res.status(400).json({
                "status": "Task not found",
                "message": `No task with provided id`,
            });
        }
        task?.update({ title, idCreator, description, status })
        res.status(200).json({
            "message": `Alter Succesful`,
        });
    }
    async del(req, res) {
        const {
            id = undefined
        } = req.params

        if (!id) res.status(400).json({ "status": "error", "message": "id is required to delete a task" })
        await Task.destroy({ where: { id: id } })
        res.status(200).json({ "status": "completed", "message": "task succesfully deleted" })
    }
    async assign(req, res) {
        const {
            taskId ,
            userId ,
        } = req.params
        const validParamCount = Object.values(req.params).filter(param => param != null).length;
        if (validParamCount <2) {
            return res.status(400).json({
                "status": "Missing Params",
                "message": `Provide at least one of ${Object.keys({ title, idCreator }).join(', ')}`,
            });
        }

        //TODO: Refactor into error function
        if (!taskId && taskId !=1) {
            return res.status(400).json({ "status": "error", "message": "taskId is required to delete a task" })
        }
        if (!userId && userId != 1) {
            return res.status(400).json({ "status": "error", "message": "userId is required to delete a task" })
        }
        const user = await User.findByPk(userId)
        const task = await Task.findByPk(taskId)
        if (!user) {
            return res.status(400).json({ "status": "error", "message": `user with id: ${userId} not found` })
        }
        if (!task) {
            return res.status(400).json({ "status": "error", "message": `task with id: ${taskId} not found` })
        }
        await user.addTask(task);
        return res.status(200).json({ "status": "success", "message": "Assignment created succesfully" })

    }
    async deassign(req, res) {
        const {
            taskId ,
            userId ,
        } = req.params
        const validParamCount = Object.values(req.params).filter(param => param != null).length;
        if (validParamCount <2) {
            return res.status(400).json({
                "status": "Missing Params",
                "message": `Provide at least one of ${Object.keys({ title, idCreator }).join(', ')}`,
            });
        }


        if (!taskId && taskId != 1) {
            return res.status(400).json({ "status": "error", "message": "taskId is required to delete a task" })
        }
        if (!userId && userId !=1) {
            return res.status(400).json({ "status": "error", "message": "userId is required to delete a task" })
        }
        const assignment = await Assignment.findOne({ where: { userId, taskId } })
        if (!assignment) {
            return res.status(400).json({ "status": "error", "message": `Assignment with key (${userId},${taskId}) doesnt exist` })
        }
        const user = await User.findByPk(userId);
        const task = await Task.findByPk(taskId);
        if (!user || !task) {
            throw new Error('User or Task not found');
        }
        user.removeTask(task);
        return res.status(200).json({ "status": "success", "message": "Assignment deleted succesfully" })
    }
    async getAll(req, res) {
        const tasks = await Task.findAll()
        res.status(200).json(tasks)
    }
    async getOne(req, res) {
        const tasks = await Task.findByPk(req.params.id)
        res.status(200).json(tasks)
    }

    async getOneOwned(req, res) {
        const taskId = req.params.id

        const authHeader = req.headers.authorization;
        const refreshToken = authHeader?.split(' ')[1];
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number, userType: string };
        if (!taskId) {
            res.status(400).json({ "status": "error", "message": "taskId is required to delete a task" })
            return;
        }
        const assignment = await Assignment.findOne({
            where: {
                taskId: taskId,
                userId: payload.userId
            },
            include: [
                { model: User },
                {
                    model: Task,
                    attributes: ['title', 'idCreator']
                },
            ]
        })
        if (!assignment) {
            res.status(400).json({ "status": "error", "message": "user does not own a task with that id" })
            return;
        }
        const task = await Task.findByPk(taskId)
        res.status(200).json({ "status": "success", "message": "Task Found", "task": task })
    }
    async getAllOwned(req, res) {
        const authHeader = req.headers.authorization;
        const refreshToken = authHeader?.split(' ')[1];
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number, userType: string };
        console.log(payload.userId, payload.userType);

        const user = await User.findByPk(payload.userId);
        if (!user) return res.status(400).json({ "status": "error", "message": "invalid token or user" })

        const tasks = await user.getUserTasks();

        res.status(200).json(tasks)
    }
}
