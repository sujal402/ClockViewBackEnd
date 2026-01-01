import express from 'express';
import { createProduct , productMediaUploadHandler , productGet , productGetById} from './productController.js';

import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/add',
   upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  createProduct
);

router.post('/media-upload', 
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  productMediaUploadHandler
);

router.get('/get', productGet);

router.get('/get/:id', productGetById);
export default router;