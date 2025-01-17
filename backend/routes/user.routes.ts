import express from 'express';
import { User } from '../models/user.model';
import { UserController } from '../controllers/user.controller';
import { authorize, UserType } from '../middleware/credentials.middleware';

const router = express.Router();
const userController = new UserController();

// Get all users
router.get('/', authorize([UserType.ADMIN]), userController.getAll.bind(userController));
// Get user by ID
router.get('/:ids', authorize(), userController.getById.bind(userController));

//getUsers where id = managedId
router.get('/managed/:id', authorize(), userController.getManagedUsers.bind(userController));
// Create a new user
router.post('/', authorize([UserType.MANAGER, UserType.ADMIN]), userController.createUser.bind(userController));

router.patch('/managerChange/:id', authorize([UserType.MANAGER, UserType.ADMIN]), userController.changeManager.bind(userController));

router.patch('/modify/:id', authorize(), userController.modifyUser.bind(userController));
//modify user
router.delete('/:id', authorize(), userController.deleteUser.bind(userController));
export default router;
