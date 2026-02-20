import React from 'react';
import { Navigate } from 'react-router-dom';
import { detectPreferredLocale, isSupportedLocale } from '../utils/locale';
import App from '../App';

export const LocaleRedirect: React.FC = () => {
  const preferredLocale = detectPreferredLocale();
  return <Navigate to={`/${preferredLocale}`} replace />;
};

export const LocaleValidator: React.FC = () => {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const locale = pathSegments[0];
  
  if (locale && isSupportedLocale(locale)) {
    return <App />;
  }
  
  return <LocaleRedirect />;
};
