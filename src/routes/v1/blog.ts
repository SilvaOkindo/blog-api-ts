import { authenticate } from './../../middleware/authenticate';
import { authorize } from '@/middleware/authorize';
import { createBlog } from '@/controllers/v1/blog/create-blog';
import { Router } from 'express';
import multer from 'multer';
import { uploadBanner } from '@/middleware/upload-banner';
import { body, param, query } from 'express-validator';
import { validationError } from '@/middleware/validation';
import { getBlogs } from '@/controllers/v1/blog/get-blogs';
import { getBlogsByUser } from '@/controllers/v1/blog/get-blogs-by-user';
import { getBlogBySlug } from '@/controllers/v1/blog/get-blog-by-slug';

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

router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit should be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('page should be a positive number'),
  validationError,
  getBlogs,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId').notEmpty().isMongoId().withMessage('invalid user id'),
  validationError,
  getBlogsByUser,
);

router.get(
  '/slug/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('sl(ug')
    .notEmpty()
    .withMessage('slug is required')
    .isString()
    .withMessage('slug should be a string'),
  getBlogBySlug,
);

export default router;
