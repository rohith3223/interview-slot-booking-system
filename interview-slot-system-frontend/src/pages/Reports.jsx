import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { getReports } from '../services/slotService'
import { getStatusBadge } from '../utils/helpers'
import api from '../services/api'

const Reports = () => {
  const [stats, setStats] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [jobs, setJobs] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [jobFilter, setJobFilter] = useState('')

  useEffect(() => {
    getReports().then(setStats).catch(() => {})
    api.get('/interviews').then(r => setInterviews(r.data)).catch(() => {})
    api.get('/jobs').then(r => setJobs(r.data)).catch(() => {})
  }, [])

  const filtered = interviews.filter(i => {
    const matchStatus = statusFilter ? i.status === statusFilter : true
    const matchJob = jobFilter ? i.job?.id === parseInt(jobFilter) : true
    return matchStatus && matchJob
  })

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
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>All Interviews ({filtered.length})</span>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" style={{width: '160px'}}
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select className="form-select form-select-sm" style={{width: '180px'}}
                value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
                <option value="">All Jobs</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Interviewer</th>
                    <th>Status</th>
                    <th>Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((interview, index) => (
                    <tr key={interview.id}>
                      <td>{index + 1}</td>
                      <td>{interview.candidate?.name || 'N/A'}</td>
                      <td>{interview.job?.title || 'N/A'}</td>
                      <td>{interview.slot?.interviewer?.name || 'N/A'}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(interview.status)}`}>
                          {interview.status}
                        </span>
                      </td>
                      <td>{interview.bookedAt ? new Date(interview.bookedAt).toLocaleString() : 'N/A'}</td>
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