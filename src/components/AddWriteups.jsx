import React, { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import TagInput from "./TagInput";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dm3b6hwzu/image/upload";
const UPLOAD_PRESET = "ex0rcists"; 

const AddWriteups = ({ currentUser }) => {
  const refs = {
    ctfName: useRef(null),
    challengeName: useRef(null),
    notes: useRef(null),
  };

  const [markdown, setMarkdown] = useState("## Start writing your CTF writeup...");
  const [allTaglines, setAllTaglines] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch categories
  useEffect(() => {
    const catRef = ref(database, "writeups/categories");
    onValue(catRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.entries(data).map(([id, label]) => ({ id, label }));
        setCategories(arr);
      } else {
        setCategories([]);
      }
    });
  }, []);

  // Fetch taglines
  useEffect(() => {
    const taglineRef = ref(database, "writeups/tagline");
    onValue(taglineRef, (snapshot) => {
      if (snapshot.exists()) {
        setAllTaglines(Object.values(snapshot.val()));
      } else {
        setAllTaglines([]);
      }
    });
  }, []);

  const insertAtCursor = (text) => {
    const textarea = document.querySelector(".w-md-editor-text-input");
    if (!textarea) {
      setMarkdown((prev) => prev + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setMarkdown((prev) => prev.slice(0, start) + text + prev.slice(end));
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    }, 0);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url; 
  };

  const handlePaste = async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const url = await uploadToCloudinary(file);
        insertAtCursor(`![pasted image](${url})`);
      }
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = await uploadToCloudinary(file);
      insertAtCursor(`![dropped image](${url})`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ctfName = refs.ctfName.current.value.trim();
    const challengeName = refs.challengeName.current.value.trim();
    const notes = refs.notes.current.value.trim();
    const category = selectedCategory.trim();

    if (!ctfName || !challengeName || !category || tags.length === 0 || !markdown) {
      alert("⚠️ Please fill in all fields before submitting.");
      return;
    }

    try {
      const writeupRef = ref(database, `writeups/${ctfName}/${category}/${challengeName}`);
      await set(writeupRef, {
        ctfName,
        challengeName,
        category,
        author: currentUser?.displayName || "Anonymous",
        tags,
        notes,
        content: markdown, 
        createdAt: new Date().toISOString(),
        visible: true,
      });

      for (let tag of tags) {
        if (!allTaglines.includes(tag)) {
          const taglineRef = ref(database, `writeups/tagline/${tag}`);
          await set(taglineRef, tag);
        }
      }

      if (!categories.find((c) => c.id === category)) {
        const catRef = ref(database, `writeups/categories/${category}`);
        await set(catRef, category.charAt(0).toUpperCase() + category.slice(1));
      }

      alert("✅ Writeup added successfully!");
      refs.ctfName.current.value = "";
      refs.challengeName.current.value = "";
      refs.notes.current.value = "";
      setTags([]);
      setMarkdown("## Start writing your CTF writeup...");
      setSelectedCategory("");
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
          { key: "challengeName", label: "Challenge Name" },
          { key: "notes", label: "Notes" },
        ].map(({ key, label }) => (
          <div key={key} className="relative group" onClick={() => refs[key].current?.focus()}>
            <input
              ref={refs[key]}
              type="text"
              className="peer p-3 w-full rounded-md bg-black text-white focus:outline-none gradient-border"
              placeholder=" "
              required
              minLength={1}
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

        <div className="relative group">
          <input
            type="text"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            list="category-list"
            className="peer p-3 w-full rounded-md bg-black text-white focus:outline-none gradient-border"
            placeholder=" "
            required
          />
          <label
            className="absolute left-3 top-3 text-gray-400 transition-all duration-300 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base 
              peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-bloodred-500 peer-valid:top-[-8px] peer-valid:text-sm peer-valid:text-bloodred-500 bg-black px-1"
          >
            Category
          </label>
          <datalist id="category-list">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </datalist>
        </div>

        <div>
          <label className="block mb-2 text-gray-400">Tags</label>
          <TagInput
            suggestions={allTaglines}
            onChange={(selectedTags) => setTags(selectedTags)}
          />
        </div>

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
