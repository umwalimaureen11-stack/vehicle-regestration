import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import VehicleDetails from './pages/VehicleDetails'
import VehicleForm from './pages/VehicleForm'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicle/new" element={<VehicleForm />} />
          <Route path="/vehicle/:id/edit" element={<VehicleForm />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
        </Route>
      </Routes>
    </>
  )
}