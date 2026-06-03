import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from "./components/backend/context/Auth.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
