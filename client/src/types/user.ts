export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
    position?: string;
    city?: string;
    bio?: string;
    interests?: string[];
    phone?: string;
    state?: string;
    profilePhoto?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    position?: string;
    city?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    company?: string;
    position?: string;
    city?: string;
    bio?: string;
    interests?: string[];
}
