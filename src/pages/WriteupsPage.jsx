import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import logo from "../assets/logo.png";

const WriteupsPage = () => {
  const [ctfs, setCtfs] = useState([]);

  useEffect(() => {
    const writeupsRef = ref(database, "writeups");
    onValue(writeupsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setCtfs([]);
        return;
      }
      const allCtfs = Object.keys(data).map((ctfName) => ({ name: ctfName }));
      setCtfs(allCtfs);
    });
  }, []);

  if (!ctfs.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#010101] text-white">
        <div className="w-16 h-16 border-4 border-bloodred-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-lg animate-pulse">Loading CTFs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] text-white px-6 py-10 font-share">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-bloodred-500 mb-10 text-center">
          All CTF Writeups
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ctfs.map(({ name }) => (name !== "categories") && (name !== "tagline") ? (
            <Link
              key={name}
              to={`/writeup/${name}`}
              className="relative group p-8 rounded-xl border-2 border-bloodred-500 
                bg-black/60 shadow-lg shadow-red-900/30 hover:scale-105 transform transition 
                hover:shadow-[0_0_25px_rgba(197,4,0,0.6)] overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition bg-center bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${logo})` }}
              ></div>

              <h2 className="relative text-2xl font-bold text-bloodred-400">{name}</h2>
              <p className="relative mt-2 text-gray-400">Click to view categories</p>
            </Link>
          ) : null)}
        </div>
      </div>
    </div>
  );
};

export default WriteupsPage;
