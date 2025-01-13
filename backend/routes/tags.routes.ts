import express from 'express'
import { TaskController } from "../controllers/task.controller";
import { authorize, UserType } from '../middleware/credentials.middleware';

const router = express.Router();
const taskController = new TaskController();

router.get('/:id', authorize(), taskController.getOne.bind(taskController))
router.get('/', authorize(), taskController.getAll.bind())
router.post('/create/:idTag', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.create.bind(taskController))

router.post('/assign/:idTag/:idTask', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.assign.bind(taskController))
router.patch('/deassign/:idTask/:idUser', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.deassign.bind(taskController))

router.patch('/alter/:idTag', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.alter.bind(taskController))

router.delete('/delete/:idTask', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.del.bind(taskController))

export default router

