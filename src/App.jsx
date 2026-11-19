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
import MarketplaceLayout from './components/MarketplaceLayout'
import Marketplace from './pages/marketplace/Marketplace'
import ListingDetail from './pages/marketplace/ListingDetail'
import ListingEditor from './pages/marketplace/ListingEditor'
import StoreLayout from './components/StoreLayout'
import StoreAdminLayout from './components/StoreAdminLayout'
import Catalogue from './pages/store/Catalogue'
import ProductDetail from './pages/store/ProductDetail'
import Cart from './pages/store/Cart'
import Orders from './pages/store/Orders'
import OrderDetail from './pages/store/OrderDetail'
import AdminProducts from './pages/store/AdminProducts'
import ProductEditor from './pages/store/ProductEditor'
import StoreSettings from './pages/store/StoreSettings'
import BarnList from './pages/barns/BarnList'
import BarnDetail from './pages/barns/BarnDetail'
import WorkspaceProvider from './components/WorkspaceProvider'
import WorkspaceGate from './components/WorkspaceGate'
import Workspaces from './pages/Workspaces'

export default function App() {
  useReminders()

  const [session, setSession] = useState(() => !!localStorage.getItem('token'))
  const store = (content, protectedRoute = false, admin = false) => {
    const view = <StoreLayout session={session} setSession={setSession}>{admin ? <StoreAdminLayout>{content}</StoreAdminLayout> : content}</StoreLayout>
    return protectedRoute ? <ProtectedRoute session={session}>{view}</ProtectedRoute> : view
  }

  return (
    <WorkspaceProvider session={session}><BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!session ? <Login setSession={setSession} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <Signup setSession={setSession} /> : <Navigate to="/dashboard" />} />
        <Route path="/workspaces" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><Workspaces /></Dashboard></ProtectedRoute>} />
        <Route path="/pets" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><WorkspaceGate required="PETS"><PetList workspace="PETS" /></WorkspaceGate></Dashboard></ProtectedRoute>} />
        <Route path="/livestock" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><WorkspaceGate required="LIVESTOCK"><PetList workspace="LIVESTOCK" /></WorkspaceGate></Dashboard></ProtectedRoute>} />
        <Route path="/livestock/add" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><WorkspaceGate required="LIVESTOCK"><AddPet key="add-cattle" workspace="LIVESTOCK" /></WorkspaceGate></Dashboard></ProtectedRoute>} />
        <Route path="/barns" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><WorkspaceGate required="LIVESTOCK"><BarnList /></WorkspaceGate></Dashboard></ProtectedRoute>} />
        <Route path="/barns/:id" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><WorkspaceGate required="LIVESTOCK"><BarnDetail /></WorkspaceGate></Dashboard></ProtectedRoute>} />
        <Route path="/store" element={store(<Catalogue />)} />
        <Route path="/store/products/:id" element={store(<ProductDetail />)} />
        <Route path="/store/cart" element={store(<Cart session={session} />)} />
        <Route path="/store/orders" element={store(<Orders />, true)} />
        <Route path="/store/orders/:id" element={store(<OrderDetail />, true)} />
        <Route path="/store/admin" element={store(<AdminProducts />, true, true)} />
        <Route path="/store/admin/settings" element={store(<StoreSettings />, true, true)} />
        <Route path="/store/admin/products/new" element={store(<ProductEditor key="new-product" />, true, true)} />
        <Route path="/store/admin/products/:id" element={store(<ProductEditor />, true, true)} />
        <Route path="/store/admin/orders" element={store(<Orders key="admin-orders" admin />, true, true)} />
        <Route path="/store/admin/orders/:id" element={store(<OrderDetail key="admin-order" admin />, true, true)} />
        <Route path="/marketplace" element={<MarketplaceLayout session={session} setSession={setSession}><Marketplace key="browse" /></MarketplaceLayout>} />
        <Route path="/marketplace/mine" element={<ProtectedRoute session={session}><MarketplaceLayout session={session} setSession={setSession}><Marketplace key="mine" owner /></MarketplaceLayout></ProtectedRoute>} />
        <Route path="/marketplace/new" element={<ProtectedRoute session={session}><MarketplaceLayout session={session} setSession={setSession}><ListingEditor key="new" /></MarketplaceLayout></ProtectedRoute>} />
        <Route path="/marketplace/mine/:id" element={<ProtectedRoute session={session}><MarketplaceLayout session={session} setSession={setSession}><ListingEditor /></MarketplaceLayout></ProtectedRoute>} />
        <Route path="/marketplace/:id" element={<MarketplaceLayout session={session} setSession={setSession}><ListingDetail /></MarketplaceLayout>} />
        <Route path="/dashboard" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><WorkspaceGate home /></Dashboard></ProtectedRoute>} />
        <Route path="/pets/add" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><WorkspaceGate required="PETS"><AddPet key="add-pet" workspace="PETS" /></WorkspaceGate></Dashboard></ProtectedRoute>} />
        <Route path="/pets/:id" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><PetDetail /></Dashboard></ProtectedRoute>} />
        <Route path="/pets/:id/edit" element={<ProtectedRoute session={session}><Dashboard setSession={setSession}><EditPet /></Dashboard></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter></WorkspaceProvider>
  )
}
