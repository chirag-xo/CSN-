import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';
import { UserDTO, AuthResponse } from '../shared/types';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    position: z.string().optional(),
    city: z.string().optional(),
    chapterId: z.string().uuid().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Helper to exclude password from user object
const excludePassword = (user: any): UserDTO => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const authService = {
    // Register new user
    async register(data: z.infer<typeof registerSchema>): Promise<AuthResponse> {
        // Validate input
        const validatedData = registerSchema.parse(data);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            throw new AppError('User with this email already exists', 400, errorCodes.USER_ALREADY_EXISTS);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, SALT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                company: validatedData.company,
                position: validatedData.position,
                city: validatedData.city,
                chapterId: validatedData.chapterId,
            },
        });

        // Generate token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as any);

        return {
            user: excludePassword(user),
            token,
        };
    },

    // Login user
    async login(data: z.infer<typeof loginSchema>): Promise<AuthResponse> {
        // Validate input
        const validatedData = loginSchema.parse(data);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401, errorCodes.INVALID_CREDENTIALS);
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validatedData.password, user.password);

        if (!isValidPassword) {
            throw new AppError('Invalid credentials', 401, errorCodes.INVALID_CREDENTIALS);
        }

        // Generate token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as any);

        return {
            user: excludePassword(user),
            token,
        };
    },

    // Verify token
    verifyToken(token: string): { userId: string; email: string } {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError('Token has expired', 401, errorCodes.TOKEN_EXPIRED);
            }
            throw new AppError('Invalid token', 401, errorCodes.TOKEN_INVALID);
        }
    },

    // Get current user by ID
    async getCurrentUser(userId: string): Promise<UserDTO> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                city: true,
                bio: true,
                chapterId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404, errorCodes.USER_NOT_FOUND);
        }

        return user;
    },
};
