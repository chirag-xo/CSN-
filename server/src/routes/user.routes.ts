import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All user routes are protected
router.use(authMiddleware);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfileValidation, userController.updateProfile);

// Get user by ID
router.get('/:id', userController.getUserById);

export default router;
