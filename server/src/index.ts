import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
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
import { errorHandler } from './shared/errorHandler';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://csn-skm2.vercel.app',
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

// Serve static files from uploads directory with CORS enabled
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

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
