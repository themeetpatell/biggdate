import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = (req.headers as any)['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required'
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as any;
    
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };
    
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
    return;
  }
};

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
    return;
  }

  try {
    const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
    const decoded = jwt.verify(refreshToken, secret) as any;
    
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };
    
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
    return;
  }
};
