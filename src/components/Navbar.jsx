import React, { useState, useEffect } from "react";
import logo_dragon from "../assets/logo_dragon.png";
import logo_name from "../assets/logo_name.png";

const Navbar = () => {
  const [shrink, setShrink] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
            className={`hidden md:block w-auto transition-all duration-300 saturate-150 drop-shadow-2xl
            brightness-150 ${shrink ? "h-7" : "h-9"}`}
          />
        </div>

        {/* Desktop Navigation */}
        <div
          className={`hidden md:flex space-x-9 text-bloodred-500 transition-all duration-300 ${shrink ? "text-xl" : "text-2xl"
            }`}
        >
          <a href="/#home" className="hover:underline underline-offset-8">/home</a>
          <a href="/#about" className="hover:underline underline-offset-8">/man</a>
          <a href="/#achievements" className="hover:underline underline-offset-8">/rooted</a>
          <a href="/#members" className="hover:underline underline-offset-8">/passwd</a>
          <a href="/#writeups" className="hover:underline underline-offset-8">/log</a>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-bloodred-500 focus:outline-none transition-all duration-300"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-bloodred-500 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-bloodred-500 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-bloodred-500 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 text-bloodred-500">
          <a
            href="/#home"
            onClick={closeMobileMenu}
            className="hover:underline underline-offset-8 text-lg py-2"
          >
            /home
          </a>
          <a
            href="/#about"
            onClick={closeMobileMenu}
            className="hover:underline underline-offset-8 text-lg py-2"
          >
            /man
          </a>
          <a
            href="/#achievements"
            onClick={closeMobileMenu}
            className="hover:underline underline-offset-8 text-lg py-2"
          >
            /rooted
          </a>
          <a
            href="/#members"
            onClick={closeMobileMenu}
            className="hover:underline underline-offset-8 text-lg py-2"
          >
            /passwd
          </a>
          <a
            href="/#writeups"
            onClick={closeMobileMenu}
            className="hover:underline underline-offset-8 text-lg py-2"
          >
            /log
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
