import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const About = () => {
  const [rankings, setRankings] = useState({ country: null, world: null, year: "N/A" });

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch(
          "https://api.allorigins.win/raw?url=https://ctftime.org/api/v1/teams/311156/"
        );
        const data = await res.json();
        const currentYear = new Date().getFullYear();
        const yearData = data.rating[currentYear];

        if (yearData) {
          setRankings({
            year: currentYear,
            country: yearData.country_place || "…",
            world: yearData.rating_place || "…",
          });
        }
      } catch (err) {
        console.error("Failed to fetch CTFtime ranking:", err);
      }
    };

    fetchRanking();
  }, []);

  return (
    <>
      <div className="text-center text-5xl text-bloodred-500 font-share mb-12">About Us</div>

      <div className="flex flex-col md:flex-row items-center font-share justify-center gap-10 px-8 md:px-20">
        {/* Left Side - Text */}
        <div className="flex-1 text-justify text-lg text-gray-200 font-main space-y-6">
          <p>
            We are <span className="text-bloodred-500 font-semibold">Ex0rcists</span>, an academic CTF team incubated by{" "}
            St. Joseph’s Group of Institutions, India. Since our formation, we have carved a place in the global
            cybersecurity community through relentless participation, research, and competition.
          </p>

          <p>
            Ranked consistently among India’s best, our current standing is{" "}
            <strong className="italic text-bloodred-500">
              #{rankings.country || "…"} in India and #{rankings.world || "…"} worldwide (CTFtime{" "}
              {rankings.year || "N/A"}).
            </strong>
          </p>

          <p>
            Our journey has taken us through prestigious arenas like Nullcon HackIM, HITCON CTF, DiceCTF, Shakti CTF,
            CryptoCTF, DownUnderCTF, ACECTF, BCACTF, TJCTF, and VishwaCTF — where we secured strong finishes and
            consistently proved our resilience.
          </p>

          <p>
            Our identity goes beyond rankings — we are hackers, builders, and defenders united by one mantra:{" "}
            <span className="text-bloodred-500 font-semibold">"THE RITUAL BEGINS AT ROOT ACCESS."</span>
          </p>

          {/* Mission / What We Do / Initiatives */}
          <div className="space-y-6 mt-10">
            <div className="bg-[rgba(26,31,46,0.5)] border border-[rgba(148,163,184,0.25)] rounded-xl p-6">
              <h2 className="text-2xl text-bloodred-500 font-share mb-3">Mission</h2>
              <p>
                To explore cutting-edge security, sharpen practical expertise, and exorcise vulnerabilities across
                software and hardware systems.
              </p>
            </div>

            <div className="bg-[rgba(26,31,46,0.5)] border border-[rgba(148,163,184,0.25)] rounded-xl p-6">
              <h2 className="text-2xl text-bloodred-500 font-share mb-3">What We Do</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Capture-The-Flag (CTF) competitions & training</li>
                <li>Security research in cryptography & systems</li>
                <li>Hardware & software security analysis</li>
                <li>Workshops, mentorship, and knowledge sharing</li>
              </ul>
            </div>

            <div className="bg-[rgba(26,31,46,0.5)] border border-[rgba(148,163,184,0.25)] rounded-xl p-6">
              <h2 className="text-2xl text-bloodred-500 font-share mb-3">Initiatives</h2>
              <p>
                We organize flagship events and challenges, fostering collaboration and pushing boundaries in
                cybersecurity innovation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center relative flicker-logo">
          <img
            src={logo}
            alt="Ex0rcists Logo"
            className="max-h-60 md:max-h-80 max-w-xs md:max-w-sm lg:max-w-md lg:max-h-120 object-contain saturate-150 drop-shadow-2xl
            brightness-150 hover:scale-105 transition-transform duration-300 z-10"
            id="logo_home_1"
          />
          <img
            src={logo}
            alt="Ex0rcists Logo"
            className="absolute max-h-60 max-w-xs md:max-w-sm lg:max-w-md md:max-h-80 lg:max-h-120 object-contain saturate-150 drop-shadow-2xl
            brightness-150 blur-[7px] z-0 transition-transform duration-300"
            id="logo_home_2"
          />
        </div>
      </div>

      <hr className="w-[75rem] max-w-full h-[0.125rem] mx-auto my-20 bg-bloodred-500" />
    </>
  );
};

export default About;
