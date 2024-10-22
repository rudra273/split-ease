// src/lib/types/auth.ts
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  
  export interface Profile {
    id: number;
    user: User;
    phone: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }
  
  export interface AuthTokens {
    access: string;
    refresh: string;
  }
  
  export interface AuthContextType {
    user: Profile | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
  }