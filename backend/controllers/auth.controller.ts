// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.ts';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username} = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({username,email, hashPassword});

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user);

      // Update user with refresh token
      await user.update({ refreshToken });

      res.status(201).json({
        user: user.toPublicJSON(),
        accessToken,
        refreshToken
      });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user);

      // Update user's refresh token
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

  // Refresh token
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      // Verify refresh token
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };

      // Find user with this refresh token
      const user = await User.findOne({
        where: {
          id: payload.userId,
          refreshToken
        }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Update refresh token
      await user.update({ refreshToken: tokens.refreshToken });

      res.json(tokens);
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  // Logout
  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      // Find user and remove refresh token
      await User.update(
        { refreshToken: null },
        { where: { refreshToken } }
      );

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error during logout' });
    }
  }

  private generateTokens(user: User) {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}
