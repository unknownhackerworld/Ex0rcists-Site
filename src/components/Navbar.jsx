import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-black p-9 shadow-[0_2px_12px_#c50400] font-share sticky">
      <div className="mx-auto flex justify-between items-center">

        {/* Logo container */}
        <div className="flex items-center space-x-3">
          <img
            src="src/assets/logo_dragon.png"
            alt="Dragon Logo"
            className="h-16 w-auto"
          />
          <img
            src="src/assets/logo_name.png"
            alt="Name Logo"
            className="h-9 w-auto"
          />
        </div>

        {/* Nav Links */}
        <div className="flex space-x-9 text-2xl text-bloodred-500">
          <a href="#" className="hover:underline underline-offset-8">/home</a>
          <a href="#" className="hover:underline underline-offset-8">/man</a>
          <a href="#" className="hover:underline underline-offset-8">/passwd</a>
          <a href="#" className="hover:underline underline-offset-8">/log</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
