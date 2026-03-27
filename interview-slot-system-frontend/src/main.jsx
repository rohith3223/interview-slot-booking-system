import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './styles/global.css'
import App from './App.jsx'

// ✅ Apply saved dark mode before React renders (prevents flash on Login/Register)
const savedDarkMode = localStorage.getItem('darkMode') === 'true'
if (savedDarkMode) {
  document.body.classList.add('dark-mode')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)