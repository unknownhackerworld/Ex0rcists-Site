import React, { useMemo, useRef, useEffect } from "react";
import "animate.css";
import achievementsData from "../data/achievements.json";

const getPositionEmoji = (position) => {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  if (position === 0) return "🏅";
  return `🏆 ${position}`;
};

const AchievementsPage = () => {
  const achievements = useMemo(
    () =>
      [...achievementsData].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    []
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Calculate statistics from all achievements
  const statistics = useMemo(() => {
    const totalCount = achievementsData.length;
    const totalPrize = achievementsData.reduce((sum, ach) => {
      if (!ach.prize || ach.prize === "—" || ach.prize === "-") return sum;
      // Remove commas and parse the prize value
      const prizeValue = parseInt(ach.prize.replace(/,/g, ""), 10) || 0;
      return sum + prizeValue;
    }, 0);
    
    // Calculate 1st position percentage
    const firstPositionCount = achievementsData.filter(
      (ach) => ach.position === 1
    ).length;
    const firstPositionPercentage =
      totalCount > 0 ? ((firstPositionCount / totalCount) * 100).toFixed(1) : 0;
    
    return { totalCount, totalPrize, firstPositionCount, firstPositionPercentage };
  }, []);

  const eventRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("animate__animated");
            el.classList.add(el.dataset.anim); // fadeInLeft / fadeInRight
            el.style.opacity = 1;
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    eventRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const getType = (idx) => (idx % 3) + 1;

  const getTypeClasses = (t) => {
    const styles = {
      1: {
        icon: "bg-gradient-to-br from-[#8a0000] via-[#C50400] to-[#ff1a1a]",
        date: "bg-gradient-to-r from-[#520000] to-[#8a0000] text-red-200",
        title: "text-[#ff3b3b]",
        glow: "shadow-[0_0_20px_4px_rgba(197,4,0,0.45)]",
        line: "bg-gradient-to-b from-[#C50400] to-[#7a0000]",
      },
      2: {
        icon: "bg-gradient-to-br from-[#400000] via-[#7f0505] to-[#ae0000]",
        date: "bg-gradient-to-r from-[#360000] to-[#5c0000] text-red-100",
        title: "text-[#ff5f5f]",
        glow: "shadow-[0_0_18px_3px_rgba(150,0,0,0.35)]",
        line: "bg-gradient-to-b from-[#7f0505] to-[#4b0000]",
      },
      3: {
        icon: "bg-gradient-to-br from-[#190000] via-[#550000] to-[#C50400]",
        date: "bg-gradient-to-r from-[#340000] to-[#550000] text-red-200",
        title: "text-[#ff1a1a]",
        glow: "shadow-[0_0_25px_5px_rgba(255,0,0,0.4)]",
        line: "bg-gradient-to-b from-[#C50400] to-[#550000]",
      },
    };
    return styles[t] || styles[1];
  };

  return (
    <section className="w-full text-white py-16 px-4 md:px-10 lg:px-20">
      {/* Header */}
      <div className="text-center mb-12 animate__animated animate__fadeInDown">
        <h2 className="text-4xl md:text-5xl font-share tracking-[0.25em] text-red-600 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)] uppercase">
          Achievements
        </h2>

        <p className="mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Rituals. Exploits. Flags claimed across global battlegrounds — the
          legacy of Ex0rcists.
        </p>
      </div>

      {/* Statistics */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Total Events */}
          <div className="bg-[#0a0a0f]/80 backdrop-blur-md border border-red-900/40 rounded-xl p-6 md:p-8 shadow-[0_0_25px_rgba(255,0,0,0.25)] text-center">
            <div className="text-4xl md:text-5xl font-share text-bloodred-500 font-semibold mb-2 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
              {statistics.totalCount}+
            </div>
            <div className="text-sm md:text-base text-gray-300 font-share tracking-wide uppercase">
              Total Events
            </div>
          </div>

          {/* Total Prize Amount */}
          <div className="bg-[#0a0a0f]/80 backdrop-blur-md border border-red-900/40 rounded-xl p-6 md:p-8 shadow-[0_0_25px_rgba(255,0,0,0.25)] text-center">
            <div className="text-4xl md:text-5xl font-share text-emerald-400 font-semibold mb-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">
              ₹{statistics.totalPrize.toLocaleString("en-IN")}+
            </div>
            <div className="text-sm md:text-base text-gray-300 font-share tracking-wide uppercase">
              Total Prize Amount
            </div>
          </div>

          {/* 1st Position Percentage */}
          <div className="bg-[#0a0a0f]/80 backdrop-blur-md border border-red-900/40 rounded-xl p-6 md:p-8 shadow-[0_0_25px_rgba(255,0,0,0.25)] text-center">
            <div className="text-4xl md:text-5xl font-share text-yellow-400 font-semibold mb-2 drop-shadow-[0_0_12px_rgba(250,204,21,0.45)]">
              {statistics.firstPositionPercentage}%
            </div>
            <div className="text-sm md:text-base text-gray-300 font-share tracking-wide uppercase">
              1st Position Rate
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ({statistics.firstPositionCount}/{statistics.totalCount})
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline flex flex-col mx-auto relative">
        {achievements.map((ach, idx) => {
          const isOdd = idx % 2 === 0;
          const type = getType(idx);
          const c = getTypeClasses(type);

          // Animation based on side
          const anim =
            isOdd ? "animate__fadeInRight" : "animate__fadeInLeft";

          const dateText = new Date(ach.date).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          });

          return (
            <div
              key={`${ach.title}-${ach.date}-${idx}`}
              data-anim={anim}
              ref={(el) => (eventRefs.current[idx] = el)}
              className={`timeline__event flex relative mb-8 md:mb-12 rounded-md 
                self-center w-full md:w-[50vw] 
                ${isOdd ? "flex-row-reverse" : ""}
              `}
              style={{
                opacity: 0,
                animationDuration: "0.9s",
              }}
            >
              {/* ICON */}
              <div
                className={`timeline__event__icon 
                  ${c.icon} ${c.glow}
                  flex items-center justify-center
                  self-center mx-4 md:mx-5 rounded-full
                  w-12 h-12 md:w-16 md:h-16 relative
                  border border-red-800/40
                  shadow-[inset_0_0_12px_rgba(255,0,0,0.4)]
                `}
              >
                <span className="absolute w-2 h-2 rounded-full bg-red-300 shadow-[0_0_8px_rgba(255,80,80,0.9)]" />

                {idx < achievements.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-[3px] ${c.line}`}
                    style={{
                      height: "calc(100% + 4rem)",
                      borderRadius: "2px",
                    }}
                  />
                )}

                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[3px] w-24 ${c.line}
                  ${isOdd ? "right-full" : "left-full"} rounded-sm`}
                />
              </div>

              {/* DATE */}
              <div
                className={`timeline__event__date 
                ${c.date}
                border border-red-900/40
                text-lg md:text-xl font-semibold
                px-5 md:px-7 py-5 md:py-6 flex items-center justify-center
                tracking-wider font-share backdrop-blur-md
                ${isOdd ? "rounded-r-md" : "rounded-l-md"}
                shadow-[0_0_20px_rgba(255,0,0,0.4),0_0_40px_rgba(197,4,0,0.3)]
                `}
              >
                {dateText}
              </div>

              {/* CONTENT */}
              <div
                className={`timeline__event__content 
                  bg-[#0a0a0f]/80 backdrop-blur-md 
                  border border-red-900/40 
                  shadow-[0_0_25px_rgba(255,0,0,0.25)]
                  p-5 md:p-6 flex-1 min-w-0
                  ${isOdd ? "rounded-l-md" : "rounded-r-md"}
                `}
              >
                <div
                  className={`${c.title} text-lg md:text-xl font-share font-semibold tracking-wide mb-2 drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]`}
                >
                  {ach.title}
                </div>

                {ach.position !== undefined && (
                  <p className="text-xs md:text-sm text-yellow-400 mb-2 font-semibold">
                    {getPositionEmoji(ach.position)} Position:{" "}
                    {ach.position === 0
                      ? "Finalist"
                      : ach.position === 1
                      ? "1st"
                      : ach.position === 2
                      ? "2nd"
                      : ach.position === 3
                      ? "3rd"
                      : `${ach.position}th`}
                  </p>
                )}

                <div className="timeline__event__description text-xs md:text-sm leading-relaxed text-gray-300">
                  {ach.description && (
                    <p className="mb-3">{ach.description}</p>
                  )}

                  {ach.members && (
                    <p className="text-gray-300 mb-2">
                      <span className="font-semibold text-red-400">Team:</span>{" "}
                      {Array.isArray(ach.members)
                        ? ach.members.join(", ")
                        : ach.members}
                    </p>
                  )}

                  {ach.prize && ach.prize !== "—" && (
                    <p className="mt-2 text-emerald-300 font-semibold text-xs md:text-sm">
                      💰 Prize: ₹{ach.prize}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AchievementsPage;
