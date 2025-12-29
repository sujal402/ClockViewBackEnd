import express from 'express';
import { Register, Login, Me, Logout } from './authController.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);

// Protected route to get current user
router.get('/me', auth, Me);

// Logout (clears cookie)
router.post('/logout', auth, Logout);

export default router;