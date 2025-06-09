import { useMutation, useQuery, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosClient from '../axios-client';
import type { User, LoginCredentials, LoginResponse, ApiError } from '../types/auth';
import type { CustomAxiosError } from '../types/api';

// Auth API functions
const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await axiosClient.post('/logout');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosClient.get<User>('/get-user-data');
    return response.data;
  },
  
  refreshToken: async (): Promise<void> => {
    await axiosClient.post('/refresh');
  }
};

// Auth query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
} as const;

// Custom hook for authentication
export interface UseAuthReturn {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingUser: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  loginError: CustomAxiosError | null;
  logoutError: CustomAxiosError | null;
  isLoginPending: boolean;
  isLogoutPending: boolean;
  userQuery: UseQueryResult<User, CustomAxiosError>;
  loginMutation: UseMutationResult<LoginResponse, CustomAxiosError, LoginCredentials>;
  logoutMutation: UseMutationResult<void, CustomAxiosError, void>;
}

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();

  // Get current user query
  const userQuery = useQuery<User, CustomAxiosError>({
    queryKey: authKeys.user(),
    queryFn: authApi.getCurrentUser,
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Login mutation
  const loginMutation = useMutation<LoginResponse, CustomAxiosError, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), data.user);
      // Invalidate and refetch user data to ensure consistency
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  });

  // Logout mutation
  const logoutMutation = useMutation<void, CustomAxiosError, void>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });
      // Clear all queries if you want to reset entire app state
      // queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', error.response?.data?.message || error.message);
      // Even if logout fails on server, clear local data
      queryClient.removeQueries({ queryKey: authKeys.all });
    }
  });

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = async (): Promise<void> => {
    return logoutMutation.mutateAsync();
  };

  const isAuthenticated = !!userQuery.data && !userQuery.isError;
  const isLoading = userQuery.isLoading || loginMutation.isPending || logoutMutation.isPending;

  return {
    user: userQuery.data,
    isAuthenticated,
    isLoading,
    isLoadingUser: userQuery.isLoading,
    login,
    logout,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    userQuery,
    loginMutation,
    logoutMutation,
  };
};