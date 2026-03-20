/* eslint-disable */
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import InterviewTable from '../components/InterviewTable'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { completeInterview } from '../services/slotService'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

const InterviewSchedule = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchInterviews = async () => {
    setLoading(true)
    try {
      let data = []

      // ✅ Get user from localStorage directly
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = stored.id

      if (user?.role === 'CANDIDATE') {
        const res = await api.get(`/interviews/candidate/${userId}`)
        data = res.data
      } else if (user?.role === 'INTERVIEWER') {
        const res = await api.get(`/interviews/interviewer/${userId}`)
        data = res.data
      } else {
        const res = await api.get('/interviews')
        data = res.data
      }
      setInterviews(data)
    } catch {
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInterviews() }, [])

  const handleComplete = async (id) => {
    try {
      await completeInterview(id)
      toast.success('Interview marked as completed!')
      fetchInterviews()
    } catch {
      toast.error('Failed to complete interview')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return
    try {
      await api.patch(`/interviews/${id}/cancel`)
      toast.success('Interview cancelled successfully!')
      fetchInterviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel interview')
    }
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Interview Schedule" />
        <div className="card">
          <div className="card-header fw-semibold">
            All Interviews ({interviews.length})
          </div>
          <div className="card-body">
            {loading ? (
              <Spinner message="Loading interviews..." />
            ) : interviews.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No interviews found"
                message="No interviews scheduled yet."
              />
            ) : (
              <InterviewTable
                interviews={interviews}
                onComplete={handleComplete}
                onCancel={handleCancel}
                userRole={user?.role}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewSchedule