import { Router, Request, Response, NextFunction } from 'express';
import { connectionService } from './connection.service';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';

const router = Router();

// All connection routes require authentication
router.use(authMiddleware);

// Send connection request
router.post('/request', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { addresseeId, message } = req.body;
        const connection = await connectionService.sendRequest(
            req.user!.userId,
            addresseeId,
            message
        );

        const response: SuccessResponse<typeof connection> = {
            success: true,
            data: connection,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Accept connection request
router.patch('/:id/accept', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connection = await connectionService.acceptRequest(req.params.id, req.user!.userId);

        const response: SuccessResponse<typeof connection> = {
            success: true,
            data: connection,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Decline connection request
router.patch('/:id/decline', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connection = await connectionService.declineRequest(req.params.id, req.user!.userId);

        const response: SuccessResponse<typeof connection> = {
            success: true,
            data: connection,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Remove connection
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await connectionService.removeConnection(req.params.id, req.user!.userId);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get user's connections
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status = 'ACCEPTED', search } = req.query;
        const connections = await connectionService.getConnections(
            req.user!.userId,
            status as string,
            search as string | undefined
        );

        const response: SuccessResponse<{ connections: typeof connections; count: number }> = {
            success: true,
            data: {
                connections,
                count: connections.length,
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get pending requests (received)
router.get('/pending', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await connectionService.getPendingRequests(req.user!.userId);

        const response: SuccessResponse<{ requests: typeof requests; count: number }> = {
            success: true,
            data: {
                requests,
                count: requests.length,
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get sent requests
router.get('/sent', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await connectionService.getSentRequests(req.user!.userId);

        const response: SuccessResponse<{ requests: typeof requests; count: number }> = {
            success: true,
            data: {
                requests,
                count: requests.length,
            },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get connection stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await connectionService.getStats(req.user!.userId);

        const response: SuccessResponse<typeof stats> = {
            success: true,
            data: stats,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Check connection status with specific user
router.get('/status/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = await connectionService.getConnectionStatus(
            req.user!.userId,
            req.params.userId
        );

        const response: SuccessResponse<typeof status> = {
            success: true,
            data: status,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
