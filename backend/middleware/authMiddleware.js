import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token format

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// Middleware to check if user has Admin role
export const requireAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required.',
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Authorization error', error: error.message });
  }
};

// Middleware to check if user has Viewer role
export const requireViewer = (req, res, next) => {
  try {
    if (req.user.role !== 'Viewer' && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: 'Access denied. Viewer role required.',
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Authorization error', error: error.message });
  }
};

// Generate JWT token
export const generateToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
