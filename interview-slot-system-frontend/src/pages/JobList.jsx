/* eslint-disable */
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { getAllJobs, createJob, deleteJob } from '../services/jobService'
import useAuth from '../hooks/useAuth'

const JobList = () => {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [form, setForm] = useState({
    title: '', department: '', location: '', address: '',
    description: '', status: 'OPEN',
    maxCandidates: '', expiryDate: ''
  })
  const { user } = useAuth()

  // ✅ Min date for expiry
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  const minDateTime = now.toISOString().slice(0, 16)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const data = await getAllJobs()
      setJobs(data)
      setFiltered(data)
    } catch {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  useEffect(() => {
    let result = jobs
    if (search) {
      result = result.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department?.toLowerCase().includes(search.toLowerCase()) ||
        j.location?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(j => j.status === statusFilter)
    }
    setFiltered(result)
  }, [search, statusFilter, jobs])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const jobData = {
        ...form,
        maxCandidates: form.maxCandidates ? parseInt(form.maxCandidates) : null,
        expiryDate: form.expiryDate ? form.expiryDate : null
      }
      await createJob(jobData)
      toast.success('Job created successfully!')
      setShowForm(false)
      setForm({
        title: '', department: '', location: '', address: '',
        description: '', status: 'OPEN',
        maxCandidates: '', expiryDate: ''
      })
      fetchJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await deleteJob(id)
      toast.success('Job deleted!')
      fetchJobs()
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const getStatusColor = (status) => {
    if (status === 'OPEN') return 'success'
    if (status === 'CLOSED') return 'danger'
    return 'warning'
  }

  const isExpired = (job) => {
    if (!job.expiryDate) return false
    return new Date(job.expiryDate) < new Date()
  }

  const isFull = (job) => {
    if (!job.maxCandidates) return false
    return job.bookingCount >= job.maxCandidates
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Job Listings" />

        {/* Search & Filter Bar */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by title, department, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
          <div className="col-md-4 text-end">
            {(user?.role === 'ADMIN' || user?.role === 'HR') && (
              <button className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}>
                {showForm ? '✕ Cancel' : '+ Add Job'}
              </button>
            )}
          </div>
        </div>

        {/* Add Job Form */}
        {showForm && (
          <div className="card mb-4">
            <div className="card-header fw-semibold">Create New Job</div>
            <div className="card-body">
              <form onSubmit={handleCreate}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Job Title</label>
                    <input type="text" className="form-control"
                      placeholder="e.g. Software Engineer"
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control"
                      placeholder="e.g. Engineering"
                      value={form.department}
                      onChange={e => setForm({...form, department: e.target.value})} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control"
                      placeholder="e.g. Hyderabad"
                      value={form.location}
                      onChange={e => setForm({...form, location: e.target.value})} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status}
                      onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                  </div>

                  {/* ✅ Max Candidates */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      👥 Max Candidates
                      <small className="text-muted ms-2">
                        (Job hides after this many bookings)
                      </small>
                    </label>
                    <input type="number" className="form-control"
                      placeholder="e.g. 10 (leave empty for unlimited)"
                      min="1"
                      value={form.maxCandidates}
                      onChange={e => setForm({...form, maxCandidates: e.target.value})} />
                  </div>

                  {/* ✅ Expiry Date */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      📅 Expiry Date
                      <small className="text-muted ms-2">
                        (Job hides after this date)
                      </small>
                    </label>
                    <input type="datetime-local" className="form-control"
                      min={minDateTime}
                      value={form.expiryDate}
                      onChange={e => setForm({...form, expiryDate: e.target.value})} />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3"
                      placeholder="Job description..."
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})} />
                  </div>

                  {/* ✅ Company Address */}
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      📍 Company Address
                      <small className="text-muted ms-2">
                        (Used for offline interviews — auto fills when creating slot)
                      </small>
                    </label>
                    <textarea className="form-control" rows="2"
                      placeholder="e.g. 3rd Floor, Tech Park, Madhapur, Hyderabad - 500081"
                      value={form.address}
                      onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Create Job</button>
              </form>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="card">
          <div className="card-header fw-semibold">
            All Jobs ({filtered.length})
          </div>
          <div className="card-body">
            {loading ? (
              <Spinner message="Loading jobs..." />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon="💼"
                title="No jobs found"
                message={search || statusFilter !== 'ALL'
                  ? 'Try changing your search or filter'
                  : 'No jobs have been added yet'}
              />
            ) : (
              <div className="row">
                {filtered.map(job => (
                  <div key={job.id} className="col-md-4 mb-3">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title fw-bold mb-0">{job.title}</h6>
                          <div className="d-flex flex-column gap-1 align-items-end">
                            <span className={`badge bg-${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                            {/* ✅ Show expired badge */}
                            {isExpired(job) && (
                              <span className="badge bg-danger">EXPIRED</span>
                            )}
                            {/* ✅ Show full badge */}
                            {isFull(job) && (
                              <span className="badge bg-secondary">FULL</span>
                            )}
                          </div>
                        </div>
                        <p className="text-muted small mb-1">🏢 {job.department}</p>
                        <p className="text-muted small mb-1">📍 {job.location}</p>

                        {/* ✅ Show bookings progress */}
                        {job.maxCandidates && (
                          <p className="text-muted small mb-1">
                            👥 {job.bookingCount || 0}/{job.maxCandidates} candidates
                          </p>
                        )}

                        {/* ✅ Show expiry date */}
                        {job.expiryDate && (
                          <p className="text-muted small mb-1">
                            📅 Expires: {new Date(job.expiryDate).toLocaleDateString()}
                          </p>
                        )}

                        {/* ✅ Show address */}
                        {job.address && (
                          <p className="text-muted small mb-1">
                            🏠 {job.address}
                          </p>
                        )}
                        <p className="card-text small text-truncate">
                          {job.description || 'No description'}
                        </p>
                      </div>
                      {(user?.role === 'ADMIN' || user?.role === 'HR') && (
                        <div className="card-footer bg-transparent">
                          <button className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(job.id)}>
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobList