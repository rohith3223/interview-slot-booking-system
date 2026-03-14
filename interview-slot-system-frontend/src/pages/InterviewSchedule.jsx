import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import InterviewTable from '../components/InterviewTable'
import { getMyInterviews, completeInterview } from '../services/slotService'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

const InterviewSchedule = () => {
  const [interviews, setInterviews] = useState([])
  const { user } = useAuth()

  const fetchInterviews = async () => {
    try {
      let data = []
      if (user?.role === 'CANDIDATE') {
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        const res = await api.get(`/interviews/candidate/${stored.id || 3}`)
        data = res.data
      } else if (user?.role === 'INTERVIEWER') {
        const res = await api.get(`/interviews/interviewer/2`)
        data = res.data
      } else {
        const res = await api.get('/interviews')
        data = res.data
      }
      setInterviews(data)
    } catch {
      toast.error('Failed to load interviews')
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

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Interview Schedule" />
        <div className="card">
          <div className="card-header">All Interviews ({interviews.length})</div>
          <div className="card-body">
            <InterviewTable
              interviews={interviews}
              onComplete={handleComplete}
              userRole={user?.role}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewSchedule