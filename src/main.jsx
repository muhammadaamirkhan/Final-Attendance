import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import NavBar from './components/Layouts/NavBar.jsx'
import FooTer from './components/Layouts/FooTer.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NavBar/>
    <App />
    <FooTer/>
  </BrowserRouter>,
)
