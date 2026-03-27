/* eslint-disable */
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

const Feedback = () => {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    interviewId: '', comments: '', rating: 5,
    decision: 'SELECTED'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'HR') {
      api.get('/interviews/feedback')
        .then(r => setFeedbacks(r.data))
        .catch(() => toast.error('Failed to load feedbacks'))
        .finally(() => setLoading(false))
    } else {
      const endpoint = user?.role === 'CANDIDATE'
        ? `/interviews/candidate/${user.id}`
        : `/interviews/interviewer/${user.id}`
      api.get(endpoint)
        .then(r => {
          if (user?.role === 'CANDIDATE') {
            // ✅ Fixed: only COMPLETED interviews allowed for feedback
            setInterviews(r.data.filter(i => i.status === 'COMPLETED'))
          } else {
            setInterviews(r.data.filter(i => i.status === 'COMPLETED'))
          }
        })
        .catch(() => toast.error('Failed to load interviews'))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const feedbackType = user?.role === 'CANDIDATE'
        ? 'CANDIDATE' : 'INTERVIEWER'

      await api.post('/interviews/feedback', {
        ...form,
        interviewId: parseInt(form.interviewId),
        rating: parseInt(form.rating),
        feedbackType: feedbackType
      })
      toast.success('Feedback submitted successfully!')
      setForm({
        interviewId: '', comments: '', rating: 5,
        decision: 'SELECTED'
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const getDecisionBadge = (decision) => {
    if (decision === 'SELECTED') return 'success'
    if (decision === 'REJECTED') return 'danger'
    if (decision === 'ON_HOLD') return 'warning'
    if (decision === 'NEXT_ROUND') return 'info'
    return 'secondary'
  }

  const getRatingStars = (rating) => '⭐'.repeat(rating)

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Feedback" />

        {/* CANDIDATE */}
        {user?.role === 'CANDIDATE' && (
          <div className="card">
            <div className="card-header fw-semibold">
              💬 Share Your Interview Experience
            </div>
            <div className="card-body">
              {loading ? (
                <Spinner message="Loading your interviews..." />
              ) : interviews.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="No completed interviews"
                  message="You can only give feedback after your interview is completed."
                />
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Select Your Interview
                    </label>
                    <select className="form-select"
                      value={form.interviewId}
                      onChange={e => setForm({...form, interviewId: e.target.value})}
                      required>
                      <option value="">-- Select Interview --</option>
                      {interviews.map(i => (
                        <option key={i.id} value={i.id}>
                          Interview #{i.id} — {i.status} —{' '}
                          {new Date(i.bookedAt).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Your Experience
                    </label>
                    <textarea className="form-control" rows="4"
                      placeholder="Share your interview experience..."
                      value={form.comments}
                      onChange={e => setForm({...form, comments: e.target.value})}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Rate Your Experience (1-5)
                    </label>
                    <input type="number" className="form-control"
                      min="1" max="5"
                      value={form.rating}
                      onChange={e => setForm({...form, rating: e.target.value})}
                      required />
                    <small className="text-muted">1 = Very Poor, 5 = Excellent</small>
                  </div>
                  <button type="submit" className="btn btn-primary"
                    disabled={submitting}>
                    {submitting ? 'Submitting...' : '💬 Submit Feedback'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* INTERVIEWER */}
        {user?.role === 'INTERVIEWER' && (
          <div className="card">
            <div className="card-header fw-semibold">
              📝 Submit Candidate Feedback
            </div>
            <div className="card-body">
              {loading ? (
                <Spinner message="Loading interviews..." />
              ) : interviews.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="No completed interviews"
                  message="You have no completed interviews to give feedback for yet."
                />
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Select Interview
                    </label>
                    <select className="form-select"
                      value={form.interviewId}
                      onChange={e => setForm({...form, interviewId: e.target.value})}
                      required>
                      <option value="">-- Select Completed Interview --</option>
                      {interviews.map(i => (
                        <option key={i.id} value={i.id}>
                          Interview #{i.id} —{' '}
                          {new Date(i.bookedAt).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Comments</label>
                    <textarea className="form-control" rows="4"
                      placeholder="Write your feedback about the candidate..."
                      value={form.comments}
                      onChange={e => setForm({...form, comments: e.target.value})}
                      required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Rating (1-5)</label>
                      <input type="number" className="form-control"
                        min="1" max="5"
                        value={form.rating}
                        onChange={e => setForm({...form, rating: e.target.value})}
                        required />
                      <small className="text-muted">1 = Poor, 5 = Excellent</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Decision</label>
                      <select className="form-select" value={form.decision}
                        onChange={e => setForm({...form, decision: e.target.value})}>
                        <option value="SELECTED">✅ Selected</option>
                        <option value="REJECTED">❌ Rejected</option>
                        <option value="ON_HOLD">⏸ On Hold</option>
                        <option value="NEXT_ROUND">➡️ Next Round</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary"
                    disabled={submitting}>
                    {submitting ? 'Submitting...' : '📝 Submit Feedback'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ADMIN / HR */}
        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <div className="card">
            <div className="card-header fw-semibold">
              📊 All Feedbacks ({feedbacks.length})
            </div>
            <div className="card-body">
              {loading ? (
                <Spinner message="Loading feedbacks..." />
              ) : feedbacks.length === 0 ? (
                <EmptyState
                  icon="📭"
                  title="No feedbacks yet"
                  message="No feedbacks have been submitted yet."
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Interview ID</th>
                        <th>Given By</th>
                        <th>Rating</th>
                        <th>Decision</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((fb, index) => (
                        <tr key={fb.id}>
                          <td>{index + 1}</td>
                          {/* ✅ Fixed: interviewId now comes from backend getter */}
                          <td>Interview #{fb.interviewId}</td>
                          <td>
                            <span className={`badge ${
                              fb.feedbackType === 'CANDIDATE'
                                ? 'bg-success' : 'bg-primary'
                            }`}>
                              {fb.feedbackType === 'CANDIDATE'
                                ? '👤 Candidate' : '🎙️ Interviewer'}
                            </span>
                          </td>
                          <td>{getRatingStars(fb.rating)} ({fb.rating}/5)</td>
                          <td>
                            {fb.feedbackType === 'INTERVIEWER' ? (
                              <span className={`badge bg-${getDecisionBadge(fb.decision)}`}>
                                {fb.decision}
                              </span>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td>{fb.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Feedback