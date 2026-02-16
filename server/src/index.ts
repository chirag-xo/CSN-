
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

// Middleware
import { errorHandler } from './shared/errorHandler';
// New Auth Middleware (Protected Only)
import { authMiddleware } from './middleware/auth.middleware';

// Routes
import authRoutes from './auth/auth.routes';
import dashboardRoutes from './dashboard/dashboard.routes';
import referralRoutes from './referrals/referral.routes';
import userRoutes from './users/user.routes';
import profileRoutes from './profile/profile.routes';
import interestRoutes from './interests/interest.routes';
import privacyRoutes from './privacy/privacy.routes';
import uploadRoutes from './profile/upload.routes';
import connectionRoutes from './connections/connection.routes';
import eventRoutes from './events/event.routes';
import galleryRoutes from './gallery/gallery.routes';
import contactRoutes from './contact/contact.routes';
import chapterRoutes from './chapters/chapter.routes';
import publicChapterRoutes from './chapters/public.chapter.routes';
import paymentRoutes from './routes/payment.routes';

// Load environment variables (Loaded via import 'dotenv/config')

const app = express();
const PORT = process.env.PORT || 3001;

// Define allowed origins
const CORS_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://csn-skm2.vercel.app',
    'https://csnworld.com',
    'https://www.csnworld.com',
    process.env.CORS_ORIGIN
].filter(Boolean);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (CORS_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================================================
// PUBLIC ROUTES (No Auth Required)
// ============================================================================

// Deployment Health Checks
app.get('/', (req, res) => {
    res.status(200).json({ message: "Backend is running" });
});

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Backend is healthy' });
});

// Authentication Routes (Login/Register/SSO)
app.use('/api/auth', authRoutes);

// Public API Routes
app.use('/api/public/chapters', publicChapterRoutes);

// ============================================================================
// PROTECTED ROUTES (Auth Required)
// ============================================================================

// Apply Auth Middleware to all routes below
// This ensures that any request to these endpoints MUST have a valid Clerk token
// otherwise it returns 401 JSON immediately.

app.use('/api/dashboard', authMiddleware as any, dashboardRoutes);
app.use('/api/referrals', authMiddleware as any, referralRoutes);
app.use('/api/users', authMiddleware as any, userRoutes);
app.use('/api/profile', authMiddleware as any, profileRoutes);
app.use('/api/profile', authMiddleware as any, uploadRoutes); // Merge path logic
app.use('/api/interests', authMiddleware as any, interestRoutes);
app.use('/api/privacy', authMiddleware as any, privacyRoutes);
app.use('/api/connections', authMiddleware as any, connectionRoutes);
app.use('/api/events', authMiddleware as any, eventRoutes);
app.use('/api/gallery', authMiddleware as any, galleryRoutes);
app.use('/api/contact', authMiddleware as any, contactRoutes);
app.use('/api/chapters', authMiddleware as any, chapterRoutes); // Internal chapter management
app.use('/api/payments', authMiddleware as any, paymentRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 CORS enabled for: ${CORS_ORIGINS}`);
});

export default app;
