import React, { useState, useEffect } from "react";
import { categories } from "../components/categories";

const Members = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [members, setMembers] = useState([
    {
      name: "Karthik",
      username: "K4RTH1K",
      linkedin: "https://linkedin.com/in/karthik",
      picture: "src/assets/members/karthik.jpeg",
      notes:
        "A notorious hacker who can solve almost any challenge with extraordinary talent.",
      fields: ["Web Exploitation", "Forensics"],
      tagline: "Root or nothing.",
    },
    {
      name: "Shyamalavannan G",
      username: "Shyam",
      linkedin: "https://linkedin.com/in/shyamalavannan",
      picture: "src/assets/members/shyam.jpeg",
      notes:
        "The second pillar of Ex0rcists, a strategist with precision and calm under pressure.",
      fields: ["OSINT", "Reverse Engineering"],
      tagline: "Silent, precise.",
    },
    {
      name: "Praveen S",
      username: "Praveen",
      linkedin: "https://linkedin.com/in/praveens",
      picture: "src/assets/members/praveen.jpeg",
      notes: "Expert in deep system analysis and breaking binaries.",
      fields: ["Reverse Engineering", "Steganography"],
      tagline: "Reverse engineer by trade.",
    },
    {
      name: "Janish Andrin",
      username: "Janish",
      linkedin: "https://linkedin.com/in/janish",
      picture: "src/assets/members/janish.jpeg",
      notes: "The offensive powerhouse, master of exploitation.",
      fields: ["Pwn", "Web Exploitation"],
      tagline: "Exploit first, ask later.",
    },
    {
      name: "Shakthi Vikranth",
      username: "Shaz",
      linkedin: "https://linkedin.com/in/shaz",
      picture: "src/assets/members/shaz.jpeg",
      notes: "Master at uncovering digital trails and hidden evidence.",
      fields: ["Forensics"],
      tagline: "Trace it, prove it.",
    },
  ]);

  const [activeMemberIndex, setActiveMemberIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [closing, setClosing] = useState(false);

  const filteredMembers =
    selectedCategory === "All"
      ? members
      : members.filter((m) => m.fields.includes(selectedCategory));

  const openModal = (index) => {
    setActiveMemberIndex(index);
    setIsGlitchActive(true);

    setTimeout(() => {
      setIsModalOpen(true);
      setIsGlitchActive(false);
    }, 300); 
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setActiveMemberIndex(null);
      setClosing(false);
    }, 650);
  };

  const updateTagline = (idx, newTagline) => {
    setMembers((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], tagline: newTagline };
      return clone;
    });
  };

  
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isModalOpen && !closing) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, closing]);

  return (
    <>
      
      <style>{`
        /* GLITCH overlay */
        .glitch-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 60;
          background: transparent;
        }
        .glitch-bar {
          position: absolute;
          left: -5%;
          width: 110%;
          height: 6px;
          top: 20%;
          background: rgba(197, 4, 0, 0.12);
          transform: skewX(-10deg);
          animation: glitchBar 350ms linear infinite;
          mix-blend-mode: overlay;
          filter: saturate(1.3) blur(.2px);
        }
        @keyframes glitchBar {
          0% { transform: translateX(-100%) skewX(-10deg); opacity: 0;}
          30% { opacity: 1 }
          60% { transform: translateX(30%) skewX(-10deg); }
          100% { transform: translateX(120%) skewX(-10deg); opacity: 0;}
        }

        /* modal base */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 70;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px) saturate(1.05);
        }

        /* 3D open animation + float wiggle */
        @keyframes modalOpen {
          0% { transform: rotateX(75deg) translateY(60px) scale(.9); opacity: 0; }
          60% { transform: rotateX(-8deg) translateY(-10px) scale(1.02); opacity: 1; }
          100% { transform: rotateX(0deg) translateY(0) scale(1); opacity: 1; }
        }
        @keyframes modalFloat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes modalClose {
          0% { transform: rotateX(0deg) translateY(0) scale(1); opacity: 1; }
          100% { transform: rotateX(85deg) translateY(80px) scale(.95); opacity: 0; }
        }

        .modal-card {
          transform-style: preserve-3d;
          perspective: 1400px;
          animation: modalOpen 550ms cubic-bezier(.23,.9,.36,1) both;
        }
        .modal-card.closing {
          animation: modalClose 520ms cubic-bezier(.23,.9,.36,1) both;
        }
        .modal-floating {
          animation: modalFloat 4s ease-in-out infinite;
        }

        /* subtle wiggle for the card */
        @keyframes wiggle {
          0% { transform: rotateZ(-0.4deg); }
          50% { transform: rotateZ(0.5deg); }
          100% { transform: rotateZ(-0.4deg); }
        }

        .wiggle {
          animation: wiggle 6s ease-in-out infinite;
        }

        /* small entrance for image */
        @keyframes imgPop {
          0% { transform: translateZ(-60px) scale(.95); opacity: 0; }
          100% { transform: translateZ(0) scale(1); opacity: 1; }
        }
        .img-pop {
          animation: imgPop 520ms ease both;
        }

        /* gradient stroke circular SVG fallback for crisp border */
        .avatar-svg {
          display: block;
          width: 10rem;
          height: 10rem;
        }
      `}</style>

      
      <div className="text-center text-5xl text-bloodred-500 font-share mb-8">
        Members
      </div>

      <div className="flex flex-row w-full text-white px-8 py-4 gap-8 font-share">
        
        <aside className="sticky top-10 self-start flex-shrink-0 rounded-xl bg-[rgba(44,44,44,0.44)] p-6">
          
          <div className="relative">
            <div className="absolute left-8 top-6 bottom-6 w-[1px] bg-[#950C09]" />
            <h3 className="text-white font-semibold text-lg ml-12 mb-6">Categories</h3>

            <ul className="space-y-6">
              {categories.map((cat) => (
                <li key={cat.id} className="ml-12">
                  <button
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`relative flex items-center text-lg cursor-pointer px-3 py-1 transition-colors w-full text-left
                      ${selectedCategory === cat.label
                        ? "rounded-md bg-[rgba(217,217,217,0.25)] text-white"
                        : "text-gray-300 hover:text-white"}`}
                  >
                    <span className="absolute -left-12 w-8 h-[1px] bg-[#950C09]" />
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {filteredMembers.map((m, i) => (
              <div key={i} className="flex items-center justify-center">
                <button
                  onClick={() => openModal(members.indexOf(m))}
                  className="text-xl text-white font-medium px-6 py-4 rounded-md hover:bg-white/5 transition"
                >
                  {m.name}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      
      {isGlitchActive && (
        <div className="glitch-overlay" aria-hidden>
          <div className="glitch-bar" style={{ top: "18%" }} />
          <div className="glitch-bar" style={{ top: "40%", animationDelay: "80ms", height: 8 }} />
          <div className="glitch-bar" style={{ top: "60%", animationDelay: "160ms", height: 6 }} />
        </div>
      )}

      {isModalOpen && activeMemberIndex !== null && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-modal-title"
          onMouseDown={(e) => {
            
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={`modal-card modal-floating wiggle ${closing ? "closing" : ""}`}
            style={{ zIndex: 80, width: "min(92%, 1000px)" }}
          >
            <div className="bg-[#080808] rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
              <div className="flex-1 text-left text-white pr-2">
                <div className="flex items-center justify-between">
                  <h2 id="member-modal-title" className="text-3xl font-semibold">
                    {members[activeMemberIndex].name}
                  </h2>

                  <button
                    onClick={closeModal}
                    aria-label="Close"
                    className="ml-4 text-gray-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <p className="mt-2 text-gray-400">@{members[activeMemberIndex].username}</p>

                <p className="mt-6 text-xl text-gray-200 leading-relaxed">
                  {members[activeMemberIndex].notes}
                </p>

                <div className="mt-6">
                  <label className="block text-sm text-gray-300 mb-2">Tagline</label>
                  <TaglineEditor
                    index={activeMemberIndex}
                    tagline={members[activeMemberIndex].tagline}
                    onSave={(newTagline) => updateTagline(activeMemberIndex, newTagline)}
                  />
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <a
                    href={members[activeMemberIndex].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-[#C50400] rounded-md text-white hover:brightness-95"
                  >
                    View LinkedIn
                  </a>

                  <div className="text-sm text-gray-400">
                    <div>Fields:</div>
                    <div className="mt-1 flex gap-2 flex-wrap">
                      {members[activeMemberIndex].fields.map((f) => (
                        <span key={f} className="text-xs px-2 py-1 rounded bg-white/6">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center justify-center md:justify-end">
                <div className="rounded-full p-[3px] bg-gradient-to-br from-[#C50400] to-[#5F0200]">
                  <div className="w-44 h-44 rounded-full overflow-hidden bg-black img-pop">
                    <img
                      src={members[activeMemberIndex].picture}
                      alt={members[activeMemberIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


function TaglineEditor({ index, tagline, onSave }) {
  const [val, setVal] = useState(tagline || "");
  useEffect(() => setVal(tagline || ""), [tagline]);
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="bg-white/5 w-full rounded px-3 py-2 outline-none text-white"
        placeholder="Enter a short tagline"
      />
      <button
        onClick={() => onSave(val)}
        className="px-3 py-2 bg-[#0e0e0e] border border-[#C50400] rounded text-white hover:bg-[#1a0000]"
      >
        Save
      </button>
    </div>
  );
}

export default Members;
