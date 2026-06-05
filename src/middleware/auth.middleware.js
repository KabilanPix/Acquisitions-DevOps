import { jwttoken } from '#utils/jwt.js';
import logger from '#config/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (e) {
    logger.warn('Invalid or expired token provided',e);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
