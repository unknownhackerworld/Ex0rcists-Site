import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Members from './pages/Members'

function App() {

  return (
    <>
      <div className='bg-[#010101] min-h-screen w-full bg-grid'>
      <Navbar/>
      <Home />
      <About />
      <Members />
      </div>
    </>
  )
}

export default App
