import User from '@/models/user';
import { getCurrentUser } from '@/controllers/v1/users/get_current_user'
import { updateCurrentUser } from '@/controllers/v1/users/update-current-user'
import { authenticate } from '@/middleware/authenticate'
import { authorize } from '@/middleware/authorize'
import { Router } from 'express'
import { body, query, param } from 'express-validator'
import { validationError } from '@/middleware/validation';
import { deleteCurrentUser } from '@/controllers/v1/users/delete_current_user';
import { getAllUsers } from '@/controllers/v1/users/get_all_users';
import { getUserById } from '@/controllers/v1/users/get-user-by-id';
import { deleteUserById } from '@/controllers/v1/users/delete-user-by-id';


const router = Router()

router.get('/current', authenticate, authorize(['admin', 'user']), getCurrentUser)
router.put('/current', authenticate, authorize(['admin', 'user']),
    body("username")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("username should be less than 20 characters")
        .custom(async (value) => {
            const userExists = await User.exists({ username: value })
            if (userExists) {
                throw new Error("username already exists")
            }
        }),
    body("email")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("email should have less than 50 characters")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (value) => {
            const userExists = await User.exists({ email: value })
            if (userExists) {
                throw new Error("email address already exists")
            }
        }),
    body("first_name")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("first_name should have less than 20 characters"),
    body("last_name")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("last_name should have less than 20 characters"),
    body(["youtube", "x", "instagram", "facebook", "linkedin"])
        .optional()
        .trim()
        .isURL()
        .withMessage("invalid url address")
        .isLength({ max: 100 })
        .withMessage("social links should be less 100 characters"),
    validationError,
    updateCurrentUser
)

router.delete('/current', authenticate, authorize(['admin', 'user']), deleteCurrentUser)

router.get('/', authenticate, authorize(['admin']),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('limit should be between 1 and 50'),
    query('offset')
        .optional()
        .isInt({min: 0})
        .withMessage("page should be a positive number"),
    validationError,
    getAllUsers
)

router.get('/:userId', authenticate, authorize(['admin']), 
    param('userId').notEmpty().isMongoId().withMessage('invalid user id'),
 getUserById)

 router.get('/:userId', authenticate, authorize(['admin']), 
    param('userId').notEmpty().isMongoId().withMessage('invalid user id'),
 deleteUserById)

export default router