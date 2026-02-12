import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
import paymentRoutes from './routes/payment.routes';
import { errorHandler } from './shared/errorHandler';
import path from 'path';

// Load environment variables (Loaded via import 'dotenv/config')

const app = express();
const PORT = process.env.PORT || 3001;
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

// Clerk Authentication Middleware (Global)
import { clerkAuthMiddleware } from './auth/clerk.middleware';
// @ts-ignore
app.use(...(clerkAuthMiddleware as any));

// Serve static files from uploads directory with CORS enabled
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Backend is healthy' });
});

// API Routes
import publicChapterRoutes from './chapters/public.chapter.routes';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/profile', uploadRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/public/chapters', publicChapterRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 CORS enabled for: ${CORS_ORIGINS}`);
});

export default app;
