import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/theme-provider.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { CustomAxiosError } from './types/api.ts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const axiosError = error as CustomAxiosError;
        // Don't retry on 4xx errors except 408, 429
        if (axiosError?.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
          if (axiosError.response.status === 408 || axiosError.response.status === 429) {
            return failureCount < 2;
          }
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: (failureCount, error) => {
        const axiosError = error as CustomAxiosError;
        // Don't retry mutations on 4xx errors
        if (axiosError?.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
