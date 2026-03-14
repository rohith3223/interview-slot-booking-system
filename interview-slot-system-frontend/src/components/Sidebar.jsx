import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Sidebar = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const getRoleBadgeColor = (role) => {
    if (role === 'ADMIN') return '#dc3545'
    if (role === 'HR') return '#ffc107'
    if (role === 'INTERVIEWER') return '#0dcaf0'
    return '#198754'
  }

  return (
    <div className="sidebar d-flex flex-column">
      <div className="sidebar-brand">
        <span>🎯</span> Interview System
      </div>

      <nav className="sidebar-nav flex-grow-1">
        <NavLink to="/dashboard" className={({ isActive }) =>
          `sidebar-link ${isActive ? 'active' : ''}`}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/jobs" className={({ isActive }) =>
          `sidebar-link ${isActive ? 'active' : ''}`}>
          💼 Jobs
        </NavLink>

        <NavLink to="/slots" className={({ isActive }) =>
          `sidebar-link ${isActive ? 'active' : ''}`}>
          🕐 {user?.role === 'CANDIDATE' ? 'Book Slot' : 'Manage Slots'}
        </NavLink>

        <NavLink to="/interviews" className={({ isActive }) =>
          `sidebar-link ${isActive ? 'active' : ''}`}>
          📋 Interviews
        </NavLink>

        {(user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'INTERVIEWER') && (
          <NavLink to="/feedback" className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`}>
            📝 Feedback
          </NavLink>
        )}

        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <NavLink to="/reports" className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`}>
            📈 Reports
          </NavLink>
        )}

        {user?.role === 'ADMIN' && (
          <NavLink to="/admin" className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`}>
            ⚙️ Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="mb-2">
          <strong>{user?.name}</strong>
        </div>
        <span className="role-badge mb-3 d-inline-block"
          style={{ backgroundColor: getRoleBadgeColor(user?.role) }}>
          {user?.role}
        </span>
        <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar