import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { Link } from "react-router-dom";

const Writeups = () => {
  const [ctfs, setCtfs] = useState([]);

  useEffect(() => {
    const writeupsRef = ref(database, "writeups");
    onValue(writeupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCtfs(Object.keys(data)); 
      }
    });
  }, []);

  return (
    <div className="text-center font-share">
      <div className="text-center text-5xl text-bloodred-500 mb-8">
        Writeups
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        {ctfs.map((ctf) => (ctf !== "categories") && (ctf !== "tagline") ? (
          <Link
            key={ctf}
            to={`/writeup/${ctf}`}
            className="cursor-pointer group bg-[#111]/40 rounded-xl p-10 flex flex-col items-center transition transform hover:scale-105 hover:shadow-[0_0_20px_rgba(197,4,0,0.6)] text-white border-2 border-bloodred-300 text-3xl"
          >
            {ctf}
          </Link>
        ) : null ) }
      </div>
    </div>
  );
};

export default Writeups;
