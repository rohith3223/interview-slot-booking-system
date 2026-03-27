/* eslint-disable */
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SlotCard from '../components/SlotCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { getAvailableSlots, getSlotsByJob, createSlot, bookSlot } from '../services/slotService'
import { getAllJobs } from '../services/jobService'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

const SlotBooking = () => {
  const [slots, setSlots] = useState([])
  const [jobs, setJobs] = useState([])
  const [interviewers, setInterviewers] = useState([])
  const [jobFilter, setJobFilter] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    jobId: '', interviewerId: '', startTime: '', endTime: '',
    interviewMode: 'ONLINE', modeDetails: ''
  })
  const { user } = useAuth()

  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  const minDateTime = now.toISOString().slice(0, 16)

  const fetchSlots = async (jobId = '') => {
    setLoading(true)
    try {
      const data = jobId ? await getSlotsByJob(jobId) : await getAvailableSlots()
      setSlots(data)
    } catch {
      toast.error('Failed to load slots')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
    getAllJobs().then(setJobs).catch(() => {})
    api.get('/users/interviewers').then(r => setInterviewers(r.data)).catch(() => {})
  }, [])

  const handleBook = async () => {
    if (!selectedSlot) { toast.warning('Please select a slot!'); return }
    const jobId = selectedSlot.job?.id
    if (!jobId) { toast.warning('This slot has no job linked!'); return }
    try {
      await bookSlot({ slotId: selectedSlot.id, jobId: jobId })
      toast.success('Slot booked successfully!')
      setSelectedSlot(null)
      fetchSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed!')
    }
  }

  const handleCreateSlot = async (e) => {
    e.preventDefault()
    if (!form.modeDetails) {
      toast.warning(form.interviewMode === 'ONLINE' ? 'Please enter meeting link!' : 'Please enter venue address!')
      return
    }
    try {
      await createSlot({
        jobId: parseInt(form.jobId),
        interviewerId: parseInt(form.interviewerId),
        startTime: form.startTime,
        endTime: form.endTime,
        interviewMode: form.interviewMode,
        modeDetails: form.modeDetails
      })
      toast.success('Slot created successfully!')
      setShowForm(false)
      setForm({ jobId: '', interviewerId: '', startTime: '', endTime: '', interviewMode: 'ONLINE', modeDetails: '' })
      fetchSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create slot!')
    }
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title={user?.role === 'CANDIDATE' ? 'Book Interview Slot' : 'Manage Slots'} />

        {(user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'INTERVIEWER') && (
          <div className="mb-3">
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Create Slot'}
            </button>
          </div>
        )}

        {showForm && (
          <div className="card mb-4">
            <div className="card-header fw-semibold">Create New Slot</div>
            <div className="card-body">
              <form onSubmit={handleCreateSlot}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Job</label>
                    <select className="form-select" value={form.jobId}
                      onChange={e => {
                        const selectedJob = jobs.find(j => j.id === parseInt(e.target.value))
                        setForm({
                          ...form,
                          jobId: e.target.value,
                          modeDetails: form.interviewMode === 'OFFLINE'
                            ? (selectedJob?.address || form.modeDetails)
                            : form.modeDetails
                        })
                      }} required>
                      <option value="">Select Job</option>
                      {jobs.map(j => (
                        <option key={j.id} value={j.id}>{j.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Interviewer</label>
                    <select className="form-select" value={form.interviewerId}
                      onChange={e => setForm({...form, interviewerId: e.target.value})} required>
                      <option value="">Select Interviewer</option>
                      {interviewers.map(i => (
                        <option key={i.id} value={i.id}>{i.name} ({i.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Time</label>
                    <input type="datetime-local" className="form-control"
                      value={form.startTime} min={minDateTime}
                      onChange={e => setForm({...form, startTime: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Time</label>
                    <input type="datetime-local" className="form-control"
                      value={form.endTime} min={minDateTime}
                      onChange={e => setForm({...form, endTime: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Interview Mode</label>
                    <select className="form-select" value={form.interviewMode}
                      onChange={e => {
                        const mode = e.target.value
                        const selectedJob = jobs.find(j => j.id === parseInt(form.jobId))
                        setForm({
                          ...form,
                          interviewMode: mode,
                          modeDetails: mode === 'OFFLINE' ? (selectedJob?.address || '') : ''
                        })
                      }}>
                      <option value="ONLINE">🖥️ Online</option>
                      <option value="OFFLINE">🏢 Offline</option>
                    </select>
                  </div>
                  {form.interviewMode === 'ONLINE' && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label">🔗 Meeting Link</label>
                      <input type="url" className="form-control"
                        placeholder="e.g. https://meet.google.com/abc-xyz"
                        value={form.modeDetails}
                        onChange={e => setForm({...form, modeDetails: e.target.value})} required />
                      <small className="text-muted">Google Meet, Zoom, or Teams link</small>
                    </div>
                  )}
                  {form.interviewMode === 'OFFLINE' && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label">📍 Venue Address</label>
                      <textarea className="form-control" rows="2"
                        placeholder="e.g. 3rd Floor, Tech Park, Hyderabad - 500081"
                        value={form.modeDetails}
                        onChange={e => setForm({...form, modeDetails: e.target.value})} required />
                      <small className="text-muted">Auto filled from job address — you can edit if needed</small>
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Create Slot</button>
              </form>
            </div>
          </div>
        )}

        <div className="row mb-3 align-items-center">
          <div className="col-md-4">
            <select className="form-select" value={jobFilter}
              onChange={e => {
                setJobFilter(e.target.value)
                fetchSlots(e.target.value)
                setSelectedSlot(null)
              }}>
              <option value="">🔍 All Jobs</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <div className="card-header fw-semibold">Available Slots ({slots.length})</div>
          <div className="card-body">
            {loading ? (
              <Spinner message="Loading slots..." />
            ) : slots.length === 0 ? (
              <EmptyState icon="🕐" title="No available slots" message="No interview slots are available right now." />
            ) : (
              slots.map(slot => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  selected={selectedSlot?.id === slot.id}
                  onSelect={user?.role === 'CANDIDATE' ? setSelectedSlot : null}
                />
              ))
            )}
          </div>
        </div>

        {user?.role === 'CANDIDATE' && selectedSlot && (
          <div className="card mt-3">
            <div className="card-header fw-semibold">✅ Confirm Booking</div>
            <div className="card-body">
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-1"><strong>🕐 Slot:</strong> {new Date(selectedSlot.startTime).toLocaleString()} → {new Date(selectedSlot.endTime).toLocaleString()}</p>
                <p className="mb-1"><strong>💼 Job:</strong> {selectedSlot.job?.title || 'N/A'}</p>
                <p className="mb-1"><strong>👤 Interviewer:</strong> {selectedSlot.interviewer?.name || 'N/A'}</p>
                <p className="mb-1"><strong>📋 Mode:</strong>{' '}
                  {selectedSlot.interviewMode === 'ONLINE'
                    ? <span className="badge bg-info">🖥️ Online</span>
                    : <span className="badge bg-warning text-dark">🏢 Offline</span>}
                </p>
                {selectedSlot.modeDetails && (
                  <p className="mb-0">
                    <strong>{selectedSlot.interviewMode === 'ONLINE' ? '🔗 Link:' : '📍 Venue:'}</strong>{' '}
                    {selectedSlot.interviewMode === 'ONLINE'
                      ? <a href={selectedSlot.modeDetails} target="_blank" rel="noreferrer" className="text-primary">{selectedSlot.modeDetails}</a>
                      : <span>{selectedSlot.modeDetails}</span>}
                  </p>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={handleBook}>✅ Confirm Booking</button>
                <button className="btn btn-outline-secondary" onClick={() => setSelectedSlot(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlotBooking