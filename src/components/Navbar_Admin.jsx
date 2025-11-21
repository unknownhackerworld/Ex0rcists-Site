import React, { useEffect, useRef, useState } from "react";
import logo_dragon from "../assets/logo_dragon.png";
import logo_name from "../assets/logo_name.png";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import Swal from "sweetalert2";

const Navbar_Admin = ({ username }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
        setSocialOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkProvider = async (provider) => {
    try {
      if (!user) {
        Swal.fire({
          icon: "warning",
          title: "No user",
          text: "No user logged in!",
        });
        return;
      }

      await linkWithPopup(user, provider);
      Swal.fire({
        icon: "success",
        title: "Account linked",
        text: "You can now use this social login.",
      });
      setSocialOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Linking failed",
        text: error.message,
      });
    }
  };

  return (
    <nav className="bg-black shadow-[0_2px_12px_#c50400] font-share sticky top-0 z-100 p-6 flex justify-between items-center">
      <div className="flex items-center space-x-3 hover:scale-110 transition-all duration-300">
        <img src={logo_dragon} alt="Dragon Logo" className="h-12 w-auto saturate-150 drop-shadow-2xl
            brightness-150" />
        <img src={logo_name} alt="Name Logo" className="h-8 w-auto saturate-150 drop-shadow-2xl
            brightness-150 " />
      </div>

      <div className="relative" ref={dropdownRef}>
        <span
          className="text-bloodred-500 cursor-pointer hover:underline text-xl"
          onClick={() =>
            setMenuOpen((prev) => {
              const next = !prev;
              if (!next) setSocialOpen(false);
              return next;
            })
          }
        >
          Hello, {username || "User"}!
        </span>

        {menuOpen && user && (
          <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg w-48 z-50">
            <button
              className="block px-4 py-2 hover:bg-gray-700 text-white w-full text-left"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>

            <div className="relative">
              <button
                className="block px-4 py-2 hover:bg-gray-700 text-white w-full text-left"
                onClick={() => setSocialOpen((prev) => !prev)}
              >
                Set Social Signin ▼
              </button>

              {socialOpen && (
                <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg w-full z-50">
                  <button
                    className="block px-4 py-2 hover:bg-gray-700 text-white w-full text-left"
                    onClick={() => linkProvider(new GoogleAuthProvider())}
                  >
                    Link Google
                  </button>
                  <button
                    className="block px-4 py-2 hover:bg-gray-700 text-white w-full text-left"
                    onClick={() => linkProvider(new GithubAuthProvider())}
                  >
                    Link GitHub
                  </button>
                </div>
              )}
            </div>

            <button
              className="block px-4 py-2 hover:bg-gray-700 text-red-400 w-full text-left"
              onClick={() => auth.signOut()}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar_Admin;
