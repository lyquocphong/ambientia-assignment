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
    console.log(mergedOptions)
    const response = await fetch(url, mergedOptions);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error ?? 'Failed to fetch data');
    }

    return data as T;
  } catch (error) {
    throw error;
  }
};