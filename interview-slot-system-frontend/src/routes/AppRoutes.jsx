import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import JobList from '../pages/JobList'
import SlotBooking from '../pages/SlotBooking'
import InterviewSchedule from '../pages/InterviewSchedule'
import Feedback from '../pages/Feedback'
import Reports from '../pages/Reports'
import AdminPanel from '../pages/AdminPanel'
import ProtectedRoute from '../components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Home landing page instead of redirect to login */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
      <Route path="/slots" element={<ProtectedRoute><SlotBooking /></ProtectedRoute>} />
      <Route path="/interviews" element={<ProtectedRoute><InterviewSchedule /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute roles={['ADMIN', 'HR']}><Reports /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminPanel /></ProtectedRoute>} />
    </Routes>
  )
}

export default AppRoutes
