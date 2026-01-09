import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { body, validationResult } from 'express-validator';

export const authController = {
    // Register validation rules
    registerValidation: [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required')
    ],

    // Login validation rules
    loginValidation: [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required')
    ],

    // Register new user
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const result = await authService.register(req.body);

            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    // Login user
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const result = await authService.login(req.body);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    // Get current user
    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({
                success: true,
                data: req.user
            });
        } catch (error) {
            next(error);
        }
    }
};
