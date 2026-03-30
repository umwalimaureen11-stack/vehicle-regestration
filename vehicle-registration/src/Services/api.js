import axios from 'axios'

const api = axios.create({
  baseURL: 'https://student-management-system-backend.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Vehicle Endpoints ───────────────────────────────────────────

export const getAllVehicles = () => api.get('/api/vehicle-service/vehicle')

export const getVehicleById = (id) => api.get(`/api/vehicle-service/vehicle/${id}`)

export const createVehicle = (data) => api.post('/api/vehicle-service/vehicle', data)

export const updateVehicle = (id, data) => api.put(`/api/vehicle-service/vehicle/${id}`, data)

export const deleteVehicle = (id) => api.delete(`/api/vehicle-service/vehicle/${id}`)

// ─── Segmented Endpoints ─────────────────────────────────────────

export const getVehicleInfo = (id) => api.get(`/api/vehicle-service/vehicle/${id}/info`)

export const getVehicleOwner = (id) => api.get(`/api/vehicle-service/vehicle/${id}/owner`)

export const getVehicleRegistration = (id) => api.get(`/api/vehicle-service/vehicle/${id}/registration`)

export const getVehicleInsurance = (id) => api.get(`/api/vehicle-service/vehicle/${id}/insurance`)

export default api