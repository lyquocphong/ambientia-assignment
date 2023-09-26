export interface RequestOptions extends RequestInit {
  next?: { revalidate: number };
}

export const getCommonRequestInit = (): RequestOptions => {
  return {
    next: { revalidate: process.env.NODE_ENV !== 'production' ? 5 : 300 },
  };
};

export const makeRequest = async<T>(
  url: string,
  method: string = 'GET',
  options?: RequestOptions
): Promise<T> => {
  try {
    const defaultOptions = getCommonRequestInit();
    const mergedOptions: RequestOptions = {
      ...defaultOptions,
      method,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options?.headers || {}),
      },
    };

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to fetch data');
    }

    return (await response.json()) as T;
  } catch (error) {
    throw error;
  }
};