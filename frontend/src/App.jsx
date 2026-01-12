import './App.css'
import TopBar from './components/TopBar'
import Header from './components/Header'
import Home from './pages/Home'
import Accessories from './pages/Accessories'
import Footer from './components/Footer'

function App() {
  // Simple routing without react-router-dom
  const currentPath = window.location.pathname;
  
  return (
    <>
      <TopBar />
      <Header />
      {currentPath === '/accessories' ? <Accessories /> : <Home />}
      <Footer />
    </>
  )
}

export default App
