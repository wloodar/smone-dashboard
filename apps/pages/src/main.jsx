import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Page from './login.jsx'

import './tailwind.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Page />
    </StrictMode>
)
