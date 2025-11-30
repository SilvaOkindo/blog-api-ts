import { authenticate } from './../../middleware/authenticate';
import { authorize } from '@/middleware/authorize';
import { createBlog } from '@/controllers/v1/blog/create-blog';
import { Router } from 'express';
import multer from 'multer';
import { uploadBanner } from '@/middleware/upload-banner';
import { body } from 'express-validator';
import { validationError } from '@/middleware/validation';

const router = Router();

const upload = multer();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ max: 180 })
    .withMessage('Title should be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['draft', 'published'])
    .withMessage('Status should be either published or draft'),
  validationError,
   uploadBanner('post'),
  createBlog,
);

export default router;
