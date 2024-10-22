// src/lib/api/apiClient.ts
interface RequestConfig extends RequestInit {
    requireAuth?: boolean;
  }
  
  export async function apiClient<T>(
    endpoint: string,
    { requireAuth = false, ...customConfig }: RequestConfig = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
  
    if (requireAuth) {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      headers.Authorization = `Bearer ${accessToken}`;
    }
  
    const config: RequestConfig = {
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
      const data = await response.json();
  
      if (response.ok) {
        return data;
      }
  
      throw new Error(data.message || 'Something went wrong');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
  
  