import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MockAuthProvider } from './context/MockAuthContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <MockAuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MockAuthProvider>
    </HelmetProvider>
  );
};

