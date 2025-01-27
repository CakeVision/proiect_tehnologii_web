// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserType } from '../models/user.model.ts';
import { Token } from '../models/token.model.ts'
import { resolveAny } from 'dns';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      console.log(req.body)

      const { email, password, name, userType, managerId } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(userType)
      if (!User.isValidUserType(userType as string)) {
        return res.status(400).json({ error: 'Invalid user type' })
      }
      const user = await User.create(
        {
          name: name,
          email: email,
          password: hashedPassword,
          userType: userType as UserType,
          lastLogin: new Date(),
          managerId: managerId
        });
      console.log("New User: ")
      console.log(user)

      // Generate tokens
      console.log("Tokens:")
      const { accessToken, refreshToken } = this.generateTokens(user);
      console.log("AfterTokens")
      await Token.create(
        {
          id: user.getDataValue('id'),
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      )
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
      console.log(email)
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        console.log("no user found")
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.getDataValue('password'));
      if (!isValidPassword) {
        console.log("invalid password")
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { accessToken, refreshToken } = this.generateTokens(user);

      await user.update({
        lastLogin: new Date()
      });

      await Token.update(
        {
          refreshToken: refreshToken,
          accessToken: accessToken
        },
        { where: { id: user.getDataValue('id') } }
      )
      return res.status(200).json({
        "status": "Success",
        "message": `User succesfully logged in`,
        "user": user,
        "refreshToken": refreshToken,
      })
    } catch (error) {
      res.status(500).json({ error: 'Error during login' });
    }
  }

  // Refresh token
  async refresh(req: Request, res: Response) {
    try {
      console.log("Refresh ....................")
      const authHeader = req.headers.authorization;
      const refreshToken = authHeader?.split(' ')[1];

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      // Verify refresh token
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number, userType: string };
      console.log(payload)

      // Find user with this refresh token
      const validToken = await Token.findOne({
        where: {
          id: payload.userId,
          refreshToken: refreshToken
        }
      });

      const user = async (userId: string | number): Promise<User> => {
        const result = User.findOne({ where: { id: userId } })!;
        if (!result) {
          throw new Error('User not found');
        }
        return result;
      }
      if (!validToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new tokens
      const tokens = this.generateTokens(await user(payload.userId));

      // Update refresh token
      await validToken.update({ refreshToken: tokens.refreshToken });

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
      await Token.update(
        { refreshToken: null },
        { where: { refreshToken } }
      );

      res.status(200).json({ message: 'Logged out successfully' });
    } catch {
      res.status(500).json({ error: 'Error during logout' });
    }
  }

  public generateTokens(user: User) {
    const accessToken = jwt.sign(
      {
        userId: user.getDataValue('id'),
        email: user.getDataValue('email'),
        userType: user.getDataValue('userType'),
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.getDataValue('id'),
        userType: user.getDataValue('userType')
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}
