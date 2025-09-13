import React, { useEffect, useState } from "react";

const About = () => {
  const [rankings, setRankings] = useState({ country: null, world: null });

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
            year: currentYear || "N/A",
            country: yearData.country_place || "N/A",
            world: yearData.rating_place || "N/A",
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
      <div className="text-center text-5xl text-bloodred-500 font-share">About</div>

      <div className="text-2xl text-bloodred-500 font-share max-md:mt-10 md:mx-20 mx-7 text-justify text-shadow-[0_1px_12.3px_#F00]">
        <span className="text-3xl">Dear Victim,</span>
        <br />
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; We are Ex0rcists, an academic CTF team incubated by St. Joseph’s
        Group of Institutions, India. Since our formation, we have carved a place in the global cybersecurity community
        through relentless participation, research, and competition. Ranked consistently among India’s best, our current
        standing is{" "}
        <strong className="italic">
          #{rankings.country || "…"} in India and #{rankings.world || "…"} worldwide
        {" "}
          (CTFtime {rankings.year}).</strong>
        <br />
        <br />
        Our journey is marked by a trail of challenges conquered across the globe. In 2025, we battled in prestigious
        arenas like Nullcon HackIM (Berlin & Goa), HITCON CTF, DiceCTF, Shakti CTF, CryptoCTF, DownUnderCTF, and secured
        strong finishes in ACECTF 1.0 (#32), BCACTF 6.0 (#37), TJCTF (#139), and VishwaCTF (#64). The year also
        witnessed us amassing thousands of CTF points in marquee events like CTF@CIT, Cyber Apocalypse 2025, and
        BlitzCTF, cementing our presence on the global scoreboard. Even before that, in 2024, Ex0rcists proved their
        strength at ASIS Finals, H7CTF International, IRON CTF, CYBERGON, Z3R0 D4Y CTF, and cruXipher at BITS Hyderabad,
        demonstrating resilience and consistency against the toughest of challenges.
        <br />
        <br />
        Our identity goes beyond rankings — we are a collective of hackers, builders, and defenders united by one
        mantra: "THE RITUAL BEGINS AT ROOT ACCESS." Every challenge we face is not just a problem to solve, but a
        vulnerability to exorcise. And with each flag captured, we sharpen our edge in the ever-evolving cyber
        battlefield.
      </div>

      <hr className="w-[75rem] max-w-full h-[0.125rem] mx-auto my-20 bg-bloodred-500" />
    </>
  );
};

export default About;
