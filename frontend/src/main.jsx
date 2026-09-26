import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Contexts
import { ThemeProvider } from './contexts/ThemeContext'

// Router
import { BrowserRouter } from 'react-router-dom'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
const queryClient = new QueryClient() 

// context
import { UserProvider } from './contexts/UserContext'


createRoot(document.getElementById('root')).render(

  <QueryClientProvider client={queryClient}> 
    <UserProvider>  
      <BrowserRouter> 
        <ThemeProvider> 
          <App />       
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>  

  </QueryClientProvider>,
)
