import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './app/app.tsx'

import 'bootstrap/dist/css/bootstrap.min.css' // <-- подключаем Bootstrap
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
