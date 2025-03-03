import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { jwtToken } = useAuthStore();

  if (!jwtToken) {
    return <Navigate to="/auth/login" replace />
  }
  return children;
}