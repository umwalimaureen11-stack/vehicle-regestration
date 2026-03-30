import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getVehicleInfo,
  getVehicleOwner,
  getVehicleRegistration,
  getVehicleInsurance,
  deleteVehicle,
} from '../services/api'

const tabs = ['Info', 'Owner', 'Registration', 'Insurance']

function InfoTab({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-info', id],
    queryFn: () => getVehicleInfo(id),
  })
  if (isLoading) return <p>Loading...</p>
  const v = data?.data
  if (!v) return <p>No data found.</p>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {[
        ['Manufacture', v.manufacture],
        ['Model', v.model],
        ['Year', v.year],
        ['Color', v.color],
        ['Body Type', v.bodyType],
        ['Vehicle Type', v.vehicleType],
        ['Fuel Type', v.fuelType],
        ['Engine Capacity', v.engineCapacity],
        ['Odometer Reading', v.odometerReading],
        ['Seating Capacity', v.seatingCapacity],
        ['Purpose', v.purpose],
        ['Status', v.status],
      ].map(([label, value]) => (
        <div key={label} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ fontWeight: '500' }}>{value ?? '—'}</p>
        </div>
      ))}
    </div>
  )
}

function OwnerTab({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-owner', id],
    queryFn: () => getVehicleOwner(id),
  })
  if (isLoading) return <p>Loading...</p>
  const o = data?.data
  if (!o) return <p>No data found.</p>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {[
        ['Owner Name', o.ownerName],
        ['Owner Type', o.ownerType],
        ['National ID', o.nationalId],
        ['Mobile Number', o.mobileNumber],
        ['Email', o.email],
        ['Address', o.address],
        ['Company Reg Number', o.companyRegNumber],
        ['Passport Number', o.passportNumber],
      ].map(([label, value]) => (
        <div key={label} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ fontWeight: '500' }}>{value ?? '—'}</p>
        </div>
      ))}
    </div>
  )
}

function RegistrationTab({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-registration', id],
    queryFn: () => getVehicleRegistration(id),
  })
  if (isLoading) return <p>Loading...</p>
  const r = data?.data
  if (!r) return <p>No data found.</p>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {[
        ['Plate Number', r.plateNumber],
        ['Plate Type', r.plateType],
        ['Registration Date', r.registrationDate],
        ['Expiry Date', r.expiryDate],
        ['Status', r.registrationStatus],
        ['Proof of Ownership', r.proofOfOwnership],
        ['Customs Ref', r.customsRef],
        ['Roadworthy Cert', r.roadworthyCert],
      ].map(([label, value]) => (
        <div key={label} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ fontWeight: '500' }}>{value ?? '—'}</p>
        </div>
      ))}
    </div>
  )
}

function InsuranceTab({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-insurance', id],
    queryFn: () => getVehicleInsurance(id),
  })
  if (isLoading) return <p>Loading...</p>
  const i = data?.data
  if (!i) return <p>No data found.</p>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {[
        ['Policy Number', i.policyNumber],
        ['Company Name', i.companyName],
        ['Insurance Type', i.insuranceType],
        ['Expiry Date', i.insuranceExpiryDate],
        ['Status', i.insuranceStatus],
      ].map(([label, value]) => (
        <div key={label} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ fontWeight: '500' }}>{value ?? '—'}</p>
        </div>
      ))}
    </div>
  )
}

export default function VehicleDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      navigate('/')
    },
    onError: () => alert('Failed to delete vehicle.'),
  })

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to list
          </Link>
          <h2 style={{ marginTop: '0.5rem' }}>Vehicle Details</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/vehicle/${id}/edit`} style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
            Edit
          </Link>
          <button onClick={() => setShowConfirm(true)}
            style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{
              padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontWeight: i === activeTab ? 'bold' : 'normal',
              background: 'none', borderBottom: i === activeTab ? '2px solid #1e293b' : '2px solid transparent',
              color: i === activeTab ? '#1e293b' : '#64748b', marginBottom: '-2px'
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {activeTab === 0 && <InfoTab id={id} />}
        {activeTab === 1 && <OwnerTab id={id} />}
        {activeTab === 2 && <RegistrationTab id={id} />}
        {activeTab === 3 && <InsuranceTab id={id} />}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Confirm Delete</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirm(false)}
                style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}
                style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}