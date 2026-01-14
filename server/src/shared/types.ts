// Success response type
export interface SuccessResponse<T> {
    success: true;
    data: T;
}

// User type (without password)
export interface UserDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string | null;
    position: string | null;
    city: string | null;
    bio: string | null;
    chapterId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Auth response
export interface AuthResponse {
    user: UserDTO;
    token: string;
}

// Request user type (attached by auth middleware)
export interface RequestUser {
    userId: string;
    email: string;
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
        }
    }
}
