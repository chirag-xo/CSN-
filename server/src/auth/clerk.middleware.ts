import { Request, Response, NextFunction } from 'express';
// @ts-ignore - Module will be available after install
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import prisma from '../shared/database';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

// augment Request type to include auth
declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: string | null;
                sessionId: string | null;
                getToken: () => Promise<string | null>;
                claims: any;
            };
        }
    }
}

// Wrapper to use Clerk's middleware but handle the next() logic manually if needed
// or just use it as a preceding middleware.
// ClerkExpressWithAuth populates req.auth
export const clerkAuthMiddleware = [
    // 1. Verify Clerk Token
    ClerkExpressWithAuth(),

    // 2. Sync User to DB
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // If no Clerk auth, just continue (fallback to JWT)
            if (!req.auth || !req.auth.userId) {
                return next();
            }

            // If we have Clerk auth, we need to find or create the user in our DB
            // We need the email to link accounts. Clerk claims usually have it if configured.
            // Or we might need to fetch user details from Clerk API if claims are insufficient.
            // For now, let's assume valid auth means we should try to sync.

            // Ideally, we'd use the Clerk User ID to map, but requirements said "Mapping to existing DB".
            // Existing DB users are keyed by Email.
            // We need to fetch the email from Clerk.
            // The req.auth.claims might contain it (sid, sub, etc).
            // However, the cleanest way to get email is using the Clerk Client capabilities or trusting the token claims if they include email.
            // By default, Clerk standard JWT might not include email unless customized.
            // Let's rely on `clerkClient.users.getUser(userId)` if we can, OR
            // assume the user is new.

            // BUT for performance, fetching user every request is bad.
            // Let's see if we can get it from claims.
            // If not, we will proceed. 
            // ACTUALLY, strict requirement: "Verify Clerk session token... Attach authenticated Clerk user data to req.user"

            // Let's import the Clerk client to fetch user details if needed.
            // import { clerkClient } from '@clerk/clerk-sdk-node';
            const { clerkClient } = require('@clerk/clerk-sdk-node');

            const clerkUser = await clerkClient.users.getUser(req.auth.userId);
            const email = clerkUser.emailAddresses.find((e: any) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;

            if (!email) {
                console.error('Clerk user has no primary email', req.auth.userId);
                return next();
            }

            // Find user in Prisma
            let user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                // Create new user
                // Generate random password
                const randomPassword = crypto.randomBytes(32).toString('hex');
                const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);

                user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        firstName: clerkUser.firstName || 'Clerk',
                        lastName: clerkUser.lastName || 'User',
                        emailVerified: true, // Clerk handled verification
                        // Default fields could go here
                    },
                });
            }

            // Attach to req.user for downstream compatibility
            req.user = {
                userId: user.id,
                email: user.email,
            };

            next();
        } catch (error) {
            console.error('Clerk Auth Middleware Error:', error);
            // If Clerk auth failed or DB sync failed, we should probably allow JWT fallback 
            // OR if the token WAS valid but sync failed, maybe error out?
            // "If invalid or no token: Call next() (Allow fall-through to JWT middleware)"
            // So if error, just next().
            next();
        }
    }
];
