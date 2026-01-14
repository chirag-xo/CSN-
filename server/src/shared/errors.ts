// Standardized error response format
export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
    };
}

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code: string = 'INTERNAL_ERROR'
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorCodes = {
    // Authentication errors
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    UNAUTHORIZED: 'UNAUTHORIZED',

    // User errors
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',

    // Referral errors
    REFERRAL_NOT_FOUND: 'REFERRAL_NOT_FOUND',
    SELF_REFERRAL_NOT_ALLOWED: 'SELF_REFERRAL_NOT_ALLOWED',
    DUPLICATE_REFERRAL: 'DUPLICATE_REFERRAL',
    UNAUTHORIZED_STATUS_UPDATE: 'UNAUTHORIZED_STATUS_UPDATE',

    // Chapter errors
    CHAPTER_NOT_FOUND: 'CHAPTER_NOT_FOUND',

    // Validation errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',

    // Generic errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    NOT_FOUND: 'NOT_FOUND',
} as const;
