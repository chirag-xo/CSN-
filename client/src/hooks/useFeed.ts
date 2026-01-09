import { useState, useCallback, useEffect } from 'react';
import type { Post, PostDraft } from '../types/post';
import { postService } from '../services/post.service';
import { useAuth } from '../contexts/AuthContext';

export function useFeed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch posts on mount
    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await postService.getPosts();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    const createPost = useCallback(async (draft: PostDraft) => {
        console.log('createPost called with draft:', draft);

        if (!user) {
            console.error('No user found');
            throw new Error('User not authenticated');
        }

        console.log('User authenticated:', user.firstName, user.lastName);

        // Generate temporary ID for optimistic update
        const tempId = `temp-${Date.now()}`;

        // Create optimistic post
        const optimisticPost: Post = {
            id: tempId,
            tempId,
            author: {
                name: `${user.firstName} ${user.lastName}`,
                role: user.email, // TODO: Add role to user profile
            },
            content: draft.content,
            media: draft.media ? draft.media.map((file) => URL.createObjectURL(file)) : undefined,
            createdAt: new Date().toISOString(),
            status: 'pending',
        };

        console.log('Created optimistic post:', optimisticPost);

        // Add optimistic post to top of feed
        setPosts(prev => {
            console.log('Adding optimistic post to feed. Previous posts:', prev.length);
            return [optimisticPost, ...prev];
        });

        try {
            // Send to backend
            console.log('Calling postService.createPost...');
            const createdPost = await postService.createPost(draft);
            console.log('Post service returned:', createdPost);

            // Replace optimistic post with real one
            setPosts(prev =>
                prev.map(post =>
                    post.tempId === tempId ? createdPost : post
                )
            );
            console.log('Replaced optimistic post with server response');
        } catch (error) {
            console.error('Error creating post:', error);
            // Mark post as error
            setPosts(prev =>
                prev.map(post =>
                    post.tempId === tempId
                        ? { ...post, status: 'error' as const }
                        : post
                )
            );
            throw error;
        }
    }, [user]);

    const retryPost = useCallback(async (tempId: string) => {
        const failedPost = posts.find(p => p.tempId === tempId);
        if (!failedPost) return;

        // Reset to pending
        setPosts(prev =>
            prev.map(post =>
                post.tempId === tempId
                    ? { ...post, status: 'pending' as const }
                    : post
            )
        );

        const draft: PostDraft = {
            content: failedPost.content,
            // Note: media files are lost in retry, would need to store them
        };

        try {
            const createdPost = await postService.createPost(draft);
            setPosts(prev =>
                prev.map(post =>
                    post.tempId === tempId ? createdPost : post
                )
            );
        } catch (error) {
            setPosts(prev =>
                prev.map(post =>
                    post.tempId === tempId
                        ? { ...post, status: 'error' as const }
                        : post
                )
            );
        }
    }, [posts]);

    return {
        posts,
        isLoading,
        createPost,
        retryPost,
    };
}
