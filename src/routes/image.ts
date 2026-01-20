import { Router } from 'express';
import { upload } from '../middleware/multer';
import { uploadImage, getImages } from '../controllers/image';
import { protect } from '../middleware/auth';

const router = Router();

router.post(
  '/upload',
  protect,
  upload.fields([
    { name: 'original', maxCount: 1 },
    { name: 'cropped', maxCount: 1 },
  ]),
  uploadImage,
);
router.get('/', protect, getImages);

export default router;
