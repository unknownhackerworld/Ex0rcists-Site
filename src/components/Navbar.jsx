import React, { useState, useEffect } from "react";
import logo_dragon from "../assets/logo_dragon.png";
import logo_name from "../assets/logo_name.png";

const Navbar = () => {
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShrink(true);
      } else {
        setShrink(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-black shadow-[0_2px_12px_#c50400] font-share sticky top-0 z-100 transition-all duration-300 ease-in-out
        ${shrink ? "p-4" : "p-9"}`}
    >
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3 transition-all duration-300">
          <img
            src={logo_dragon}
            alt="Dragon Logo"
            className={`w-auto transition-all duration-300 saturate-150 drop-shadow-2xl
            brightness-150 ${shrink ? "h-12" : "h-16"}`}
          />
          <img
            src={logo_name}
            alt="Name Logo"
            className={`w-auto transition-all duration-300 saturate-150 drop-shadow-2xl
            brightness-150 ${shrink ? "h-7" : "h-9"}`}
          />
        </div>

        <div
          className={`flex space-x-9 text-bloodred-500 transition-all duration-300 ${shrink ? "text-xl" : "text-2xl"
            }`}
        >
          <a href="#home" className="hover:underline underline-offset-8">/home</a>
          <a href="#about" className="hover:underline underline-offset-8">/man</a>
          <a href="#members" className="hover:underline underline-offset-8">/passwd</a>
          <a href="#writeups" className="hover:underline underline-offset-8">/log</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
