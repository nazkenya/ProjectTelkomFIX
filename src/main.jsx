import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './auth/AuthContext'
import { MessageProvider } from "./components/ui/GlobalMessage";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessageProvider>
          <App />
        </MessageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
