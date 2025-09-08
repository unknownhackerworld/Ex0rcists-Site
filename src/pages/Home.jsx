import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

const Home = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);


  // Command outputs
  const commands = {
    help: `Welcome to Ex0rcists...
The Ritual Begins At Root Access...
Use these commands to see the site as gist....\n\n
⣿⣿⣿⢿⡿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣻⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡽⣯⣻⣻⡽⣿⣿⣿⣿⣿⣿⣿⣿⣿
⢿⡿⣿⣿⣿⣿⣿⣿⡿⣻⣻⣻⣻⣻⣻⡽⣯⣟⢷⠍⠟⠉⠛⢿⢿⣻⣻⢿⣿⣿⣯⣻⡽⣯⣻⣻⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣻⣻⣻⡟⡅⠀⠀⠀⠠⠀⠀⠆⡹⣻⣻⡽⣯⣻⡽⣯⣻⡽⣻⣻⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⡟⡛⡜⡜⣎⢦⢶⣖⡴⡀⠠⣿⣿⣿⣟⣟⣟⣟⣟⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣻⢆⢭⢎⢎⢞⡝⣝⡽⡽⡣⢂⣟⢯⢯⢯⣿⣻⣻⡽⣻⡽⣻⣻⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣟⢧⡒⡔⢆⢯⢎⠚⡜⡇⣼⣿⣿⣯⣻⣻⣻⣻⢯⣿⣿⣻⣻⣻⣻⢿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢹⢧⢣⢣⠡⡋⡯⣫⢯⡹⣹⣿⣿⣿⣿⣯⣻⣻⣻⣿⣿⣻⣻⣻⣿⣟⣟⢿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠧⢣⢢⢌⣍⡹⡽⣹⣽⣿⣿⣿⣿⣿⡽⣯⣻⢯⣻⢯⣻⣻⣿⣿⣿⣿⣻⣻
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡽⣍⢎⢎⢝⢏⢏⣝⢿⣿⣿⣿⣿⣿⣿⣻⡽⣯⣻⣻⣿⣿⣟⢿⣿⢿⣻⣻⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣟⣟⣟⡜⡜⡜⡝⡭⣫⢫⠂⢫⣿⣿⣿⣟⢯⣻⣻⣻⡽⣻⣿⣿⣿⣟⣿⣿⣿⣻⣟
⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⡿⡽⡻⡿⣇⢣⢣⠱⡱⡱⣽⣿⠀⠀⠀⠀⠐⢉⠍⡛⢿⢯⣻⣻⣿⣿⡿⣿⣿⣿⣿⣟⣟
⡿⣿⣿⣟⢿⣻⣻⡿⣏⢋⠀⠀⠀⣹⣻⡇⢣⠱⣥⣻⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣻⣿⣿⣿⣟⣟⣟
⣿⣿⢿⣻⣻⣻⡃⠀⠀⠀⠀⠀⠀⠠⠠⡣⢢⠱⡉⠙⠛⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣻⡽⣻⣿⢯⣻⣿⣿
⣿⣿⣿⡿⣟⣟⠄⠀⠀⠀⠀⠀⠀⠀⢀⢆⡑⠡⠉⠋⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣻⢯⣻⡽⣻⣻
⣿⣿⣿⣟⣟⡽⡄⠀⠀⠀⠀⠀⠀⠀⢀⠁⣯⠚⠹⠶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣻⢯⢯⣻⣿⣿
⣿⣿⣿⢿⣻⢯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⣟⠖⡖⡤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⢿⣻⣿⣻⣿⣿
⢿⣿⣿⡿⣻⣻⠀⠀⠀⠀⠀⠀⠀⠀⠀⢦⢢⣠⣀⠀⠀⠀⠀⠩⡛⡝⡜⡖⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣻⣿
⣿⡿⣿⣻⣻⣻⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡜⠈⠁⠀⠀⠀⠀⠀⠌⣌⢎⡜⡜⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣻
⣻⣻⣻⣻⡽⣻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢢⠣⠒⠀⠀⠀⠀⠀⠀⠎⢎⢎⢎⢎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣟⡽
⣟⣟⣟⣟⡽⡽⠀⡀⠀⠀⠀⠀⢀⢀⠀⠰⡰⠤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡝
⣿⣿⣻⡽⡽⣭⠂⠀⡰⡱⠡⠢⢂⠆⠀⢠⠰⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢯⢫
⡽⡽⡽⡽⣹⣝⢇⠄⠀⠀⠄⠄⠄⡐⠀⠄⡐⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡝⣝⡽⣹⢽⢯⡻⣻⣟⢯⢫
⣽⡽⣝⣝⣝⡝⣗⢭⢎⠀⠀⠂⠂⠀⠀⠀⡐⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣹⣝⣝⡝⣝⡽⡽⡹⣚⠵
⣻⢯⣫⢫⢫⣫⣻⢯⡳⡱⡱⡱⠀⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⡝⡝⡝⣝⡝⡝⡭⣫⢫⢭
⡿⡯⣫⢫⡹⡹⡽⡽⡹⡸⡜⡄⠀⠀⢀⢂⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡭⡭⣫⡹⡹⡭⣫⢫⢫⣚
haha, jokes on you, find it on your own`,

    ls: ` Ex0rcists.txt  passwd  logs`,

    "cat Ex0rcists.txt": ` Ex0rcists is a team of sharp, relentless hackers who thrive on challenges.
The group pushes boundaries, cracks puzzles, and treats hacking as both an art and a ritual.
Their motto: The Ritual Begins At Root Access.`,

    "cat passwd": {
      members : [
          {
            name: "Karthik",
            username: "K4RTH1K",
            linkedin: "https://linkedin.com/in/karthik",
            
            notes:
              "A notorious hacker who can solve almost any challenge with extraordinary talent.",
            fields: ["Web Exploitation", "Forensics"],
            tagline: "Root or nothing.",
          },
          {
            name: "Shyamalavannan G",
            username: "Shyam",
            linkedin: "https://linkedin.com/in/shyamalavannan",
            
            notes:
              "The second pillar of Ex0rcists, a strategist with precision and calm under pressure.",
            fields: ["OSINT", "Reverse Engineering"],
            tagline: "Silent, precise.",
          },
          {
            name: "Praveen S",
            username: "Praveen",
            linkedin: "https://linkedin.com/in/praveens",
            
            notes: "Expert in deep system analysis and breaking binaries.",
            fields: ["Reverse Engineering", "Steganography"],
            tagline: "Reverse engineer by trade.",
          },
          {
            name: "Janish Andrin",
            username: "Janish",
            linkedin: "https://linkedin.com/in/janish",
            
            notes: "The offensive powerhouse, master of exploitation.",
            fields: ["Pwn", "Web Exploitation"],
            tagline: "Exploit first, ask later.",
          },
          {
            name: "Shakthi Vikranth",
            username: "Shaz",
            linkedin: "https://linkedin.com/in/shaz",
            
            notes: "Master at uncovering digital trails and hidden evidence.",
            fields: ["Forensics"],
            tagline: "Trace it, prove it.",
          },
          {
            name: "Mr Robot",
            username: "fsociety",
            linkedin: "https://linkedin.com/in/shaz",
            
            notes: "Master at uncovering digital trails and hidden evidence.",
            fields: ["Reverse Engineering"],
            tagline: "Trace it, prove it.",
          },
          {
            name: "Mr Robot",
            username: "fsociety",
            linkedin: "https://linkedin.com/in/shaz",
            
            notes: "Master at uncovering digital trails and hidden evidence.",
            fields: ["OSINT"],
            tagline: "Trace it, prove it.",
          },
          {
            name: "Mr Robot",
            username: "fsociety",
            linkedin: "https://linkedin.com/in/shaz",
            
            notes: "Master at uncovering digital trails and hidden evidence.",
            fields: ["Pwn"],
            tagline: "Trace it, prove it.",
          },
          {
            name: "Mr Robot",
            username: "fsociety",
            linkedin: "https://linkedin.com/in/shaz",
            
            notes: "Master at uncovering digital trails and hidden evidence.",
            fields: ["Steganography"],
            tagline: "Trace it, prove it.",
          },
          {
            name: "Mr Robot",
            username: "fsociety",
            linkedin: "https://linkedin.com/in/shaz",
            
            notes: "Master at uncovering digital trails and hidden evidence.",
            fields: ["Web Exploitation"],
            tagline: "Trace it, prove it.",
          }, {
            name: "Mr Robot",
            username: "fsociety",
            linkedin: "https://linkedin.com/in/shaz",
            
            notes: "Master at uncovering digital trails and hidden evidence.",
            fields: ["Reverse Engineering"],
            tagline: "Trace it, prove it.",
          },
      
      
        ]
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
            output: append
              ? last.output + text.charAt(i)  // Only append the current character
              : text.substring(0, i + 1),     // Build from beginning for new text
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
    // remove auto scroll completely
    inputRef.current?.focus();
  }, [history, typing]);



  return (
    <>
      <div className="flex flex-col md:flex-row w-full items-center justify-center px-4 md:px-6 lg:px-8 mt-10">
        {/* Logo Section */}
        <div className="flex-1 flex justify-center items-center relative w-full max-w-sm md:max-w-md lg:max-w-lg">
          <img
            src={logo}
            alt="Ex0rcists Logo"
            className="max-h-60 md:max-h-80 lg:max-h-120 object-contain saturate-150 drop-shadow-2xl
            brightness-150 hover:scale-105 transition-transform duration-300 z-10"
            id="logo_home_1"
          />
          <img
            src={logo}
            alt="Ex0rcists Logo"
            className="absolute max-h-60 md:max-h-80 lg:max-h-120 object-contain saturate-150 drop-shadow-2xl
            brightness-150 blur-[7px] z-0 transition-transform duration-300"
            id="logo_home_2"
          />
        </div>

        {/* Terminal Section */}
        <div
          id="terminal"
          className="flex-1 md:flex-[1.3] max-w-full md:max-w-[50rem] md:h-112 rounded-2xl border border-[#730000] 
          bg-black text-white p-6 md:p-8 mt-8 md:mt-10 ml-0 md:ml-8 mr-0 md:mr-4 font-kode text-base md:text-xl 
          leading-normal overflow-y-auto scrollbar-hide"
        >
          {history.map((item, index) => (
            <div key={index} className="mb-4">
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

          {/* Current Input */}
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
              className="bg-transparent outline-none font-kode w-[90%] sm:w-auto"
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Divider */}
      <hr className="w-full md:w-[75rem] h-[0.125rem] mx-auto my-12 md:my-20 bg-bloodred-500" />
    </>
  );
};

export default Home;
