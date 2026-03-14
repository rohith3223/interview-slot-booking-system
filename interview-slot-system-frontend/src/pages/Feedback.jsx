import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { submitFeedback } from '../services/slotService'
import api from '../services/api'

const Feedback = () => {
  const [interviews, setInterviews] = useState([])
  const [form, setForm] = useState({
    interviewId: '', comments: '', rating: 5, decision: 'SELECTED'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/interviews').then(r => setInterviews(r.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitFeedback({...form, interviewId: parseInt(form.interviewId), rating: parseInt(form.rating)})
      toast.success('Feedback submitted successfully!')
      setForm({ interviewId: '', comments: '', rating: 5, decision: 'SELECTED' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Submit Feedback" />
        <div className="card">
          <div className="card-header">Interview Feedback</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select Interview</label>
                <select className="form-select" value={form.interviewId}
                  onChange={e => setForm({...form, interviewId: e.target.value})} required>
                  <option value="">Select Interview</option>
                  {interviews.filter(i => i.status === 'COMPLETED').map(i => (
                    <option key={i.id} value={i.id}>Interview #{i.id} — {i.status}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comments</label>
                <textarea className="form-control" rows="4"
                  placeholder="Write your feedback here..."
                  value={form.comments}
                  onChange={e => setForm({...form, comments: e.target.value})} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Rating (1-5)</label>
                  <input type="number" className="form-control" min="1" max="5"
                    value={form.rating}
                    onChange={e => setForm({...form, rating: e.target.value})} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Decision</label>
                  <select className="form-select" value={form.decision}
                    onChange={e => setForm({...form, decision: e.target.value})}>
                    <option value="SELECTED">Selected</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="NEXT_ROUND">Next Round</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : '📝 Submit Feedback'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback