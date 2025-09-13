import React, { useState } from "react";

const TagInput = ({ suggestions, onChange }) => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim()) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      const updated = [...tags, tag];
      setTags(updated);
      onChange(updated);
    }
    setInput("");
    setFilteredSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const removeTag = (tag) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    onChange(updated);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className="bg-bloodred-300 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-scaleIn"
          >
            {tag}
            <button
              type="button"
              className="text-sm font-bold hover:text-red-300 transition-colors"
              onClick={() => removeTag(tag)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter..."
        className="w-full border px-3 py-2 rounded-lg bg-black text-white focus:outline-none gradient-border"
      />

      {filteredSuggestions.length > 0 && (
        <div className="border mt-2 rounded-lg bg-bloodred-300 shadow-md max-h-40 overflow-y-auto animate-fadeIn">
          {filteredSuggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => addTag(s)}
              className="px-3 py-2 hover:bg-bloodred-500 cursor-pointer transition-colors"
            >
              {s}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TagInput;
