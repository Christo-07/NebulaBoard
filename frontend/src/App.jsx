import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import './styles/App.css'

function App() {
  return (
    <>
      <Navbar />
      <main className="container main-container">
        <Outlet />
      </main>
    </>
  )
}

export default App