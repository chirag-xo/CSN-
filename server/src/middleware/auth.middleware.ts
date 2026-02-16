import { Request, Response, NextFunction } from 'express';
// @ts-ignore - Clerk SDK v4
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import prisma from '../shared/database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Augment Express Request type
declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: string | null;
                sessionId: string | null;
                getToken: () => Promise<string | null>;
                claims: any;
            };
            user?: {
                id: string;
                userId: string;
                email: string;
                [key: string]: any;
            };
        }
    }
}

// 1. Clerk Authentication Middleware
// This checks the Authorization header for a valid Bearer token
const clerkMiddleware = ClerkExpressWithAuth();

// 2. Database Sync & Guard Middleware
// This ensures the user exists in our DB and attaches them to req.user
// If auth fails, it returns 401 JSON immediately.
const dbSyncMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // CHECK: Is Clerk Auth present?
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No valid session found",
                code: "UNAUTHORIZED"
            });
        }

        // FETCH: Get user email from Clerk (SDK v4 way or assume claims)
        // Since we need to be robust, we'll try to find the user by Clerk ID or Email.
        // But our DB schema relies on Email.
        // Let's fetch the user from Clerk to get the email.
        const { clerkClient } = require('@clerk/clerk-sdk-node');

        let email: string | undefined;

        try {
            const clerkUser = await clerkClient.users.getUser(req.auth.userId);
            email = clerkUser.emailAddresses.find((e: any) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
        } catch (clerkErr) {
            console.error("Clerk Fetch Error:", clerkErr);
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid Clerk User" });
        }

        if (!email) {
            return res.status(400).json({ success: false, message: "Bad Request: No primary email found on account" });
        }

        // SYNC: Find or Create User in Prisma
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Auto-create user if they don't exist (First time login)
            // Note: In a strict system, maybe we redirect to registration.
            // But for this app, we seem to want auto-sync.
            console.log(`[Auth] Creating new user for ${email}`);
            // We need a dummy password since schema requires it (tech debt)
            const simpleHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

            user = await prisma.user.create({
                data: {
                    email,
                    password: simpleHash,
                    firstName: "New", // Fallbacks if Clerk data missing
                    lastName: "User",
                    emailVerified: true
                }
            });
        }

        // ATTACH: User to Request
        req.user = {
            ...user,
            userId: user.id
        };
        next();

    } catch (error) {
        console.error("[AuthMiddleware] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during authentication"
        });
    }
};

// Export the combined middleware array
export const authMiddleware = [
    clerkMiddleware,
    dbSyncMiddleware
];
