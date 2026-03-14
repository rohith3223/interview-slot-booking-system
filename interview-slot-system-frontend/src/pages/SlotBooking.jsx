/* eslint-disable */
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SlotCard from '../components/SlotCard'
import { getAvailableSlots, createSlot, bookSlot } from '../services/slotService'
import { getAllJobs } from '../services/jobService'
import useAuth from '../hooks/useAuth'

const SlotBooking = () => {
  const [slots, setSlots] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedJob, setSelectedJob] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    jobId: '', interviewerId: '', startTime: '', endTime: ''
  })
  const { user } = useAuth()

  const fetchSlots = async () => {
    try {
      const data = await getAvailableSlots()
      setSlots(data)
    } catch {
      toast.error('Failed to load slots')
    }
  }

  useEffect(() => {
    fetchSlots()
    getAllJobs().then(setJobs).catch(() => {})
  }, [])

  const handleBook = async () => {
    if (!selectedSlot || !selectedJob) {
      toast.warning('Please select a slot and job!')
      return
    }
    try {
      await bookSlot({ slotId: selectedSlot.id, jobId: parseInt(selectedJob) })
      toast.success('Slot booked successfully!')
      setSelectedSlot(null)
      setSelectedJob('')
      fetchSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed!')
    }
  }

  const handleCreateSlot = async (e) => {
    e.preventDefault()
    try {
      await createSlot({
        ...form,
        jobId: parseInt(form.jobId),
        interviewerId: parseInt(form.interviewerId)
      })
      toast.success('Slot created successfully!')
      setShowForm(false)
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
            <div className="card-header">Create New Slot</div>
            <div className="card-body">
              <form onSubmit={handleCreateSlot}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Job</label>
                    <select className="form-select" value={form.jobId}
                      onChange={e => setForm({...form, jobId: e.target.value})} required>
                      <option value="">Select Job</option>
                      {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Interviewer ID</label>
                    <input type="number" className="form-control" placeholder="Enter interviewer ID"
                      value={form.interviewerId}
                      onChange={e => setForm({...form, interviewerId: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Time</label>
                    <input type="datetime-local" className="form-control"
                      value={form.startTime}
                      onChange={e => setForm({...form, startTime: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Time</label>
                    <input type="datetime-local" className="form-control"
                      value={form.endTime}
                      onChange={e => setForm({...form, endTime: e.target.value})} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Create Slot</button>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">Available Slots ({slots.length})</div>
          <div className="card-body">
            {slots.length === 0 ? (
              <div className="text-center text-muted py-3">No available slots.</div>
            ) : (
              slots.map(slot => (
                <SlotCard key={slot.id} slot={slot}
                  selected={selectedSlot?.id === slot.id}
                  onSelect={user?.role === 'CANDIDATE' ? setSelectedSlot : null} />
              ))
            )}
          </div>
        </div>

        {user?.role === 'CANDIDATE' && selectedSlot && (
          <div className="card">
            <div className="card-header">Confirm Booking</div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Select Job</label>
                <select className="form-select" value={selectedJob}
                  onChange={e => setSelectedJob(e.target.value)}>
                  <option value="">Select a job</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <button className="btn btn-success" onClick={handleBook}>
                ✅ Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlotBooking