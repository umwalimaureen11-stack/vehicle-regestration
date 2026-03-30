import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAllVehicles } from '../services/api'

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getAllVehicles,
  })

  const vehicles = data?.data ?? []

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Registered Vehicles</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Public list of all registered vehicles
        </p>
      </div>

      {isLoading && <p>Loading vehicles...</p>}
      {isError && <p style={{ color: 'red' }}>Failed to load vehicles.</p>}

      {!isLoading && !isError && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>All Vehicles ({vehicles.length})</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Manufacture', 'Model', 'Year', 'Type', 'Fuel', 'Status', 'Details'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No vehicles registered yet.
                  </td>
                </tr>
              ) : vehicles.map((v) => (
                <tr key={v.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.manufacture}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.model}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.year}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.vehicleType}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.fuelType}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                      background: v.status === 'NEW' ? '#dcfce7' : v.status === 'USED' ? '#fef9c3' : '#fee2e2',
                      color: v.status === 'NEW' ? '#166534' : v.status === 'USED' ? '#854d0e' : '#991b1b'
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <Link to={`/vehicle/${v.id}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}