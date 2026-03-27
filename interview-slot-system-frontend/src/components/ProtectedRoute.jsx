import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center mt-5">Loading...</div>
  if (!user) return <Navigate to="/" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />
  return children
}

export default ProtectedRoute