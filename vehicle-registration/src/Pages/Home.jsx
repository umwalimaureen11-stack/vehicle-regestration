import { useQuery } from '@tanstack/react-query'
import { getAllVehicles } from '../services/api'

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getAllVehicles,
  })

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading vehicles...</p>
  if (isError) return <p style={{ padding: '2rem', color: 'red' }}>Failed to load vehicles.</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Registered Vehicles</h2>
      <p>{data?.data?.length ?? 0} vehicles found</p>
      <pre>{JSON.stringify(data?.data, null, 2)}</pre>
    </div>
  )
}