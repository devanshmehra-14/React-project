import { Navigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function ProtectedRoute({ children }) {
  const authToken = useAppStore((s) => s.authToken);

  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}
