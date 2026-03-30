import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{ padding: '1rem', background: '#1e293b', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
        🚗 VehicleReg
      </Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
        {isAuthenticated && (
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
            Dashboard
          </Link>
        )}
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ color: 'white', background: 'none', border: '1px solid white', padding: '0.25rem 0.75rem', cursor: 'pointer', borderRadius: '4px' }}>
            Logout
          </button>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}