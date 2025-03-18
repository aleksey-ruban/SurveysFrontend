export interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;
    loading: boolean;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: string;
}