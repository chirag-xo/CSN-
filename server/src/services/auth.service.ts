import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    position?: string;
    city?: string;
}

interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    // Register new user
    async register(data: RegisterData) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                company: data.company,
                position: data.position,
                city: data.city
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                city: true,
                createdAt: true
            }
        });

        // Generate JWT token
        const token = this.generateToken(user.id);

        return { user, token };
    },

    // Login user
    async login(data: LoginData) {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate JWT token
        const token = this.generateToken(user.id);

        // Return user without password
        const { password, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    },

    // Generate JWT token
    generateToken(userId: string): string {
        return jwt.sign(
            { userId },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );
    },
    // Verify JWT token
    verifyToken(token: string): { userId: string } {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            return decoded;
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    }
};
