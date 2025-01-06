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
// Create a new user
router.post('/', authorize([UserType.MANAGER, UserType.ADMIN]), userController.createUser.bind(userController));
//modify user
router.patch('/:id', authorize(), userController.modifyUser.bind(userController));
router.delete('/:id', authorize(), userController.deleteUser.bind(userController));
export default router;
