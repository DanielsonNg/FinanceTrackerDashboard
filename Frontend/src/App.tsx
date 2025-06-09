import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Route, Routes } from 'react-router-dom'
import Home from "./views/Home"
import Login from "./views/Login"
import EmailVerify from "./views/EmailVerify"
import DefaultLayout from './layout/DefaultLayout'
import GuestLayout from './layout/GuestLayout'
import ResetPassword from './views/ResetPassword'
import History from './views/History'
import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }>
          <Route path='/' element={<Home />} />
          <Route path='/history' element={<History />} />
        </Route>
        <Route path='/' element={<GuestLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}