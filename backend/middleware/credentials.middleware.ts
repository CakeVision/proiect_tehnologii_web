import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {User, UserType} from '../models/user'
import { Token } from '../models/tokens';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    userType: UserType;
  };
}

interface JwtPayload {
  userId: number;
  userType: string;
}

type AllowedRoles = UserType[] | 'ALL';

/**
 * Checks if a user's type has permission based on allowed roles
 */
const hasPermission = (userType: UserType, allowedRoles: AllowedRoles): boolean => {
  if (allowedRoles === 'ALL') return true;
  return allowedRoles.includes(userType);
};

/**
 * Validates if the provided string is a valid UserType
 */


/**
 * Authorization middleware that validates JWT tokens and user permissions
 */
const authorize = (allowedRoles: AllowedRoles = 'ALL') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction):void => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader?.includes('Bearer')) {
         res.status(401).json({
          status: 'error',
          message: 'Authorization header must start with Bearer'
        });
        return;
      }

      let token = authHeader.split(' ')[1];
      if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
      }

      // Verify and decode token
      const payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
      ) as JwtPayload;

      const dbToken=  await Token.findOne({where:{refreshToken:token}})
      if(!dbToken){
        res.status(401).json({
          status: 'error',
          message: 'Token not in db'
        });
        return;
      }
      // Validate payload structure
      if (!payload.userId || !payload.userType) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid token payload structure'
        });
        return; 
      }

      // Validate user type
      if (!User.isValidUserType(payload.userType)) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid user type in token'
        });
        return; 
      }

      // Check permissions
      if (!hasPermission(payload.userType as UserType, allowedRoles)) {
         res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions for this resource'
        });
        return;
      }

      // Attach user info to request
      req.body.user = {
        userId: payload.userId,
        userType: payload.userType as UserType
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid or expired token'
        });
        return; 
      }

      if (error instanceof Error) {
         res.status(500).json({
          status: 'error',
          message: error.message

        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
        return;
    }
  };
};

export {
  authorize,
  UserType,
  AuthenticatedRequest,
  JwtPayload,
  AllowedRoles
};