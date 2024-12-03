import express from 'express'
import { AdminController } from '../controllers/admin.controller';


const router = express.Router();
const adminController = new AdminController();

router.get('/test',  (req, res) => { res.json({ message: 'Admin access granted' }); });
router.put('/change_role',adminController.changeRole.bind(adminController));
router.delete('/delete',adminController.delete.bind(adminController));


export default router