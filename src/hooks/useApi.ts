import { RequestOptions, makeRequest } from '@/libs/request';
import useSWR, { mutate } from 'swr';

const fetcher = async <T>(
  url: string,
  options?: RequestOptions
): Promise<T> => {
  return makeRequest<T>(url, options?.method || 'GET', options);
};

interface UseAPIResponse<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  revalidate: () => void;
}

export function useAPI<T>(
  endpoint: string,
  options: RequestOptions = { method: 'GET' }
): UseAPIResponse<T> {
  const { data, error } = useSWR<T>(endpoint, (url) => fetcher(url, options));

  const isLoading = !error && !data;
  const isError = error;

  // Function to trigger a revalidation of the data
  const revalidate = () => {
    mutate(endpoint);
  };

  return {
    data,
    isLoading,
    isError,
    revalidate,
  };
}
