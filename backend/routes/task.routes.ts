import express from 'express'
import { TaskController } from "../controllers/task.controller";
import { authorize, UserType } from '../middleware/credentials.middleware';

const router = express.Router();
const taskController = new TaskController();

router.get('/:id',authorize([UserType.ADMIN]), taskController.getOne.bind(taskController))
router.get('/owned/:id', authorize([UserType.MANAGER, UserType.ADMIN]), taskController.getOneOwned)
router.get('/all',authorize([UserType.ADMIN]), taskController.getAll.bind(taskController))
router.get('/allOwned',authorize(), taskController.getAllOwned.bind(taskController))

router.post('/create',authorize([UserType.MANAGER, UserType.ADMIN]), taskController.create.bind(taskController))
router.post('/assign',authorize([UserType.MANAGER, UserType.ADMIN]), taskController.assign.bind(taskController))

router.patch('/alter',authorize([UserType.MANAGER, UserType.ADMIN]), taskController.alter.bind(taskController))

router.delete('/deassign',authorize([UserType.MANAGER, UserType.ADMIN]), taskController.deassign.bind(taskController))
router.delete('/delete',authorize([UserType.MANAGER, UserType.ADMIN]), taskController.del.bind(taskController))

export default router

