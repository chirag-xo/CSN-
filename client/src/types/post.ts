export type PostStatus = 'pending' | 'published' | 'error';

export interface Post {
    id: string;
    author: {
        name: string;
        role: string;
        avatar?: string;
    };
    content: string;
    media?: string[]; // URLs to uploaded media
    createdAt: string;
    status: PostStatus;
    tempId?: string; // For optimistic updates
}

export interface PostDraft {
    content: string;
    media?: File[]; // Raw files for upload
}
