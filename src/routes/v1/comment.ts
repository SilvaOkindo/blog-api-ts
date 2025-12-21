import { addComment } from '@/controllers/v1/comment/add-comment';
import { deleteComment } from '@/controllers/v1/comment/delete-comment';
import { getCommentsByBlog } from '@/controllers/v1/comment/get-comments-by-blog';
import { authenticate } from '@/middleware/authenticate';
import { authorize } from '@/middleware/authorize';
import { validationError } from '@/middleware/validation';
import { Router } from 'express';
import { body, param } from 'express-validator';

const router = Router();

router.post(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  body('comment').isEmpty().withMessage("Comment should be empty"),
  param('blogId').isMongoId().withMessage('Enter valid blog id'),
  validationError,
  addComment,
);

router.get('/', authenticate, authorize(['admin', 'user']), getCommentsByBlog);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('commentId').isMongoId().withMessage('invalid comment id'),
  validationError,
  deleteComment,
);

export default router;
