// // src/lib/api/apiClient.ts
// interface RequestConfig extends RequestInit {
//     requireAuth?: boolean;
//   }
  
//   export async function apiClient<T>(
//     endpoint: string,
//     { requireAuth = false, ...customConfig }: RequestConfig = {}
//   ): Promise<T> {
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//     };
  
//     if (requireAuth) {
//       const accessToken = localStorage.getItem('access_token');
//       if (!accessToken) {
//         throw new Error('No access token found');
//       }
//       headers.Authorization = `Bearer ${accessToken}`;
//     }
  
//     const config: RequestConfig = {
//       ...customConfig,
//       headers: {
//         ...headers,
//         ...customConfig.headers,
//       },
//     };
  
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
//       const data = await response.json();
  
//       if (response.ok) {
//         return data;
//       }
  
//       throw new Error(data.message || 'Something went wrong');
//     } catch (error) {
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error('An unexpected error occurred');
//     }
//   }
  
interface RequestConfig extends RequestInit {
  requireAuth?: boolean;
  responseType?: 'json' | 'blob' | 'text';
}

export async function apiClient<T>(
  endpoint: string,
  { requireAuth = false, responseType = 'json', ...customConfig }: RequestConfig = {}
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
    
    // Handle 204 No Content response
    if (response.status === 204) {
      return {} as T;
    }

    let data;
    if (responseType === 'blob') {
      data = await response.blob();
    } else if (responseType === 'text') {
      data = await response.text();
    } else {
      // Only try to parse JSON if there's content
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    }

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
  