import React, { useState, useRef } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";




const AddMembers = () => {
  const [categories, setCategories] = useState({}); 
  const [selectedTags, setSelectedTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    tagline: "",
    description: "",
    linkedin: "",
    profilePic: "",
    email: "",  
  });

  const fileInputRef = useRef(null);


  const challengeTags = [
    { id: "all", label: "All" },
    { id: "web", label: "Web Exploitation" },
    { id: "osint", label: "OSINT" },
    { id: "re", label: "Reverse Engineering" },
    { id: "pwn", label: "Pwn" },
    { id: "steg", label: "Steganography" },
    { id: "forensics", label: "Forensics" },
    { id: "crypto", label: "Cryptography" }
  ];
  
  const refs = {
    name: useRef(null),
    displayName: useRef(null),
    tagline: useRef(null),
    description: useRef(null),
    linkedin: useRef(null),
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (id) => {
    if (id === "all") {
      if (selectedTags.includes("all")) {
        setSelectedTags([]);
      } else {
        setSelectedTags(challengeTags.map((t) => t.id));
      }
    } else {
      let newTags = selectedTags.includes(id)
        ? selectedTags.filter((tag) => tag !== id)
        : [...selectedTags, id];

      if (
        newTags.length === challengeTags.length - 1 &&
        !newTags.includes("all")
      ) {
        newTags.push("all");
      } else if (newTags.includes("all") && !selectedTags.includes(id)) {
        newTags = newTags.filter((tag) => tag !== "all");
      }
      setSelectedTags(newTags);
    }
  };

  const handleRemoveTag = (id) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== id));
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Name and Email are required!");
      return;
    }

    const categories = selectedTags.filter((id) => id !== "all");


    try {
      const res = await fetch("/.netlify/functions/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          displayName: formData.displayName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      const uid = data.uid; // ✅ The UID returned from backend

      await set(ref(database, `members/${formData.name}`), {
        displayName: formData.displayName,
        TagLine: formData.tagline,
        Description: formData.description,
        LinkedIn: formData.linkedin,
        Categories: categories,
        ProfilePic: formData.profilePic,
        Email: formData.email,
        UID: uid, // ✅ Store UID from backend
      });

      alert("✅ Member added successfully with authentication!");

      setFormData({
        name: "",
        displayName: "",
        tagline: "",
        description: "",
        linkedin: "",
        profilePic: "",
        email: "",
      });
      setSelectedTags([]);
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("❌ Error saving data: " + error.message);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl mb-6 font-bold text-left text-white">
        Add Members
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        onSubmit={handleSubmit}
      >
        <div className="col-span-2 flex justify-center">
          {!imagePreview ? (
            <div
              className="flex flex-col w-full items-center justify-center border-2 border-dashed border-red-500 rounded-lg p-4 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <p className="mb-2">Upload member image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current.click()}
              className="relative w-32 h-32 rounded-full border-4 border-bloodred-500 flex items-center justify-center cursor-pointer overflow-hidden group"
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaPencilAlt className="text-white w-8 h-8" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
        {[
          { key: "name", label: "Name" },
          { key: "displayName", label: "Display Name" },
          { key: "tagline", label: "Tagline" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "linkedin", label: "LinkedIn", type: "url" },
          { key: "email", label: "Email", type: "email" },
        ].map(({ key, label, type }) => (
          <div
            key={key}
            className="relative group"
            onClick={() => refs[key].current?.focus()}
          >
            {type === "textarea" ? (
              <textarea
                ref={refs[key]}
                value={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                rows={3}
                className="peer p-3 w-full rounded-md bg-black text-white focus:outline-none relative z-10 gradient-border"
                placeholder=" "
              />
            ) : (
              <input
                ref={refs[key]}
                type={type || "text"}
                value={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="peer p-3 w-full rounded-md bg-black text-white focus:outline-none relative z-10 gradient-border"
                placeholder=" "
                required={true} minLength={1}              />
            )}
            <label
              className="absolute peer-valid:top-[-8px] peer-valid:text-sm peer-valid:text-bloodred-500 left-3 top-3 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-3 
                peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-bloodred-500 bg-black z-50 px-1"
            >
              {label}
            </label>
          </div>
        ))}

        <div className="relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-3 rounded-md bg-black text-gray-400 cursor-pointer flex justify-between items-center gradient-border"
          >
            <span>Choose Category</span>
            <span className="ml-2">▼</span>
          </div>
          {dropdownOpen && (
            <div className="absolute mt-2 w-full bg-black border border-gray-600 rounded-md max-h-48 overflow-auto z-10">
              {challengeTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-800"
                  onClick={() => handleTagToggle(tag.id)}
                >
                  <div
                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center mr-2 
                      ${selectedTags.includes(tag.id)
                        ? "bg-bloodred-500 border-bloodred-500"
                        : "border-gray-400"
                      }`}
                  >
                    {selectedTags.includes(tag.id) && <span>✔</span>}
                  </div>
                  {tag.label}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {selectedTags
              .filter((id) => id !== "all")
              .map((id) => {
                const tag = challengeTags.find((t) => t.id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center bg-bloodred-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    <button
                      type="button"
                      className="mr-2 font-bold"
                      onClick={() => handleRemoveTag(id)}
                    >
                      ×
                    </button>
                    {tag?.label}
                  </span>
                );
              })}
          </div>
        </div>

        <div className="col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="px-8 py-3 border-2 border-bloodred-500 text-bloodred-500 rounded-lg 
              shadow-lg shadow-red-900/50 bg-transparent font-semibold transition-all 
              duration-300 hover:bg-bloodred-500 hover:text-white"
          >
            Submit
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
          transition: all 0.3s ease;
        }
        .gradient-border:focus {
          animation: rotateGradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AddMembers;
