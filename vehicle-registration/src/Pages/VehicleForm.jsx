import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createVehicle } from '../services/api'

// ─── Zod Schemas ─────────────────────────────────────────────────

const step1Schema = z.object({
  manufacture: z.string().min(1, 'Manufacture is required').trim(),
  model: z.string().min(1, 'Model is required').trim(),
  year: z.coerce.number()
    .int()
    .min(1886, 'Year must be 1886 or later')
    .max(new Date().getFullYear() + 1, 'Year is too far in the future'),
  vehicleType: z.enum(['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER']),
  bodyType: z.string().min(1, 'Body type is required').trim(),
  color: z.string().min(1, 'Color is required').trim(),
  engineCapacity: z.coerce.number().int().min(1, 'Engine capacity must be greater than 0'),
  odometerReading: z.coerce.number().int().min(0, 'Odometer must be 0 or greater'),
  seatingCapacity: z.coerce.number().int().min(1, 'Seating capacity must be at least 1'),
  purpose: z.enum(['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT']),
  status: z.enum(['NEW', 'USED', 'REBUILT']),
})

const step2Schema = z.object({
  ownerName: z.string().min(1, 'Owner name is required').trim(),
  ownerType: z.enum(['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT']),
  nationalId: z.string().regex(/^\d{16}$/, 'National ID must be exactly 16 digits'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  email: z.string().email('Must be a valid email address'),
  address: z.string().min(1, 'Address is required').trim(),
  companyRegNumber: z.string().optional(),
  passportNumber: z.string().optional(),
}).refine((data) => {
  if (data.ownerType === 'COMPANY' && !data.companyRegNumber) {
    return false
  }
  return true
}, {
  message: 'Company registration number is required for COMPANY owner type',
  path: ['companyRegNumber'],
})

const step3Schema = z.object({
  plateNumber: z.string().regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i, 'Invalid Rwandan plate number'),
  plateType: z.enum(['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED']),
  registrationDate: z.string().min(1, 'Registration date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  registrationStatus: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING']),
  policyNumber: z.string().min(1, 'Policy number is required'),
  companyName: z.string().min(1, 'Insurance company name is required'),
  insuranceType: z.string().min(1, 'Insurance type is required'),
  insuranceExpiryDate: z.string().min(1, 'Insurance expiry date is required'),
  insuranceStatus: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED']),
  roadworthyCert: z.string().min(1, 'Roadworthy certificate is required'),
  customsRef: z.string().min(1, 'Customs reference is required'),
  proofOfOwnership: z.string().min(1, 'Proof of ownership is required'),
}).refine((data) => {
  return new Date(data.expiryDate) > new Date()
}, {
  message: 'Expiry date cannot be in the past',
  path: ['expiryDate'],
}).refine((data) => {
  return new Date(data.insuranceExpiryDate) > new Date()
}, {
  message: 'Insurance expiry date cannot be in the past',
  path: ['insuranceExpiryDate'],
})

const schemas = [step1Schema, step2Schema, step3Schema]

// ─── Input Component ──────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>{label}</label>
      {children}
      {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  )
}

const inputStyle = (error) => ({
  width: '100%',
  padding: '0.5rem',
  border: `1px solid ${error ? 'red' : '#ccc'}`,
  borderRadius: '4px',
  fontSize: '1rem',
})

const selectStyle = (error) => ({
  width: '100%',
  padding: '0.5rem',
  border: `1px solid ${error ? 'red' : '#ccc'}`,
  borderRadius: '4px',
  fontSize: '1rem',
  background: 'white',
})

// ─── Steps ────────────────────────────────────────────────────────

