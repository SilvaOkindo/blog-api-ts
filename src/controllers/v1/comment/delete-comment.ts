import { Response, Request } from 'express';

import { logger } from '@/lib/logger';
import Blog from '@/models/blog';
import { IComment } from '@/models/comment';
import Comment from '@/models/comment';

export const deleteComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId).lean().exec();

    if (!comment) {
      res.status(404).json({
        message: 'Comment not found',
      });
      return;
    }

    if (!comment.userId.equals(userId)) {
      res.status(403).json({
        message: "Authorization needed. You don't have enough creanditials",
      });
      logger.warn('User to tried to delete anauthorized commment');
      return;
    }

    const blog = await Blog.findById(comment.blogId).exec();

    if (!blog) {
      res.status(404).json({
        message: 'Blog not found',
      });
      return;
    }

    await Comment.findByIdAndDelete(commentId);
    logger.info('comment deleted successfully');
    blog.commentsCount--;
    await blog.save();
    logger.info('blog commentCount updated');
    res.status(204);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
    });
    logger.error('Error occurred while commenting a blog', err);
  }
};
