import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Members from './pages/Members'
import Writeups from './pages/Writeups'

function App() {
  return (
    <>
      <div className="bg-[#010101] min-h-screen w-full bg-grid bg-fixed scroll-smooth">
        <Navbar />
        <section id="home" className="scroll-mt-28">
          <Home />
        </section>

        <section id="about" className="scroll-mt-28">
          <About />
        </section>

        <section id="members" className="scroll-mt-28">
          <Members />
        </section>

        <section id="writeups" className="scroll-mt-28">
         <Writeups />
        </section>

      </div>
    </>
  )
}

export default App;