function Step1({ register, errors }) {
  return (
    <>
      <h3 style={{ marginBottom: '1.5rem' }}>Vehicle Information</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
        <Field label="Manufacture" error={errors.manufacture?.message}>
          <input {...register('manufacture')} style={inputStyle(errors.manufacture)} />
        </Field>
        <Field label="Model" error={errors.model?.message}>
          <input {...register('model')} style={inputStyle(errors.model)} />
        </Field>
        <Field label="Year" error={errors.year?.message}>
          <input type="number" {...register('year')} style={inputStyle(errors.year)} />
        </Field>
        <Field label="Color" error={errors.color?.message}>
          <input {...register('color')} style={inputStyle(errors.color)} />
        </Field>
        <Field label="Body Type" error={errors.bodyType?.message}>
          <input {...register('bodyType')} style={inputStyle(errors.bodyType)} />
        </Field>
        <Field label="Engine Capacity (cc)" error={errors.engineCapacity?.message}>
          <input type="number" {...register('engineCapacity')} style={inputStyle(errors.engineCapacity)} />
        </Field>
        <Field label="Odometer Reading (km)" error={errors.odometerReading?.message}>
          <input type="number" {...register('odometerReading')} style={inputStyle(errors.odometerReading)} />
        </Field>
        <Field label="Seating Capacity" error={errors.seatingCapacity?.message}>
          <input type="number" {...register('seatingCapacity')} style={inputStyle(errors.seatingCapacity)} />
        </Field>
        <Field label="Vehicle Type" error={errors.vehicleType?.message}>
          <select {...register('vehicleType')} style={selectStyle(errors.vehicleType)}>
            <option value="">Select...</option>
            {['ELECTRIC','SUV','TRUCK','MOTORCYCLE','BUS','VAN','PICKUP','OTHER'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Fuel Type" error={errors.fuelType?.message}>
          <select {...register('fuelType')} style={selectStyle(errors.fuelType)}>
            <option value="">Select...</option>
            {['PETROL','DIESEL','ELECTRIC','HYBRID','GAS','OTHER'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Purpose" error={errors.purpose?.message}>
          <select {...register('purpose')} style={selectStyle(errors.purpose)}>
            <option value="">Select...</option>
            {['PERSONAL','COMMERCIAL','TAXI','GOVERNMENT'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select {...register('status')} style={selectStyle(errors.status)}>
            <option value="">Select...</option>
            {['NEW','USED','REBUILT'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
      </div>
    </>
  )
}

function Step2({ register, errors, watch }) {
  const ownerType = watch('ownerType')
  return (
    <>
      <h3 style={{ marginBottom: '1.5rem' }}>Owner Information</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
        <Field label="Owner Name" error={errors.ownerName?.message}>
          <input {...register('ownerName')} style={inputStyle(errors.ownerName)} />
        </Field>
        <Field label="Owner Type" error={errors.ownerType?.message}>
          <select {...register('ownerType')} style={selectStyle(errors.ownerType)}>
            <option value="">Select...</option>
            {['INDIVIDUAL','COMPANY','NGO','GOVERNMENT'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="National ID (16 digits)" error={errors.nationalId?.message}>
          <input {...register('nationalId')} style={inputStyle(errors.nationalId)} />
        </Field>
        <Field label="Mobile Number (10 digits)" error={errors.mobileNumber?.message}>
          <input {...register('mobileNumber')} style={inputStyle(errors.mobileNumber)} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register('email')} style={inputStyle(errors.email)} />
        </Field>
        <Field label="Address" error={errors.address?.message}>
          <input {...register('address')} style={inputStyle(errors.address)} />
        </Field>
        {ownerType === 'COMPANY' && (
          <Field label="Company Registration Number" error={errors.companyRegNumber?.message}>
            <input {...register('companyRegNumber')} style={inputStyle(errors.companyRegNumber)} />
          </Field>
        )}
        <Field label="Passport Number (optional)" error={errors.passportNumber?.message}>
          <input {...register('passportNumber')} style={inputStyle(errors.passportNumber)} />
        </Field>
      </div>
    </>
  )
}

function Step3({ register, errors }) {
  return (
    <>
      <h3 style={{ marginBottom: '1.5rem' }}>Registration & Insurance</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
        <Field label="Plate Number" error={errors.plateNumber?.message}>
          <input {...register('plateNumber')} placeholder="e.g. RAB 123 A" style={inputStyle(errors.plateNumber)} />
        </Field>
        <Field label="Plate Type" error={errors.plateType?.message}>
          <select {...register('plateType')} style={selectStyle(errors.plateType)}>
            <option value="">Select...</option>
            {['PRIVATE','COMMERCIAL','GOVERNMENT','DIPLOMATIC','PERSONALIZED'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Registration Date" error={errors.registrationDate?.message}>
          <input type="date" {...register('registrationDate')} style={inputStyle(errors.registrationDate)} />
        </Field>
        <Field label="Expiry Date" error={errors.expiryDate?.message}>
          <input type="date" {...register('expiryDate')} style={inputStyle(errors.expiryDate)} />
        </Field>
        <Field label="Registration Status" error={errors.registrationStatus?.message}>
          <select {...register('registrationStatus')} style={selectStyle(errors.registrationStatus)}>
            <option value="">Select...</option>
            {['ACTIVE','SUSPENDED','EXPIRED','PENDING'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Policy Number" error={errors.policyNumber?.message}>
          <input {...register('policyNumber')} style={inputStyle(errors.policyNumber)} />
        </Field>
        <Field label="Insurance Company Name" error={errors.companyName?.message}>
          <input {...register('companyName')} style={inputStyle(errors.companyName)} />
        </Field>
        <Field label="Insurance Type" error={errors.insuranceType?.message}>
          <input {...register('insuranceType')} style={inputStyle(errors.insuranceType)} />
        </Field>
        <Field label="Insurance Expiry Date" error={errors.insuranceExpiryDate?.message}>
          <input type="date" {...register('insuranceExpiryDate')} style={inputStyle(errors.insuranceExpiryDate)} />
        </Field>
        <Field label="Insurance Status" error={errors.insuranceStatus?.message}>
          <select {...register('insuranceStatus')} style={selectStyle(errors.insuranceStatus)}>
            <option value="">Select...</option>
            {['ACTIVE','SUSPENDED','EXPIRED'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Roadworthy Certificate" error={errors.roadworthyCert?.message}>
          <input {...register('roadworthyCert')} style={inputStyle(errors.roadworthyCert)} />
        </Field>
        <Field label="Customs Reference" error={errors.customsRef?.message}>
          <input {...register('customsRef')} style={inputStyle(errors.customsRef)} />
        </Field>
        <Field label="Proof of Ownership" error={errors.proofOfOwnership?.message}>
          <input {...register('proofOfOwnership')} style={inputStyle(errors.proofOfOwnership)} />
        </Field>
      </div>
    </>
  )
}

// ─── Main Form ────────────────────────────────────────────────────

export default function VehicleForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(schemas[step]),
    mode: 'onChange',
  })

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      alert('Vehicle registered successfully!')
      navigate('/')
    },
    onError: (error) => {
      const messages = error.response?.data?.errors
      if (messages) {
        alert(messages.map(e => e.message).join('\n'))
      } else {
        alert('Something went wrong. Please try again.')
      }
    },
  })

  const handleNext = async (data) => {
    const valid = await trigger()
    if (!valid) return
    const merged = { ...formData, ...data }
    if (step < 2) {
      setFormData(merged)
      setStep(step + 1)
    } else {
      mutation.mutate(merged)
    }
  }

  const stepLabels = ['Vehicle Info', 'Owner Info', 'Registration & Insurance']

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Register New Vehicle</h2>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {stepLabels.map((label, i) => (
          <div key={i} style={{
            flex: 1, padding: '0.5rem', textAlign: 'center', borderRadius: '4px',
            background: i === step ? '#1e293b' : i < step ? '#4ade80' : '#e2e8f0',
            color: i === step ? 'white' : i < step ? 'white' : '#64748b',
            fontWeight: i === step ? 'bold' : 'normal',
            fontSize: '0.85rem'
          }}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleNext)}>
        {step === 0 && <Step1 register={register} errors={errors} />}
        {step === 1 && <Step2 register={register} errors={errors} watch={watch} />}
        {step === 2 && <Step3 register={register} errors={errors} />}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)}
              style={{ padding: '0.75rem 1.5rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Back
            </button>
          )}
          <button type="submit" disabled={mutation.isPending}
            style={{ marginLeft: 'auto', padding: '0.75rem 1.5rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {mutation.isPending ? 'Submitting...' : step < 2 ? 'Next' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}