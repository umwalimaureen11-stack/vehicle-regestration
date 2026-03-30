import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAllVehicles } from '../services/api'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getAllVehicles,
  })

  const vehicles = data?.data ?? []

  const stats = {
    total: vehicles.length,
    electric: vehicles.filter(v => v.fuelType === 'ELECTRIC').length,
    new: vehicles.filter(v => v.status === 'NEW').length,
    commercial: vehicles.filter(v => v.purpose === 'COMMERCIAL').length,
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <Link to="/vehicle/new" style={{ padding: '0.75rem 1.5rem', background: '#1e293b', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
          + Register Vehicle
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Vehicles', value: stats.total, color: '#3b82f6' },
          { label: 'Electric', value: stats.electric, color: '#10b981' },
          { label: 'New Vehicles', value: stats.new, color: '#f59e0b' },
          { label: 'Commercial', value: stats.commercial, color: '#ef4444' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `4px solid ${stat.color}` }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>
              {isLoading ? '...' : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Vehicles Table */}
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3>Recent Vehicles</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Manufacture', 'Model', 'Year', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : vehicles.slice(0, 10).map((v) => (
              <tr key={v.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem 1rem' }}>{v.manufacture}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{v.model}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{v.year}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                    background: v.status === 'NEW' ? '#dcfce7' : v.status === 'USED' ? '#fef9c3' : '#fee2e2',
                    color: v.status === 'NEW' ? '#166534' : v.status === 'USED' ? '#854d0e' : '#991b1b' }}>
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Link to={`/vehicle/${v.id}`} style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '1rem' }}>View</Link>
                  <Link to={`/vehicle/${v.id}/edit`} style={{ color: '#f59e0b', textDecoration: 'none' }}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}