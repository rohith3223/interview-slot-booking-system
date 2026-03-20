/* eslint-disable */
import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'

const Navbar = ({ title }) => {
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true'
    setDarkMode(saved)
    if (saved) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [])

  const toggleDark = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    if (newMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  return (
    <div className="navbar-top d-flex justify-content-between align-items-center px-4 py-3 mb-4">
      <h5 className="mb-0 fw-bold">{title}</h5>
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={toggleDark}
          title="Toggle Dark Mode"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="text-muted">
          Welcome, <strong>{user?.name}</strong>
        </div>
      </div>
    </div>
  )
}

export default Navbar