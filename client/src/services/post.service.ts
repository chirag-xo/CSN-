import type { Post, PostDraft } from '../types/post';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:3001/api';

class PostService {
    private getAuthHeader() {
        const token = authService.getToken();
        return {
            'Authorization': `Bearer ${token}`
        };
    }

    async createPost(draft: PostDraft): Promise<Post> {
        const formData = new FormData();

        // Add content if present
        if (draft.content) {
            formData.append('content', draft.content);
        }

        // Add media files
        if (draft.media) {
            draft.media.forEach(file => {
                formData.append('media', file);
            });
        }

        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: this.getAuthHeader(),
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create post');
        }

        const result = await response.json();

        // Transform backend response to frontend Post format
        return {
            id: result.data.id,
            author: {
                name: result.data.user.name,
                role: result.data.user.headline,
            },
            content: result.data.content || '',
            media: result.data.media?.map((m: any) => m.url) || [],
            createdAt: result.data.createdAt,
            status: 'published'
        };
    }

    async getPosts(cursor?: string): Promise<{ posts: Post[]; nextCursor: string | null; hasMore: boolean }> {
        const params = new URLSearchParams();
        params.append('limit', '20');
        if (cursor) {
            params.append('cursor', cursor);
        }

        const response = await fetch(`${API_BASE_URL}/feed?${params.toString()}`, {
            method: 'GET',
            headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch posts');
        }

        const result = await response.json();

        // Transform backend posts to frontend format
        const posts: Post[] = result.data.posts.map((post: any) => ({
            id: post.id,
            author: {
                name: post.user.name,
                role: post.user.headline,
            },
            content: post.content || '',
            media: post.media?.map((m: any) => m.url) || [],
            createdAt: post.createdAt,
            status: 'published' as const
        }));

        return {
            posts,
            nextCursor: result.data.nextCursor,
            hasMore: result.data.hasMore
        };
    }
}

export const postService = new PostService();
