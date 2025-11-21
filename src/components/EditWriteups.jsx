import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "../firebase";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Swal from "sweetalert2";

const EditWriteups = ({ currentUser }) => {
  const [writeups, setWriteups] = useState([]);
  const [Admins, setAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ctfName: "",
    category: "",
    challengeName: "",
    author: "",
    tagline: "",
    notes: "",
    content: "## Start editing your CTF writeup...",
  });

  useEffect(() => {
    const writeupsRef = ref(database, "writeups");
    const adminsRef = ref(database, "admins");

    // Fetch all writeups in hierarchy CTF → Category → Challenge
    onValue(writeupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = [];
        // Filter out non-CTF keys
        const ctfs = Object.keys(data).filter(
          (key) => key !== "tagline" && key !== "categories"
        );

        ctfs.forEach((ctfName) => {
          Object.keys(data[ctfName] || {}).forEach((category) => {
            Object.keys(data[ctfName][category] || {}).forEach((challenge) => {
              const item = data[ctfName][category][challenge];
              list.push({
                id: `${ctfName}_${category}_${challenge}`,
                ctfName,
                category,
                challengeName: challenge,
                ...item
              });
            });
          });
        });

        setWriteups(list);
      } else {
        setWriteups([]);
      }
    });



    // Fetch admins
    onValue(adminsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => data[key]);
        setAdmins(list);
      } else setAdmins([]);
    });
  }, []);

  const generateKey = () =>
    "img_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

  const handlePaste = (event) => {
    const items =
      (event.clipboardData || event.originalEvent.clipboardData)?.items || [];
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          const key = generateKey();
          sessionStorage.setItem(key, base64);
          setFormData(prev => ({
            ...prev,
            content: prev.content + `\n\n![pasted image](session://${key})\n\n`
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        const key = generateKey();
        sessionStorage.setItem(key, base64);
        setFormData(prev => ({
          ...prev,
          content: prev.content + `\n\n![dropped image](session://${key})\n\n`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    let content = item.content || "";

    // Replace base64 images with session keys
    const imgRegex = /!\[.*?\]\((data:image\/.*?;base64,[^)]+)\)/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const base64 = match[1];
      const key = generateKey();
      sessionStorage.setItem(key, base64);
      content = content.replace(base64, `session://${key}`);
    }

    setFormData({
      ctfName: item.ctfName,
      category: item.category,
      challengeName: item.challengeName,
      author: item.author,
      tagline: item.tagline,
      notes: item.notes,
      content,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    let finalContent = formData.content.replace(
      /!\[.*?\]\(session:\/\/(.*?)\)/g,
      (match, key) => {
        const base64 = sessionStorage.getItem(key);
        if (base64) return match.replace(`session://${key}`, base64);
        return match;
      }
    );

    try {
      const writeupRef = ref(
        database,
        `writeups/${formData.ctfName}/${formData.category}/${formData.challengeName}`
      );
      await update(writeupRef, {
        ...formData,
        content: finalContent,
        updatedAt: new Date().toISOString(),
      });
      Swal.fire({
        icon: "success",
        title: "Writeup updated",
        text: "Changes saved successfully.",
      });
      setEditingId(null);
      setFormData({
        ctfName: "",
        category: "",
        challengeName: "",
        author: "",
        tagline: "",
        notes: "",
        content: "## Start editing your CTF writeup...",
      });
      sessionStorage.clear();
    } catch (error) {
      console.error("Error updating writeup:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Failed to update writeup.",
      });
    }
  };

  const handleDelete = async (item) => {
    if (!item) return;
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete writeup?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;

    try {
      const writeupRef = ref(
        database,
        `writeups/${item.ctfName}/${item.category}/${item.challengeName}`
      );
      await remove(writeupRef);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Writeup removed.",
      });
    } catch (error) {
      console.error("Error deleting writeup:", error);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Failed to delete writeup.",
      });
    }
  };

  const handleToggleVisible = async (item) => {
    try {
      const writeupRef = ref(
        database,
        `writeups/${item.ctfName}/${item.category}/${item.challengeName}`
      );
      await update(writeupRef, { visible: !item.visible });
    } catch (error) {
      console.error("Error updating visibility:", error);
      Swal.fire({
        icon: "error",
        title: "Visibility update failed",
        text: "Failed to update visibility.",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl mb-6 font-bold text-white">Edit Writeups</h1>

      <ul className="mb-6 space-y-3">
        {writeups.length > 0 ? (
          writeups
            .filter(item =>
              Admins.includes(currentUser.email)
                ? true
                : item.author === currentUser.displayName
            )
            .map(item => (
              <li key={item.id} className="p-4 border border-bloodred-500 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {item.ctfName} - {item.category} - {item.challengeName}
                    </h2>
                    <p className="text-gray-400">{item.tagline}</p>
                    <span className="text-sm text-gray-500">By @{item.author}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-sm text-gray-300">Visible</span>
                      <div
                        className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 
        ${item.visible ? "bg-bloodred-500" : "bg-gray-600"}`}
                        onClick={() => handleToggleVisible(item)}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 
          ${item.visible ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </div>
                    </label>

                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 bg-bloodred-500 text-white rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editingId === item.id && (
                  <form
                    onSubmit={handleUpdate}
                    className="grid grid-cols-1 gap-6 text-white mt-6"
                  >
                    {["ctfName", "category", "challengeName", "author", "notes", "tagline"].map(key => (
                      <div key={key} className="relative group">
                        <input
                          type="text"
                          value={formData[key] || ""}
                          onChange={(e) =>
                            setFormData(prev => ({ ...prev, [key]: e.target.value }))
                          }
                          className="peer p-3 w-full rounded-md bg-black text-white focus:outline-none gradient-border"
                          placeholder=" "
                          required
                        />
                        <label
                          className="absolute left-3 top-3 text-gray-400 transition-all duration-300
peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-bloodred-500 peer-valid:top-[-8px] peer-valid:text-sm peer-valid:text-bloodred-500 bg-black px-1"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
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
                      <MDEditor
                        value={formData.content}
                        onChange={value =>
                          setFormData(prev => ({ ...prev, content: value }))
                        }
                        height={400}
                      />
                    </div>

                    <div className="flex justify-center mt-6 space-x-4">
                      <button
                        type="submit"
                        className="px-8 py-3 border-2 border-bloodred-500 text-bloodred-500 rounded-lg
shadow-lg shadow-red-900/50 bg-transparent font-semibold transition-all
duration-300 hover:bg-bloodred-500 hover:text-white"
                      >
                        Update Writeup
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            ctfName: "",
                            category: "",
                            challengeName: "",
                            author: "",
                            tagline: "",
                            notes: "",
                            content: "## Start editing your CTF writeup...",
                          });
                          sessionStorage.clear();
                        }}
                        className="px-8 py-3 border-2 border-gray-500 text-gray-400 rounded-lg
shadow-lg shadow-gray-900/50 bg-transparent font-semibold transition-all
duration-300 hover:bg-gray-600 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </li>
            ))
        ) : (
          <span className="text-gray-400">Add Writeups to Edit Them!</span>
        )}
      </ul>
    </div>
  );
};

export default EditWriteups;
