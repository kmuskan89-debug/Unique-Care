import jwt from 'jsonwebtoken';
import User from '../models/User';

// 🛡️ Middleware to verify JWT and attach authenticated user to req.user
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'ucare_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);

      // Find user by decoded ID without returning password
      req.user = await User.findById((decoded as any).id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User belonging to token no longer exists' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// 🔒 Middleware to restrict access to specific roles (e.g. 'technician', 'admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.map(r => r.toLowerCase()).includes(req.user.role?.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'anonymous'}' is not authorized to perform this action`
      });
    }
    next();
  };
};
