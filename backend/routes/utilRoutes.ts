import express from 'express';
import {Token} from '../modelsClass/tokens';

const router = express.Router();

router.get('/', async (req, res ) => {
    res.json ({"result": "ok"});
})

router.get('/all/tokens',async (req,res) =>{
    console.log("Attempting to fetch tokens...");
    const tokens = await Token.findAll();
    console.log("Users fetched:", tokens);
    res.json(tokens);
} )


export default router