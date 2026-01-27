import express from 'express';
import { addToCart , getCartForUser ,removeFromCart,updateCartItemQuantity } from './cartController.js';

const router = express.Router();

router.post('/cart', addToCart);
router.get('/cart/:userId', getCartForUser);
router.delete('/cart', removeFromCart);
router.put('/cart', updateCartItemQuantity);    

export default router;