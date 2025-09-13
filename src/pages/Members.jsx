import React, { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase"; 


const Members = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [members, setMembers] = useState([]);
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
  ]

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
        .modal-floating { animation: modalFloat 4s ease-in-out infinite; }
        @keyframes wiggle {
          0% { transform: rotateZ(-0.4deg); }
          50% { transform: rotateZ(0.5deg); }
          100% { transform: rotateZ(-0.4deg); }
        }
        .wiggle { animation: wiggle 6s ease-in-out infinite; }
        @keyframes imgPop {
          0% { transform: translateZ(-60px) scale(.95); opacity: 0; }
          100% { transform: translateZ(0) scale(1); opacity: 1; }
        }
        .img-pop { animation: imgPop 520ms ease both; }
      `}</style>

      <div className="text-center text-5xl text-bloodred-500 font-share mb-8">
        Members
      </div>

      <div className="flex md:flex-row flex-col w-full text-white px-8 py-4 gap-8 font-share">
        <aside className="hidden md:block flex-shrink-0 rounded-xl bg-[rgba(44,44,44,0.44)] p-6 sticky top-24 self-start">
          <div className="absolute left-10 top-6 bottom-6 w-[1px] bg-[#950C09]" />

          <ul className="space-y-8">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="relative flex items-center ml-14 text-gray-200 text-lg"
              >
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


        {/*Mobile */}
        <div className="md:hidden w-full flex items-center gap-2 mb-4 relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 px-2 py-1 bg-[#111]/60 rounded-full hover:bg-[#C50400] transition"
          >
            &lt;
          </button>
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-8"
          >
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


        {/* Member Cards */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {filteredMembers.map((m, i) => (
              <div
                key={i}
                onClick={() => openModal(members.indexOf(m))}
                className="cursor-pointer group bg-[#111]/40 rounded-xl p-4 flex flex-col items-center transition transform hover:scale-105 hover:shadow-[0_0_20px_rgba(197,4,0,0.6)]"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C50400] transition">
                  <img
                    src={m.picture}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-3 text-lg">{m.name}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Glitch overlay */}
      {isGlitchActive && (
        <div className="glitch-overlay" aria-hidden>
          <div className="glitch-bar" style={{ top: "18%" }} />
          <div
            className="glitch-bar"
            style={{ top: "40%", animationDelay: "80ms", height: 8 }}
          />
          <div
            className="glitch-bar"
            style={{ top: "60%", animationDelay: "160ms", height: 6 }}
          />
        </div>
      )}

      {/* Modal */}
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
            className={`modal-card modal-floating wiggle ${closing ? "closing" : ""
              }`}
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
                    className="inline-block px-4 py-2 bg-[#C50400] rounded-md text-white hover:brightness-95"
                  >
                    View LinkedIn
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

export default Members;
