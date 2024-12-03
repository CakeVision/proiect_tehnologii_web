import express from 'express';
import {Token} from '../models/token.model';
import { Assignment } from '../models/assignment.model';

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
router.get('/all/assignments',async (req,res) =>{
    console.log("Attempting to fetch tokens...");
    const assignment = await Assignment.findAll();
    console.log("Assignments fetched:", assignment);
    res.json(assignment);
} )


export default router