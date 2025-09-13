import React, { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { ref, push } from "firebase/database";
import { database } from "../firebase"; // adjust path if needed
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const AddWriteups = ({currentUser}) => {
  const refs = {
    ctfName: useRef(null),
    author: useRef(null),
    notes: useRef(null),
    tagline: useRef(null),
  };

  const [markdown, setMarkdown] = useState("## Start writing your CTF writeup...");

  // Helper to create unique keys
  const generateKey = () => "img_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

  // Handle paste
  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          const key = generateKey();
          sessionStorage.setItem(key, base64);
          setMarkdown((prev) => prev + `\n\n![pasted image](session://${key})\n\n`);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        const key = generateKey();
        sessionStorage.setItem(key, base64);
        setMarkdown((prev) => prev + `\n\n![dropped image](session://${key})\n\n`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ctfName = refs.ctfName.current.value.trim();
    const tagline = refs.tagline.current.value.trim();
    const notes = refs.notes.current.value.trim();
    
    if (!ctfName || !tagline || !markdown) {
      alert("⚠️ Please fill in all fields before submitting.");
      return;
    }

    // Replace session:// references with base64
    let finalMarkdown = markdown.replace(/!\[.*?\]\(session:\/\/(.*?)\)/g, (match, key) => {
      const base64 = sessionStorage.getItem(key);
      if (base64) {
        return match.replace(`session://${key}`, base64);
      }
      return match;
    });

    try {
      const writeupsRef = ref(database, "writeups");
      await push(writeupsRef, {
        ctfName,
        author: currentUser.displayName,
        tagline,
        notes,
        content: finalMarkdown,
        createdAt: new Date().toISOString(),
      });

      alert("✅ Writeup added successfully!");
      refs.ctfName.current.value = "";
      refs.tagline.current.value = "";
      setMarkdown("## Start writing your CTF writeup...");
      sessionStorage.clear(); // optional: clear all stored images
    } catch (error) {
      console.error("Error saving writeup:", error);
      alert("❌ Failed to save writeup.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl mb-6 font-bold text-white">Add Writeup</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 text-white">
        {[
          { key: "ctfName", label: "CTF Name" },
          { key: "notes", label: "Notes" },
          { key: "tagline", label: "Tagline" },
        ].map(({ key, label }) => (
          <div key={key} className="relative group" onClick={() => refs[key].current?.focus()}>
            <input
              ref={refs[key]}
              type="text"
              className="peer p-3 w-full rounded-md bg-black text-white focus:outline-none gradient-border"
              placeholder=" "
            />
            <label
              className="absolute left-3 top-3 text-gray-400 transition-all duration-300 
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base 
                peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-bloodred-500 peer-valid:top-[-8px] peer-valid:text-sm peer-valid:text-bloodred-500 bg-black px-1"
            >
              {label}
            </label>
          </div>
        ))}

        <div
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          data-color-mode="dark"
          className="p-2 rounded-md gradient-border"
        >
          <MDEditor value={markdown} onChange={setMarkdown} height={400} />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-8 py-3 border-2 border-bloodred-500 text-bloodred-500 rounded-lg 
              shadow-lg shadow-red-900/50 bg-transparent font-semibold transition-all 
              duration-300 hover:bg-bloodred-500 hover:text-white"
          >
            Submit Writeup
          </button>
        </div>
      </form>

      <style>{`
        @keyframes rotateGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-border {
          border: 2px solid transparent;
          border-radius: 0.5rem;
          background-image: linear-gradient(black, black),
            linear-gradient(270deg, var(--color-bloodred-500), var(--color-bloodred-300), var(--color-bloodred-500));
          background-origin: border-box;
          background-clip: padding-box, border-box;
          background-size: 300% 300%;
        }

        input:focus, .gradient-border:focus-within {
          animation: rotateGradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AddWriteups;
