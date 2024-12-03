import express from 'express'
import { Request, Response, NextFunction } from 'express';
import {authorize, UserType, AuthenticatedRequest} from '../middleware/credentials.middleware';
import { User } from '../models/user';
import { Token } from '../models/tokens';

const router = express.Router();

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


export default router