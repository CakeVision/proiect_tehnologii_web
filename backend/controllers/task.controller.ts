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
    
    async create(req,res){
        const { 
           title = undefined,
           idCreator = undefined,
        } = req.body;
       
        const params = buildParamDict({title, idCreator})
        const empty = Object.keys(params).length === 0
        if(empty){
            res.status(400).json({
                "status":"Missing Params",
                "message":`Provide at least one of ${ Object.keys({ title, idCreator }).join(', ')}`,
            });
            return;
        }
       await Task.create(title,idCreator);
       res.status(200).json({
                "message":`Creation Succesful`,
        });

    }
    async alter(req,res){
        const { 
           title = undefined,
           idCreator = undefined,
        } = req.body;

        const params = buildParamDict({title, idCreator})
        const empty = Object.keys(params).length === 0
        if(empty){
            res.status(400).json({
                "status":"Missing Params",
                "message":`Provide at least one of ${ Object.keys({ title, idCreator }).join(', ')}`,
            });
            return;
        }

        const task = Task.findOne({
            where: params
        });
        if(!task){
            res.status(402).json({
                "status":"Task not found",
                "message":`Params provided gave no results`,
            });
        }
        await Task.update(
            {title, idCreator},
            {where:params}
        )
        res.status(200).json({
                "message":`Alter Succesful`,
        });
    }
    async del(req,res){
        const {
            id = undefined
        } = req.body
        if(!id) res.status(400).json({"status":"error", "message":"id is required to delete a task"})
        await Task.destroy({where: id})
        res.status(200).json({"status":"completed", "message":"task succesfully deleted"})
    }
    async assign(req,res){
        const {
            taskId = undefined,
            userId = undefined,
        } = req.body
        //TODO: Refactor into error function
        if(!taskId) {
            res.status(400).json({"status":"error", "message":"taskId is required to delete a task"})
            return;
        }
        if(!userId){ 
            res.status(400).json({"status":"error", "message":"userId is required to delete a task"})
            return;
        }
        const user = await User.findByPk(userId)
        const task = await Task.findByPk(taskId)
        if(!user){ 
            res.status(400).json({"status":"error", "message":`user with id:${userId} not found`})
            return;
        }
        if(!task) {
            res.status(400).json({"status":"error", "message":`task with id:${taskId} not found`})
            return;
        }
        await Assignment.create({userId, taskId});
        res.status(200).json({"status":"success", "message":"Assignment created succesfully"})
        
    }
    async deassign(req,res){
         const {
            taskId = undefined,
            userId = undefined,
        } = req.body 
        if(!taskId) {
            res.status(400).json({"status":"error", "message":"taskId is required to delete a task"})
            return;
        }
        if(!userId){ 
            res.status(400).json({"status":"error", "message":"userId is required to delete a task"})
            return;
        }
        const assignment = await Assignment.findByPk(userId, taskId)
        if(!assignment) {
            res.status(400).json({"status":"error", "message":`Assignment with key (${userId},${taskId}) doesnt exist`})
        }
        assignment.destroy()
        res.status(200).json({"status":"success", "message":"Assignment deleted succesfully"})
    }
    async getAll(req, res){
        const tasks = await Task.findAll()
        res.status(200).json(tasks)
    }
    async getOne(req,res){
        const tasks = await Task.findByPk(req.body.id)
        res.status(200).json(tasks)
    }
    
    async getOneOwned(req,res){
        const {
            taskId = undefined
        } = req.body
        const authHeader  = req.headers.authorization;
        const refreshToken = authHeader?.split(' ')[1];
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number, userType:string };
        if(!taskId) {
            res.status(400).json({"status":"error", "message":"taskId is required to delete a task"})
            return;
        }
        const assignment = Assignment.findByPk(payload.userId, taskId)
        if(!assignment){
            res.status(400).json({"status":"error", "message":"user does not own a task with that id"})
            return;
        }
        const task = Task.findByPk(taskId);
        res.status(200).json({"status":"success", "message":"Task Found", "task":task})
    }
    async getAllOwned(req,res){
        const authHeader  = req.headers.authorization;
        const refreshToken = authHeader?.split(' ')[1];
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number, userType:string };
      

        const user = await User.findByPk( payload.userId);
        if(!user) res.status(400).json({"status":"error", "message":"invalid token or user"})

        const tasks = user!.getTasks()

        res.status(200).json(tasks)
    }
}