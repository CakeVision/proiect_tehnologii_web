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
        const empty = Object.values(params).length < 2
        if(empty){
            res.status(400).json({
                "status":"Missing Params",
                "message":`Provide at least one of ${ Object.keys({ title, idCreator }).join(', ')}`,
            });
            return;
        }
       const task = await Task.create({idCreator, title});
       res.status(200).json({
                "message":`Creation Succesful`,
                "task":task
        });

    }
    async alter(req,res){
        const {
           taskId = undefined,
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

        const task = Task.findByPk(taskId)
        if(!task){
            res.status(400).json({
                "status":"Task not found",
                "message":`No task with provided id`,
            });
        }
        await Task.update(
            {title, idCreator},
            {where:{id:taskId}}
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
        await Task.destroy({where:{id:id}})
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
        const assignment = await Assignment.findOne({where:{userId, taskId}})
        if(!assignment) {
            res.status(400).json({"status":"error", "message":`Assignment with key (${userId},${taskId}) doesnt exist`})
        }
        assignment!.destroy()
        res.status(200).json({"status":"success", "message":"Assignment deleted succesfully"})
    }
    async getAll(req, res){
        const tasks = await Task.findAll()
        res.status(200).json(tasks)
    }
    async getOne(req,res){
        const tasks = await Task.findByPk(req.params.id)
        res.status(200).json(tasks)
    }
    
    async getOneOwned(req,res){
       const taskId  = req.params.id

        const authHeader  = req.headers.authorization;
        const refreshToken = authHeader?.split(' ')[1];
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number, userType:string };
        if(!taskId) {
            res.status(400).json({"status":"error", "message":"taskId is required to delete a task"})
            return;
        }
        const assignment = await Assignment.findOne({
            where:{
                taskId:taskId,
                userId:payload.userId
            },
            include:[
                {model:User},
                {
                    model:Task,
                    attributes: ['title','idCreator']
                },
            ]
        })
        if(!assignment){
            res.status(400).json({"status":"error", "message":"user does not own a task with that id"})
            return;
        }
        const task = await Task.findByPk(taskId)
        res.status(200).json({"status":"success", "message":"Task Found", "task":task})
    }
    async getAllOwned(req,res){
        const authHeader  = req.headers.authorization;
        const refreshToken = authHeader?.split(' ')[1];
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number, userType:string };
      

        const user = await User.findByPk( payload.userId);
        if(!user) res.status(400).json({"status":"error", "message":"invalid token or user"})

        const tasks = user!.getTasks();

        res.status(200).json(tasks)
    }
}