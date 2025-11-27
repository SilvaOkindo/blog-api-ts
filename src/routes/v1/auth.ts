import { login } from "@/controllers/v1/auth/login";
import { registerUser } from "@/controllers/v1/auth/register";
import { refreshToken } from "@/controllers/v1/auth/refresh-token";
import { validationError } from '@/middleware/validation'
import User from "@/models/user";

import { Router } from "express";
import { body, cookie } from 'express-validator'
import { authenticate } from "@/middleware/authenticate";
import { logout } from "@/controllers/v1/auth/logout";


const router = Router()

router.post('/register',
    body('email')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('Email should be a string')
        .withMessage('Email should not be empty')
        .isLength({ max: 50 })
        .withMessage('Email should have less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({
                email: value
            })

            if (userExists) {
                throw new Error('User already exists')
            }
        }),
    body('password')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('Password should be a string')
        .withMessage('Password should be empty')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long'),
    body('role')
        .trim()
        .notEmpty()
        .withMessage('Role should not empty')
        .isIn(['admin', 'user'])
        .withMessage('Role not supported.'),
    validationError,
    registerUser
)

router.post('/login', body('email')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Email should be a string')
    .withMessage('Email should not be empty')
    .isLength({ max: 50 })
    .withMessage('Email should have less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address'),
    body('password')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('Password should be a string')
        .withMessage('Password should not be empty')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long'),
    login
)

router.post('/refresh-token', cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token should not empty')
    .isJWT().withMessage('Refresh token should valid jwt'), 
    refreshToken
)

router.post('/logout', authenticate, logout)

export default router