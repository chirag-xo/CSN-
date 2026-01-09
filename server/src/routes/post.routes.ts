import { Router } from 'express';
import { createPost, getFeed } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create post (with optional file uploads)
router.post('/posts', upload.array('media', 5), createPost);

// Get feed
router.get('/feed', getFeed);

export default router;
