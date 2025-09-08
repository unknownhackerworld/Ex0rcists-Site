import React, { useState, useEffect, useRef } from "react";

const Home = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);


  // Command outputs
  const commands = {
    help: ` Welcome to Ex0rcists...
The Ritual Begins At Root Access...
Use these commands to see the site as gist....\n\nhaha, jokes on you, find it on your own`,

    ls: ` Ex0rcists.txt  passwd  logs`,

    "cat Ex0rcists.txt": ` Ex0rcists is a team of sharp, relentless hackers who thrive on challenges.
The group pushes boundaries, cracks puzzles, and treats hacking as both an art and a ritual.
Their motto: The Ritual Begins At Root Access.`,

    "cat passwd": {
      members: [
        {
          name: "Karthik",
          username: "K4RTH1K",
          linkedin: "https://linkedin.com/in/karthik",
          picture: "src/assets/members/karthik.jpg",
          notes:
            "A notorious hacker who can solve almost any challenge with extraordinary talent.",
        },
        {
          name: "Shyamalavannan G",
          username: "Shyam",
          linkedin: "https://linkedin.com/in/shyamalavannan",
          picture: "src/assets/members/shyam.jpg",
          notes:
            "The second pillar of Ex0rcists, a strategist with precision and calm under pressure.",
        },
      ],
    },

    "cat logs": `Check the writeups below. Every exploit leaves a trace...`,
  };

  const roasts = [
    "Nice try... but that's not even close 🫠",
    "You type like my grandma coding in COBOL 🤣",
    "Invalid command. Maybe sudo your brain?",
    "That’s not a bug, that’s you being wrong 💀",
    "You remind me of a Windows update… unexpected and useless 😏",
    "Congratulations! You just found nothing!! ..... 😵‍💫",
  ];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [history, typing]);

  const getRoast = () =>
    roasts[Math.floor(Math.random() * roasts.length)];

  const typeWriter = (text, callback, append = false) => {
    setTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        const updated = prev.slice(0, -1);

        return [
          ...updated,
          {
            ...last,
            output: (append ? last.output : "") + text.substring(0, i + 1),
          },
        ];
      });

      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(false);
        if (callback) callback();
      }
    }, 30);
  };



  // Handle commands
  const handleCommand = (cmd) => {
    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    if (commands[cmd]) {
      if (cmd === "help") {
        const parts = commands[cmd].split("\n\n");

        setHistory((prev) => [...prev, { command: cmd, output: "" }]);

        typeWriter(parts[0], () => {
          setTimeout(() => {
            typeWriter("\n\n" + parts[1], null, true, 15);
          }, 1000);
        });
      }


     else if (cmd === "cat passwd" && typeof commands[cmd] === "object") {
        const formattedJSX = commands[cmd].members.map((m, i) => (
          <div key={i} className="mb-4">
            <div><strong>Name:</strong> {m.name}</div>
            <div><strong>Username:</strong> {m.username}</div>
            <div>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {m.linkedin}
              </a>
            </div>
            <div><strong>Notes:</strong> {m.notes}</div>
            {i < commands[cmd].members.length - 1 && <hr className="border-gray-600 my-2" />}
          </div>
        ));

        setHistory((prev) => [...prev, { command: cmd, output: formattedJSX }]);
      }

 else if (typeof commands[cmd] === "object") {
        setHistory((prev) => [
          ...prev,
          { command: cmd, output: JSON.stringify(commands[cmd], null, 2) },
        ]);
      } else {
        setHistory((prev) => [...prev, { command: cmd, output: "" }]);
        typeWriter(commands[cmd]);
      }
    } else {
      const roast = getRoast();
      setHistory((prev) => [...prev, { command: cmd, output: roast }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !typing) {
      handleCommand(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, typing]);

  return (
    <>
    <div className="flex flex-row md: w-full items-center justify-center  px-8">
      <div className="flex-1 flex justify-center items-center">
        <img
          src="src/assets/logo.png"
          alt="Ex0rcists Logo"
          className="absolute max-h-120 object-contain saturate-150 drop-shadow-2xl
    brightness-150 hover:scale-105 transition-transform duration-300 z-10"
          id="logo_home_1"
        />
        <img
          src="src/assets/logo.png"
          alt="Ex0rcists Logo"
          className="absolute max-h-120 object-contain saturate-150 drop-shadow-2xl
    brightness-150 blur-[7px] z-0 transition-transform duration-300"
          id="logo_home_2"
        />
      </div>

      {/* Right Terminal */}
      <div
        id="terminal"
        className="flex-1 max-w-[47rem] h-[29.875rem] rounded-[2.25rem] border border-[#730000] bg-black text-white p-10 mt-10 font-kode text-[1.25rem] leading-normal overflow-y-auto scrollbar-hide"
      >
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <span>
              ┌──(
              <span className="text-[#C50400]">uh4ck3r</span>㉿
              <span className="text-[#009D15]">Ex0rcists</span>)-[~]
            </span>
            <br />
            <span>└─$ {item.command}</span>
            <pre className="mt-1 whitespace-pre-wrap">{item.output}</pre>
          </div>
        ))}

        {/* Current input */}
        <div>
          <span>
            ┌──(
            <span className="text-[#C50400]">uh4ck3r</span>㉿
            <span className="text-[#009D15]">Ex0rcists</span>)-[~]
          </span>
          <br />
          <span>└─$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={typing}
            className="bg-transparent outline-none font-kode"
          />

        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
      <hr className="w-[75rem] max-w-full h-[0.125rem] mx-auto my-20 bg-bloodred-500" />
    </>
  );
};

export default Home;
