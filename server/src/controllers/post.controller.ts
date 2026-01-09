import { Request, Response } from 'express';
import prisma from '../config/database';
import { getStorageService } from '../services/storage.service';
import { getMediaType } from '../middleware/upload';

// Create a new post
export const createPost = async (req: Request & { user?: any }, res: Response) => {
    try {
        console.log('=== CREATE POST REQUEST ===');
        console.log('Body:', req.body);
        console.log('Files:', req.files);
        console.log('User:', req.user);

        const { content } = req.body;
        const files = req.files as Express.Multer.File[] | undefined;
        const userId = req.user?.id;

        if (!userId) {
            console.log('ERROR: No userId');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Validation: Must have content OR media
        if (!content && (!files || files.length === 0)) {
            console.log('ERROR: No content or files');
            return res.status(400).json({
                success: false,
                message: 'Post must contain either text content or media'
            });
        }

        // Validation: Content length
        if (content && content.length > 5000) {
            console.log('ERROR: Content too long');
            return res.status(400).json({
                success: false,
                message: 'Content is too long (maximum 5000 characters)'
            });
        }

        // Validation: Max files (redundant with multer but explicit)
        if (files && files.length > 5) {
            console.log('ERROR: Too many files');
            return res.status(400).json({
                success: false,
                message: 'Maximum 5 media files allowed per post'
            });
        }

        console.log('Validation passed. Processing files...');

        // Upload files and get URLs
        const storageService = getStorageService();
        const mediaPromises = files?.map(async (file, index) => {
            console.log(`Processing file ${index}:`, file.filename);
            const { url } = await storageService.uploadFile(file, userId);
            return {
                type: getMediaType(file.mimetype),
                url,
                order: index
            };
        }) || [];

        const mediaData = await Promise.all(mediaPromises);
        console.log('Media data:', mediaData);

        console.log('Creating post in database...');
        // Create post with media
        const post = await prisma.post.create({
            data: {
                content: content || null,
                userId,
                media: {
                    create: mediaData
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        company: true
                    }
                },
                media: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        console.log('Post created successfully:', post.id);

        // Format response
        const response = {
            id: post.id,
            content: post.content,
            media: post.media,
            user: {
                id: post.user.id,
                name: `${post.user.firstName} ${post.user.lastName}`,
                headline: post.user.position && post.user.company
                    ? `${post.user.position} at ${post.user.company}`
                    : post.user.position || post.user.company || 'Member',
                avatar: null // TODO: Add avatar support
            },
            createdAt: post.createdAt.toISOString()
        };

        console.log('Sending response...');
        return res.status(201).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('=== ERROR IN CREATE POST ===');
        console.error('Error type:', error?.constructor?.name);
        console.error('Error message:', error instanceof Error ? error.message : JSON.stringify(error));
        console.error('Full error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get feed posts
export const getFeed = async (req: Request & { user?: any }, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Parse query params
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
        const cursor = req.query.cursor as string | undefined;

        // Build query
        const posts = await prisma.post.findMany({
            where: {
                // For now, get all posts. Later: filter by user + connections
                ...(cursor && {
                    createdAt: {
                        lt: new Date(cursor)
                    }
                })
            },
            take: limit + 1, // Fetch one extra to determine if there are more
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        company: true
                    }
                },
                media: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        // Check if there are more posts
        const hasMore = posts.length > limit;
        const postsToReturn = hasMore ? posts.slice(0, limit) : posts;

        // Format posts
        const formattedPosts = postsToReturn.map(post => ({
            id: post.id,
            content: post.content,
            media: post.media,
            user: {
                id: post.user.id,
                name: `${post.user.firstName} ${post.user.lastName}`,
                headline: post.user.position && post.user.company
                    ? `${post.user.position} at ${post.user.company}`
                    : post.user.position || post.user.company || 'Member',
                avatar: null
            },
            createdAt: post.createdAt.toISOString()
        }));

        // Get next cursor (createdAt of last post)
        const nextCursor = hasMore
            ? postsToReturn[postsToReturn.length - 1].createdAt.toISOString()
            : null;

        return res.status(200).json({
            success: true,
            data: {
                posts: formattedPosts,
                nextCursor,
                hasMore
            }
        });

    } catch (error) {
        console.error('Error fetching feed:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch feed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
