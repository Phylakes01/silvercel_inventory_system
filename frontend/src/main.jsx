import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { AuthContextProvider } from '@/context/AuthContext'
import { ThemeContextProvider } from '@/context/ThemeContext'
import { NavigationProvider } from '@/context/NavigationContext'
import { Toaster } from 'sonner'  

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthContextProvider> {/* Supabase login, logout, and session context */}
        <ThemeContextProvider> {/* Theme context */}
          <NavigationProvider> {/* Sets selected menu name in App.jsx */}
            <RouterProvider router={router} />

            {/* 
              Alternative to alert 
              
              To use import this to any component.jsx first:
              import { toast } from 'sonner'

              Can be used like this:
              toast.success('Logged out successfully');
              toast.error('Error logging out');
            
            */}
            <Toaster richColors position="top-center"/> 
            
          </NavigationProvider>
        </ThemeContextProvider>
      </AuthContextProvider>
  </StrictMode>,
)
