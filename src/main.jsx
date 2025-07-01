import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './router/router.jsx'
import 'aos/dist/aos.css';
import Aos from 'aos'
import AuthProvider from './contexts/AuthContext/AuthProvider.jsx'
Aos.init()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='bg-base-300'>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </div>
  </StrictMode>,
)
