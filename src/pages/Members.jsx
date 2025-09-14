import React, { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

const Members = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [members, setMembers] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    const membersRef = ref(database, "members");
    const unsubscribe = onValue(membersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data).map((key) => ({
          name: key,
          username: data[key].displayName || key,
          linkedin: data[key].LinkedIn || "",
          picture: data[key].ProfilePic || "",
          notes: data[key].Description || "",
          fields: data[key].Categories || [],
          tagline: data[key].TagLine || "",
        }));
        setMembers(formatted);
      } else {
        setMembers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { id: "all", label: "All" },
    { id: "web", label: "Web Exploitation" },
    { id: "osint", label: "OSINT" },
    { id: "re", label: "Reverse Engineering" },
    { id: "pwn", label: "Pwn" },
    { id: "steg", label: "Steganography" },
    { id: "forensics", label: "Forensics" },
  ];

  const [activeMemberIndex, setActiveMemberIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [closing, setClosing] = useState(false);

  const filteredMembers =
    selectedCategory === "All"
      ? members
      : members.filter((m) => m.fields.includes(selectedCategory));


  const openModal = (index) => {
    setFlippedIndex(index);
    setTimeout(() => {
      setActiveMemberIndex(index);
      setIsGlitchActive(true);
      setTimeout(() => {
        setIsModalOpen(true);
        setIsGlitchActive(false);
        setFlippedIndex(null); 
      }, 300);
    }, 600); 
  };




  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -clientWidth / 2 : clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setActiveMemberIndex(null);
      setClosing(false);
    }, 650);
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
        /* Glitch Effect */
        .glitch-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 60;
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

        /* Flip Animation */
        .perspective { perspective: 1200px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }

        @keyframes flipOnce {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.1); filter: blur(1px); }
          100% { transform: rotateY(180deg) scale(0.9); filter: blur(3px); opacity: 0; }
        }

        .flip-spin {
          animation: flipOnce 0.85s cubic-bezier(0.55, 0.3, 0.4, 0.9) forwards;
        }

        /* Modal */
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
        @keyframes modalFade {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-card {
          animation: modalFade 0.6s ease-out both;
        }
      `}</style>

      <div className="text-center text-5xl text-bloodred-500 font-share mb-8">
        Members
      </div>

      <div className="flex md:flex-row flex-col w-full text-white px-8 py-4 gap-8 font-share">
        {/* Sidebar */}
        <aside className="hidden md:block flex-shrink-0 rounded-xl bg-[rgba(44,44,44,0.44)] p-6 sticky top-24 self-start">
          <div className="absolute left-10 top-6 bottom-6 w-[1px] bg-[#950C09]" />
          <ul className="space-y-8">
            {categories.map((cat) => (
              <li key={cat.id} className="relative flex items-center ml-14 text-gray-200 text-lg">
                <span className="absolute -left-10 w-8 h-[1px] bg-[#950C09]" />
                <button
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`px-2 py-1 transition-colors ${selectedCategory === cat.label
                      ? "text-white font-semibold"
                      : "text-gray-300 hover:text-white"
                    }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile Scrollable Categories */}
        <div className="md:hidden w-full flex items-center gap-2 mb-4 relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 px-2 py-1 bg-[#111]/60 rounded-full hover:bg-[#C50400] transition"
          >
            &lt;
          </button>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition ${selectedCategory === cat.label
                    ? "bg-gradient-to-r from-[#C50400] to-[#5F0200] text-white border-transparent"
                    : "border-[#950C09] text-gray-300 hover:text-white hover:border-white"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 px-2 py-1 bg-[#111]/60 rounded-full hover:bg-[#C50400] transition"
          >
            &gt;
          </button>
        </div>

        {/* Cards */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {filteredMembers.map((m, i) => (
              <div
                key={i}
                onClick={() => openModal(i)}
                className="relative cursor-pointer perspective"
              >
                <div
                  className={`transition-transform duration-700 preserve-3d ${flippedIndex === i ? "rotate-y-180 scale-110" : ""
                    }`}
                >
                  <div className="backface-hidden">
                    <div className="group bg-[#111]/40 rounded-xl p-4 flex flex-col items-center 
        transition hover:scale-105 hover:shadow-[0_0_20px_rgba(197,4,0,0.6)] md:saturate-0 hover:saturate-100 duration-500"
                    >
                      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C50400] transition">
                        <img
                          src={m.picture}
                          alt={m.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <p className="mt-3 text-lg">{m.name}</p>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180 text-white text-lg font-semibold rounded-xl bg-black">
                    @{m.username}
                  </div>
                </div>
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
            className={`modal-card ${closing ? "closing" : ""}`}
            style={{ zIndex: 80, width: "min(92%, 1000px)" }}
          >
            <div className="bg-[#080808] rounded-2xl  p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch shadow-[0_0_20px_rgba(197,4,0,0.6)]">
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
                <p className="mt-2 text-gray-400">
                  @{members[activeMemberIndex].username}
                </p>
                <p className="mt-4 italic text-2xl text-[#C50400] font-serif">
                  {members[activeMemberIndex].tagline}
                </p>
                <p className="mt-6 text-lg text-gray-200 leading-relaxed">
                  {members[activeMemberIndex].notes}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <a
                    href={members[activeMemberIndex].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-2 rounded-md hover:brightness-110 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 382 382"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="text-[#C50400]"
                    >
                      <path
                        d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889
         C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056
         H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806
         c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1
         s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73
         c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079
         c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426
         c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472
         L341.91,330.654L341.91,330.654z"
                      />
                    </svg>
                  </a>

                  <div className="text-sm text-gray-400">
                    <div>Fields:</div>
                    <div className="mt-1 flex gap-2 flex-wrap">
                      {members[activeMemberIndex].fields.map((f) => (
                        <span
                          key={f}
                          className="text-xs px-2 py-1 rounded bg-white/6"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center justify-center md:justify-end">
                <div className="rounded-full p-[3px] bg-gradient-to-br from-[#C50400] to-[#5F0200]">
                  <div className="w-44 h-44 rounded-full overflow-hidden bg-black">
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

export default Members;
