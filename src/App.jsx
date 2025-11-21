import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Members from './pages/Members'
import Writeups from './pages/Writeups'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Navbar_Admin from './components/Navbar_Admin'
import AddWriteups from './components/AddWriteups'
import SingleWriteup from './pages/SingleWriteup'
import CTFChallenges from './pages/CTFChallenges'
import WriteupsPage from './pages/WriteupsPage'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { auth } from "./firebase"
import Navbar_writeup from './components/Navbar_writeup'
import Achievements from './pages/Achievements'
import AchievementsPage from './pages/AchievementsPage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      console.log("Auth state changed:", user)
    })
    return () => unsub()
  }, [])

  return (
    <Router>
      <div className="bg-[#010101] min-h-screen w-full bg-grid bg-fixed scroll-smooth">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <section id="home" className="scroll-mt-28"><Home /></section>
                <section id="about" className="scroll-mt-28"><About /></section>
                <section id="achievements" className="scroll-mt-28"> <Achievements /></section>
                <section id="members" className="scroll-mt-28"><Members /></section>
                <section id="writeups" className="scroll-mt-28"><Writeups /></section>
              </>
            }
          />
          
          <Route
            path="/achievements"
            element={
              <>
                <Navbar />
                <AchievementsPage />
              </>
            }
          />

          <Route
            path="/admin"
            element={
              <>
                <Navbar_Admin username={currentUser?.displayName} />
                <Admin />
              </>
            }
          />

          <Route
            path="/add-writeup"
            element={
              <>
                <Navbar_Admin username={currentUser?.displayName} />
                <AddWriteups currentUser={currentUser} />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Navbar_Admin username={currentUser?.displayName} />
                <Login />
              </>
            }
          />

          <Route path="/writeup/:id" element={<><Navbar_writeup /><CTFChallenges /></>} />
          <Route path="/writeup/" element={<><Navbar_writeup /><WriteupsPage /></>} />
          <Route path="/writeup/:ctfName/:categoryName/:challengeName" element={<><Navbar_writeup /><SingleWriteup /></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
