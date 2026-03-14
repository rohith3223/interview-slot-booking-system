import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { getReports } from '../services/slotService'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'HR') {
      getReports().then(setStats).catch(() => {})
    }
  }, [user])

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Dashboard" />

        <div className="mb-4">
          <h4>Welcome back, <strong>{user?.name}</strong> 👋</h4>
          <p className="text-muted">Role: <span className={`badge bg-${user?.role === 'ADMIN' ? 'danger' : user?.role === 'HR' ? 'warning' : user?.role === 'INTERVIEWER' ? 'primary' : 'success'}`}>{user?.role}</span></p>
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'HR') && stats && (
          <div className="row">
            <div className="col-md-3">
              <div className="stat-card" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                <h3>{stats.totalUsers}</h3>
                <p className="mb-0">Total Users</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card" style={{background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                <h3>{stats.totalJobs}</h3>
                <p className="mb-0">Total Jobs</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}>
                <h3>{stats.totalSlots}</h3>
                <p className="mb-0">Total Slots</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card" style={{background: 'linear-gradient(135deg, #43e97b, #38f9d7)'}}>
                <h3>{stats.totalInterviews}</h3>
                <p className="mb-0">Total Interviews</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card" style={{background: 'linear-gradient(135deg, #fa709a, #fee140)'}}>
                <h3>{stats.scheduledInterviews}</h3>
                <p className="mb-0">Scheduled</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card" style={{background: 'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
                <h3>{stats.completedInterviews}</h3>
                <p className="mb-0">Completed</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card" style={{background: 'linear-gradient(135deg, #fda085, #f6d365)'}}>
                <h3>{stats.cancelledInterviews}</h3>
                <p className="mb-0">Cancelled</p>
              </div>
            </div>
          </div>
        )}

        {(user?.role === 'INTERVIEWER') && (
          <div className="card">
            <div className="card-header">Quick Actions</div>
            <div className="card-body">
              <p>📋 View your assigned interviews in the <strong>Interviews</strong> section</p>
              <p>🕐 Manage your available slots in the <strong>Manage Slots</strong> section</p>
            </div>
          </div>
        )}

        {user?.role === 'CANDIDATE' && (
          <div className="card">
            <div className="card-header">Quick Actions</div>
            <div className="card-body">
              <p>📅 Book an interview slot in the <strong>Book Slot</strong> section</p>
              <p>💼 View available jobs in the <strong>Jobs</strong> section</p>
              <p>📋 Track your interviews in the <strong>Interviews</strong> section</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard