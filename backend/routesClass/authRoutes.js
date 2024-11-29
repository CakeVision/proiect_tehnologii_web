import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

async function register(req, res){
    try {
        const { email, password, firstName, lastName } = req.body;
  
        const existingUser = await User.findOne(email);
        if (existingUser) {
          return res.status(400).json({ error: 'Email already registered' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = await User.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });
  
        const { accessToken, refreshToken } = this.generateTokens(user);
  
        await user.update({ refreshToken });
  
        res.status(201).json({
          user: user.toPublicJSON(),
          accessToken,
          refreshToken
        });
    } 
    catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }}

const router = Router();
async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
  
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
  
        const { accessToken, refreshToken } = this.generateTokens(user);
  
        await user.update({ 
          refreshToken,
          lastLogin: new Date()
        });
  
        res.json({
          user: user.toPublicJSON(),
          accessToken,
          refreshToken
        });
      } catch (error) {
        res.status(500).json({ error: 'Error during login' });
      }
}
router.post("/register", register(req, res));


router.post("/login", login(req,res) )
router.post("/refresh")
router.post("/logout")