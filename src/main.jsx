import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './router/router.jsx'
import 'aos/dist/aos.css';
import Aos from 'aos'
import AuthProvider from './contexts/AuthContext/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'

Aos.init()
const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='bg-base-300'>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
          <ToastContainer />
        </AuthProvider>
      </QueryClientProvider>

    </div>
  </StrictMode>,
)
