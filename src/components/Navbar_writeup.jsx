import React from "react";
import logo_dragon from "../assets/logo_dragon.png";
import logo_name from "../assets/logo_name.png";

const Navbar_writeup = () => {

  return (
    <nav className="bg-black shadow-[0_2px_12px_#c50400] font-share sticky top-0 z-100 p-6 flex justify-between items-center">
      <div className="flex items-center space-x-3 hover:scale-110 transition-all duration-300">
        <img src={logo_dragon} alt="Dragon Logo" className="h-12 w-auto saturate-150 drop-shadow-2xl
            brightness-150" />
        <img src={logo_name} alt="Name Logo" className="h-8 w-auto saturate-150 drop-shadow-2xl
            brightness-150" />
      </div>

      <div className="relative">
        <span
          className="text-bloodred-500 cursor-pointer hover:underline text-xl"
        >
          Hello, YOU !
        </span>

      
      </div>
    </nav>
  );
};

export default Navbar_writeup;
