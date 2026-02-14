import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Admin' | 'Viewer';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Show loading state while checking authentication
  if (!isAuthenticated && !user) {
    // If no user in context but we're trying to load protected route, it's already being checked
    // on mount of AuthProvider
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

// Additional component for checking admin-only features
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    return null;
  }

  return <>{children}</>;
}