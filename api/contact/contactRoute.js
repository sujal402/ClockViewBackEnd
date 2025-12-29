import express from 'express';
import { help } from './contactController.js';

const router = express.Router();

router.post('/contact', help);

export default router;