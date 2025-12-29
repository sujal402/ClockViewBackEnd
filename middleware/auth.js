import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    // Read token from cookie first
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Token is not valid' });
      req.user = decoded.user;
      next();
    });
  } catch (err) {
    console.error('Auth middleware error', err);
    res.status(500).json({ message: 'Server error' });
  }
}