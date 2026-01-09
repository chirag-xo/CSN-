import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { body, validationResult } from 'express-validator';

export const userController = {
    // Update profile validation
    updateProfileValidation: [
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
        body('lastName').optional().notEmpty().withMessage('Last name cannot be empty')
    ],

    // Get own profile
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const profile = await userService.getProfile(req.user.id);

            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    },

    // Update own profile
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const updatedProfile = await userService.updateProfile(req.user.id, req.body);

            res.status(200).json({
                success: true,
                data: updatedProfile
            });
        } catch (error) {
            next(error);
        }
    },

    // Get user by ID
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.getUserById(req.params.id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
};
