/* eslint-disable */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register } from '../services/authService'
import useAuth from '../hooks/useAuth'

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'CANDIDATE'
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await register(form)
      loginUser(data)
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h2>🎯 Interview System</h2>
          <p className="text-muted">Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            {/* ✅ Show/Hide Password */}
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                name="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {/* ✅ Password strength indicator */}
            {form.password && (
              <div className="mt-1">
                <small className={`
                  ${form.password.length < 6 ? 'text-danger' :
                    form.password.length < 8 ? 'text-warning' :
                    'text-success'}`}>
                  {form.password.length < 6 ? '❌ Too short (min 6 characters)' :
                   form.password.length < 8 ? '⚠️ Weak password' :
                   '✅ Strong password'}
                </small>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Registering As</label>
            <input
              className="form-control"
              value="Candidate"
              disabled
              style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
            />
            <small className="text-muted mt-1 d-block">
              🔒 Only candidates can self-register. HR & Interviewer accounts are created by Admin.
            </small>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Sign in here
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}

export default Register