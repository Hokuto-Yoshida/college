import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CustomCursor } from './components/CustomCursor'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CustomCursor />
        <App />
    </StrictMode>,
)
