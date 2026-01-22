import { Router, Request, Response } from 'express';
import eventService from './event.service';
import { authMiddleware } from '../auth/auth.middleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuth';

const router = Router();

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private
 */
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const event = await eventService.createEvent(req.body, userId);

        res.status(201).json({
            success: true,
            data: event,
        });
    } catch (error: any) {
        console.error('Create event error:', error);
        res.status(400).json({
            success: false,
            error: {
                message: error.message || 'Failed to create event',
            },
        });
    }
});

/**
 * @route   GET /api/events
 * @desc    Get events with filters
 * @access  Public (shows user RSVP if authenticated)
 */
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId; // Optional, from authMiddleware if present
        const filters = {
            type: req.query.type as string,
            chapterId: req.query.chapterId as string,
            search: req.query.search as string,
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        };

        const events = await eventService.getEvents(filters, userId);

        res.json({
            success: true,
            data: events,
        });
    } catch (error: any) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch events',
            },
        });
    }
});

/**
 * @route   GET /api/events/upcoming
 * @desc    Get upcoming events
 * @access  Public
 */
router.get('/upcoming', optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const events = await eventService.getUpcomingEvents(userId);

        res.json({
            success: true,
            data: events,
        });
    } catch (error: any) {
        console.error('Get upcoming events error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch upcoming events',
            },
        });
    }
});

/**
 * @route   GET /api/events/my-events
 * @desc    Get user's events (created + attending)
 * @access  Private
 */
router.get('/my-events', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const events = await eventService.getMyEvents(userId);

        res.json({
            success: true,
            data: events,
        });
    } catch (error: any) {
        console.error('Get my events error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch your events',
            },
        });
    }
});

/**
 * @route   GET /api/events/invitations
 * @desc    Get user's invited events (paginated)
 * @access  Private
 */
router.get('/invitations', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        const result = await eventService.getInvitedEvents(userId, limit, offset);

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error('Get invitations error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch invitations',
            },
        });
    }
});

/**
 * @route   GET /api/events/invitations/count
 * @desc    Get count of pending invitations
 * @access  Private
 */
router.get('/invitations/count', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const result = await eventService.getInvitationCount(userId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error('Get invitation count error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch invitation count',
            },
        });
    }
});

/**
 * @route   GET /api/events/:id/invitation-stats
 * @desc    Get invitation statistics for an event (organizer only)
 * @access  Private (organizer only)
 */
router.get('/:id/invitation-stats', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const stats = await eventService.getInvitationStats(req.params.id, userId);

        res.json({
            success: true,
            data: stats,
        });
    } catch (error: any) {
        console.error('Get invitation stats error:', error);
        const status = error.message.includes('Only event organizer') ? 403 :
            error.message === 'Event not found' ? 404 : 500;
        res.status(status).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch invitation stats',
            },
        });
    }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public (but includes user-specific data if authenticated)
 */
router.get('/:id', optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const event = await eventService.getEventById(req.params.id, userId);

        res.json({
            success: true,
            data: event,
        });
    } catch (error: any) {
        console.error('Get event error:', error);
        res.status(error.message === 'Event not found' ? 404 : 500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch event',
            },
        });
    }
});

/**
 * @route   PATCH /api/events/:id
 * @desc    Update an event
 * @access  Private (creator only)
 */
router.patch('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const event = await eventService.updateEvent(req.params.id, req.body, userId);

        res.json({
            success: true,
            data: event,
        });
    } catch (error: any) {
        console.error('Update event error:', error);
        const status = error.message === 'Event not found' ? 404 :
            error.message.includes('Only event creator') ? 403 : 400;
        res.status(status).json({
            success: false,
            error: {
                message: error.message || 'Failed to update event',
            },
        });
    }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private (creator only)
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const result = await eventService.deleteEvent(req.params.id, userId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error('Delete event error:', error);
        const status = error.message === 'Event not found' ? 404 :
            error.message.includes('Only event creator') ? 403 : 500;
        res.status(status).json({
            success: false,
            error: {
                message: error.message || 'Failed to delete event',
            },
        });
    }
});

/**
 * @route   POST /api/events/:id/rsvp
 * @desc    RSVP to an event
 * @access  Private
 */
router.post('/:id/rsvp', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { status } = req.body;

        if (!status) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'RSVP status is required',
                },
            });
            return;
        }

        const rsvp = await eventService.rsvpToEvent(req.params.id, userId, status);

        res.json({
            success: true,
            data: rsvp,
        });
    } catch (error: any) {
        console.error('RSVP error:', error);
        res.status(error.message === 'Event not found' ? 404 : 400).json({
            success: false,
            error: {
                message: error.message || 'Failed to RSVP to event',
            },
        });
    }
});

/**
 * @route   GET /api/events/:id/attendees
 * @desc    Get attendees for an event
 * @access  Public
 */
router.get('/:id/attendees', async (req: Request, res: Response): Promise<void> => {
    try {
        const attendees = await eventService.getAttendees(req.params.id);

        res.json({
            success: true,
            data: attendees,
        });
    } catch (error: any) {
        console.error('Get attendees error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch attendees',
            },
        });
    }
});

/**
 * @route   GET /api/events/chapter/:chapterId
 * @desc    Get events by chapter
 * @access  Public
 */
router.get('/chapter/:chapterId', optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const events = await eventService.getEventsByChapter(req.params.chapterId, userId);

        res.json({
            success: true,
            data: events,
        });
    } catch (error: any) {
        console.error('Get chapter events error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch chapter events',
            },
        });
    }
});

/**
 * @route   POST /api/events/:id/invite
 * @desc    Add more invitees to a private event
 * @access  Private (organizer only)
 */
router.post('/:id/invite', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { invitedUserIds } = req.body;

        if (!Array.isArray(invitedUserIds) || invitedUserIds.length === 0) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'invitedUserIds must be a non-empty array',
                },
            });
            return;
        }

        const result = await eventService.addInvitees(req.params.id, userId, invitedUserIds);

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error('Add invitees error:', error);
        const status = error.message.includes('Only event organizer') ? 403 :
            error.message === 'Event not found' ? 404 :
                error.message === 'Cannot add invitees to public events' ? 400 : 500;
        res.status(status).json({
            success: false,
            error: {
                message: error.message || 'Failed to add invitees',
            },
        });
    }
});

/**
 * @route   GET /api/events/:id/attendees/export
 * @desc    Export attendee list as CSV
 * @access  Private (organizer only)
 */
router.get('/:id/attendees/export', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { csv, filename } = await eventService.exportAttendees(req.params.id, userId);

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (error: any) {
        console.error('Export attendees error:', error);
        const status = error.message.includes('Only event organizer') ? 403 :
            error.message === 'Event not found' ? 404 : 500;
        res.status(status).json({
            success: false,
            error: {
                message: error.message || 'Failed to export attendees',
            },
        });
    }
});

export default router;
