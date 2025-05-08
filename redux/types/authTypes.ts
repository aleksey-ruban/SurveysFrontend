export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
}

export enum UserRole {
    USER = "respondent",
    CREATOR = "creator",
}

export interface User {
    id: number,
    email: string,
    name: string,
    role: UserRole,
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