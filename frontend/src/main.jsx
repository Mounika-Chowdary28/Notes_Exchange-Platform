import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { GamificationProvider } from './context/GamificationContext'
import { NotesProvider } from './context/NotesContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotesProvider>
        <ChatProvider>
          <GamificationProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </GamificationProvider>
        </ChatProvider>
      </NotesProvider>
    </AuthProvider>
  </StrictMode>,
)
