import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PetList from './pages/pets/PetList'
import AddPet from './pages/pets/AddPet'
import PetDetail from './pages/pets/PetDetail'
import ProtectedRoute from './components/ProtectedRoute'
import { useReminders } from './hooks/useReminders'
import Landing from './pages/Landing'
import EditPet from './pages/pets/EditPet'
import Dashboard from './pages/Dashboard'

export default function App() {
  useReminders()

  const [session, setSession] = useState(() => !!localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!session ? <Login setSession={setSession} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <Signup setSession={setSession} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><PetList /></Dashboard></ProtectedRoute>} />
        <Route path="/pets/add" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><AddPet /></Dashboard></ProtectedRoute>} />
        <Route path="/pets/:id" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><PetDetail /></Dashboard></ProtectedRoute>} />
        <Route path="/pets/:id/edit" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><EditPet /></Dashboard></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}