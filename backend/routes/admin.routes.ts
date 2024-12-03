import express from 'express'
<<<<<<< Updated upstream
import { Request, Response, NextFunction } from 'express';
import {authorize, UserType, AuthenticatedRequest} from '../middleware/credentials.middleware';
import { User } from '../models/user';
import { Token } from '../models/tokens';
=======
import { AdminController } from '../controllers/admin.controller';

>>>>>>> Stashed changes

const router = express.Router();

<<<<<<< Updated upstream
router.get('/test',  (req, res) => {
  res.json({ message: 'Admin access granted' });})

router.post('/change_role', (req, res) => {
    console.log(req.body)
    if(!('id' in req.body)){
        res.status(400).json({error:"Invalid req, no id to change user to provided"})
    }
    if(!('newType' in req.body) ){
        res.status(400).json({error:"Invalid req,no new userType provided"});
    }
    const {id, newType} =  req.body
    if(!User.isValidUserType(newType)){
        res.status(400).json({error:"Invalid req,not a correct type"});
    }
    User.update({userType: newType},{where:{id:id}});
    Token.update({refreshToken:"",accessToken:""},{where:{id:id}})
    res.status(200).json({"details":"update succesful"})

  });
router.post('/delete',(req,res)=>{
    const {id} = req.body
    try{
    User.destroy({
        where:{
            id:id
        }
    })
    Token.destroy({
        where:{
            id:id
        }
    })
    res.status(200).json({"details":"delete succesful"})
    }
    catch(Exception){
    res.status(400).json(
        {
            "message":"delete failed"
        }
    );
    }
})
=======
router.get('/test',  (req, res) => { res.json({ message: 'Admin access granted' }); });
router.put('/change_role',adminController.changeRole.bind(adminController));
router.delete('/delete',adminController.delete.bind(adminController));
>>>>>>> Stashed changes


export default router