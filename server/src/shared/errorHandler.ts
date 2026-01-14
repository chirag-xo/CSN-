import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorResponse } from './errors';
import { ZodError } from 'zod';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            },
        };
        return res.status(400).json(errorResponse);
    }

    // Handle custom AppErrors
    if (err instanceof AppError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
            },
        };
        return res.status(err.statusCode).json(errorResponse);
    }

    // Handle unknown errors
    const errorResponse: ErrorResponse = {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'development'
                ? err.message
                : 'An unexpected error occurred',
        },
    };

    res.status(500).json(errorResponse);
};
