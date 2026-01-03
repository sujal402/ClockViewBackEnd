import express from 'express';
import { update } from './userController.js';

const router = express.Router();

router.post('/update', update);

export default router;