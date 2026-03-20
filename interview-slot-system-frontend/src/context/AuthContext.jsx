/* eslint-disable */
import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null
  })

  const loginUser = (data) => {
    localStorage.setItem('token', data.token)
    // ✅ Now saving id too!
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name
    }))
    setToken(data.token)
    setUser({
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name
    })
  }

  const logoutUser = () => {
    localStorage.clear()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading: false, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}