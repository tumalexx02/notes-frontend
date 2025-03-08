import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { accessToken: accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />
  }
  return children;
}