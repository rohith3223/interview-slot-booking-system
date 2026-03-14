import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import api from '../services/api'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'HR'
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', form)
      toast.success(`${form.role} account created successfully!`)
      setShowForm(false)
      setForm({ name: '', email: '', password: '', role: 'HR' })
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deleted!')
      fetchUsers()
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const getRoleBadge = (role) => {
    if (role === 'ADMIN') return 'danger'
    if (role === 'HR') return 'warning'
    if (role === 'INTERVIEWER') return 'info'
    return 'success'
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Admin Panel" />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="text-muted mb-0">Manage all system users</h6>
          <button className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Create User'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-4">
            <div className="card-header fw-semibold">Create New User</div>
            <div className="card-body">
              <form onSubmit={handleCreate}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control"
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control"
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={form.role}
                      onChange={e => setForm({...form, role: e.target.value})}>
                      <option value="HR">HR</option>
                      <option value="INTERVIEWER">Interviewer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Create User</button>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header fw-semibold">All Users ({users.length})</div>
          <div className="card-body">
            {loading ? (
              <Spinner message="Loading users..." />
            ) : users.length === 0 ? (
              <EmptyState icon="👥" title="No users found" message="Create your first user above" />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id}>
                        <td>{i + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge bg-${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          {u.role !== 'ADMIN' && (
                            <button className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(u.id)}>
                              🗑 Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel