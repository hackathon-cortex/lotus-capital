import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { MockAuthProvider } from './context/MockAuthContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MockAuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MockAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

