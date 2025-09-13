import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import MDEditor from "@uiw/react-md-editor";

const SingleWriteup = () => {
  const { ctfName, categoryName, challengeName } = useParams();
  const [writeup, setWriteup] = useState(null);
  useEffect(() => {
    const writeupRef = ref(
      database,
      `writeups/${ctfName}/${categoryName}/${challengeName}`
    );
    onValue(writeupRef, (snapshot) => {
      setWriteup(snapshot.val());
    

    });
  }, [ctfName, categoryName, challengeName]);

  if (!writeup)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#010101] text-white">
        <div className="w-16 h-16 border-4 border-bloodred-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-lg animate-pulse">Loading Writeup...</p>
      </div>
    );


  return (
    <div className="min-h-screen bg-[#010101] py-12 px-4 sm:px-6 lg:px-8 font-share text-white">
      <div className="max-w-4xl mx-auto bg-[#111] rounded-2xl shadow-lg shadow-red-900/40 p-8 relative overflow-hidden">
        
        <div
          className="absolute inset-0 opacity-5 pointer-events-none bg-no-repeat bg-center bg-contain"
          style={{ backgroundImage: "url('/logo.png')" }}
        ></div>

        <div className="mb-6">
          <h1 className="text-5xl font-bold text-bloodred-500 mb-2">
            {writeup.challengeName}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-bloodred-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
              {categoryName.toUpperCase()}
            </span>
            <span className="text-gray-400 text-sm">
              By {writeup.author} • {new Date(writeup.createdAt).toLocaleString()}
            </span>
            <Link
              to={`/writeup/${ctfName}`}
              className="ml-auto text-bloodred-500 text-sm font-semibold hover:underline"
            >
              ← Back to Challenges
            </Link>
          </div>
        </div>

        {writeup.tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {writeup.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-bloodred-700/30 text-bloodred-500 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {writeup.notes && (
          <div className="mb-6 p-4 bg-[#222] rounded-lg border border-bloodred-500 text-gray-300">
            {writeup.notes}
          </div>
        )}

        <hr className="my-6 border-gray-700" />

        <div className="prose prose-invert max-w-full text-gray-200">
       <MDEditor.Markdown source={writeup.content} />
        </div>
      </div>
    </div>
  );
};

export default SingleWriteup;
