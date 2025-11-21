import React from "react";
import WaveTimeline from "../components/WaveTimeline";
import { Link } from "react-router-dom";

const Achievements = () => {
  return (
    <><div className="text-center">
      <h1 className="text-5xl font-share text-bloodred-500 mb-10">
        Achievements
      </h1>

      <WaveTimeline />
      <Link to="/achievements"><div className="h-10 text-3xl font-share text-bloodred-500"><span className="animate-pulse-glow-text underline underline-offset-5">View All Our Achievements here</span></div></Link>
    </div><hr class="w-full md:w-[75rem] h-[0.125rem] mx-auto mb-12 mt-8 md:mb-20 md:mt-8 bg-bloodred-500"></hr></>
  );
};

export default Achievements;
