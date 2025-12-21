import { likeBlog } from '@/controllers/v1/likes/like-blog';
import { authenticate } from '@/middleware/authenticate';
import { authorize } from '@/middleware/authorize';
import { validationError } from '@/middleware/validation';
import { Router } from 'express';
import { param } from 'express-validator';

const router = Router();

router.post(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog id'),
  validationError,
  likeBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog id'),
  validationError,
  likeBlog,
);

export default router;
