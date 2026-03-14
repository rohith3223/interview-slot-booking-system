import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { getReports } from '../services/slotService'
import { getStatusBadge } from '../utils/helpers'
import api from '../services/api'

const Reports = () => {
  const [stats, setStats] = useState(null)
  const [interviews, setInterviews] = useState([])

  useEffect(() => {
    getReports().then(setStats).catch(() => {})
    api.get('/interviews').then(r => setInterviews(r.data)).catch(() => {})
  }, [])

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Reports & Analytics" />

        {stats && (
          <div className="row mb-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, color: '#667eea, #764ba2' },
              { label: 'Total Jobs', value: stats.totalJobs, color: '#f093fb, #f5576c' },
              { label: 'Total Slots', value: stats.totalSlots, color: '#4facfe, #00f2fe' },
              { label: 'Total Interviews', value: stats.totalInterviews, color: '#43e97b, #38f9d7' },
              { label: 'Scheduled', value: stats.scheduledInterviews, color: '#fa709a, #fee140' },
              { label: 'Completed', value: stats.completedInterviews, color: '#a18cd1, #fbc2eb' },
              { label: 'Cancelled', value: stats.cancelledInterviews, color: '#fda085, #f6d365' },
            ].map((s, i) => (
              <div key={i} className="col-md-3">
                <div className="stat-card" style={{background: `linear-gradient(135deg, ${s.color})`}}>
                  <h3>{s.value}</h3>
                  <p className="mb-0">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-header">All Interviews</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Booked At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview, index) => (
                    <tr key={interview.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(interview.status)}`}>
                          {interview.status}
                        </span>
                      </td>
                      <td>{interview.bookedAt ? new Date(interview.bookedAt).toLocaleString() : 'N/A'}</td>
                      <td>{interview.updatedAt ? new Date(interview.updatedAt).toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports