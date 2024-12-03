<<<<<<< Updated upstream
=======
import { User } from "../models/user.model";
import { Token } from "../models/token.model";

export class AdminController {
    async changeRole(req, res) {
        console.log(req.body)
        if(!('id' in req.body)){
            res.status(400).json({error:"Invalid req, no id to change user to provided"})
        }
        if(!('newType' in req.body) ){
            res.status(400).json({error:"Invalid req,no new userType provided"});
        }
        const {id, newType} =  req.body
        if(!User.isValidUserType(newType)){
            res.status(400).json({error:"Invalid req,not a correct userType"});
        }
        User.update({userType: newType},{where:{id:id}});
        Token.update({refreshToken:"",accessToken:""},{where:{id:id}})
        res.status(200).json({"message":"update succesful"})

    }
    async delete(req,res){
    const {id} = req.body
    try{
    Token.destroy({
        where:{
            id:id
        }
    })
    User.destroy({
        where:{
            id:id
        }
    })
    
    res.status(200).json({"details":"delete succesful"})
    }
    catch{
    res.status(400).json(
        {
            "message":"delete failed"
        }
    );
    }
    }


}
>>>>>>> Stashed changes
