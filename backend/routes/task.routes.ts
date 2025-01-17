import express from 'express'
import { TaskController } from "../controllers/task.controller";
import { authorize, UserType } from '../middleware/credentials.middleware';

const router = express.Router();
const taskController = new TaskController();

router.get('/id/:id', authorize([UserType.ADMIN]), taskController.getOne.bind(taskController))
router.get('/owned/:id', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.getOneOwned)
router.get('/all', authorize([UserType.ADMIN]), taskController.getAll.bind(taskController))
router.get('/allOwned/:idUser', authorize(), taskController.getAllOwned.bind(taskController))

router.get('/managerTasks/:id', authorize([UserType.MANAGER]), taskController.getManagerTasks.bind(taskController))
router.post('/create/:idCreator/:title', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.create.bind(taskController))
router.post('/assign/:idTask/:idUser', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.assign.bind(taskController))

router.patch('/alter/:idTask', authorize([UserType.USER, UserType.MANAGER, UserType.ADMIN]), taskController.alter.bind(taskController))
router.patch('/deassign/:idTask/:idUser', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.deassign.bind(taskController))

router.delete('/delete/:idTask', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.del.bind(taskController))

export default router

