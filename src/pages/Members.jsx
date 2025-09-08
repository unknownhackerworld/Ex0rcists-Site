import React from "react";

const Members = () => {
  const members = [
    { name: "Karthik", img: "src/assets/members/karthik.jpeg" },
    { name: "Shyamalavannan G", img: "src/assets/members/shyam.jpeg" },
    { name: "Praveen S", img: "src/assets/members/praveen.jpeg" },
    { name: "Janish Andrin", img: "src/assets/members/janish.jpeg" },
    { name: "Shakthi Vikranth", img: "src/assets/members/shaz.jpeg" },
    { name: "Mr. Robot", img: "src/assets/members/fsociety.jpeg" },
    { name: "Mr. Robot", img: "src/assets/members/fsociety.jpeg" },
    { name: "Mr. Robot", img: "src/assets/members/fsociety.jpeg" },
    { name: "Mr. Robot", img: "src/assets/members/fsociety.jpeg" },
    { name: "Mr. Robot", img: "src/assets/members/fsociety.jpeg" },
  ];
  const categories = [
    { id: "all", label: "All" },
    { id: "web", label: "Web Exploitation" },
    { id: "osint", label: "OSINT" },
    { id: "re", label: "Reverse Engineering" },
    { id: "pwn", label: "Pwn" },
    { id: "steg", label: "Steganography" },
    { id: "forensics", label: "Forensics" },
  ]

  return (
    <>
      {/* Title */}
      <div className="text-center text-5xl text-bloodred-500 font-share">
        Members
      </div>

      <div className="flex flex-row w-full text-white px-8 py-10 gap-8 font-share">
        {/* Sidebar */}
        {/* Sidebar */}
        <div className="w-64 md:w-72 lg:w-80 flex-shrink-0 rounded-xl bg-[rgba(44,44,44,0.44)] p-9 sticky top-10 self-start">
          {/* Vertical backbone line */}
          <div className="absolute left-10 top-6 bottom-6 w-[1px] bg-[#950C09]" />

          <ul className="space-y-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="relative flex items-center ml-14 text-gray-200 text-xl text-left cursor-pointer"
              >
                {/* Horizontal branch line */}
                <span className="absolute -left-12 w-10 h-[1px] bg-[#950C09]" />
                {cat.label}
              </button>
            ))}
          </ul>
        </div>


        {/* Members */}
        <div className="flex-1 grid grid-cols-3 gap-10 p-6">
          {members.map((m, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Gradient Border Wrapper */}
              <div className="p-[2px] rounded-full bg-gradient-to-br from-[#C50400] to-[#5F0200]">
                {/* Inner Circle */}
                <div className="w-40 h-40 rounded-full overflow-hidden bg-black">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="mt-3 text-white text-2xl font-medium">{m.name}</p>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default Members;
