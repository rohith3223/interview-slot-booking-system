import useAuth from '../hooks/useAuth'

const Navbar = ({ title }) => {
  const { user } = useAuth()
  return (
    <div className="navbar-top d-flex justify-content-between align-items-center">
      <h5 className="mb-0 fw-bold">{title}</h5>
      <div className="text-muted">Welcome, <strong>{user?.name}</strong></div>
    </div>
  )
}

export default Navbar