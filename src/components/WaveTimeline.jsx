import React, { useMemo, useRef, useState, useEffect } from "react";
import achievementsData from "../data/achievements.json";

// Helper function to get position emoji
const getPositionEmoji = (position) => {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  if (position === 0) return "🏅";
  return `🏆 ${position}`;
};

const WaveTimeline = () => {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const summaryRef = useRef(null);
  const [visibleBoxes, setVisibleBoxes] = useState(new Set());
  const [summaryVisible, setSummaryVisible] = useState(false);

  
  const A = 60;              
  const X_SCALE = 120;        
  const LEFT_PADDING = 100;  
  const RIGHT_PADDING = 200; 
  const tBase = Math.PI / 2; 
  const BOX_OFFSET = 180;    
  const BOX_WIDTH = 256; 
  const TOTAL_HEIGHT = 800;  
  const K = TOTAL_HEIGHT / 2;   
  
  const sortedAchievements = useMemo(() => {
    return [...achievementsData]
      .filter((ach) => ach.priority === 1)
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
  }, []);

  const totals = useMemo(() => {
    const totalCount = achievementsData.length;
    const totalPrize = achievementsData.reduce((sum, ach) => {
      const prizeValue = parseInt(ach.prize.replace(/,/g, ''), 10) || 0;
      return sum + prizeValue;
    }, 0);
    return { totalCount, totalPrize };
  }, [achievementsData]);
  
  const positions = useMemo(() => {
    return sortedAchievements.map((_, i) => {
      const t = tBase + i * Math.PI;
      const x = LEFT_PADDING + X_SCALE * t;
      const waveY = K + A * Math.sin(t); 
      const isCrest = i % 2 === 0;
      
      const boxY = waveY + (isCrest ? BOX_OFFSET-140 : -BOX_OFFSET-20);
      
      const connectorHeight = (isCrest ? 100 : BOX_OFFSET+20);
      return { t, x, waveY, boxY, isCrest, connectorHeight };
    });
  }, [sortedAchievements]);

  
  const tMax = useMemo(() => {
    return positions.length > 0 
      ? positions[positions.length - 1].t + Math.PI 
      : tBase + Math.PI;
  }, [positions]);

  const totalWidth = LEFT_PADDING + X_SCALE * tMax + RIGHT_PADDING;

  const wavePath = useMemo(() => {
    let d = `M 0 ${K}`;
    const step = 0.05; 
    for (let t = 0; t <= tMax; t += step) {
      const x = LEFT_PADDING + X_SCALE * t;
      const y = K + A * Math.sin(t);
      d += ` L ${x} ${y}`;
    }
    return d;
  }, [tMax]);

  
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      const el = containerRef.current;
      const section = sectionRef.current;
      if (!el || !section) return;

      const sectionRect = section.getBoundingClientRect();
      const inside =
        e.clientY >= sectionRect.top &&
        e.clientY <= sectionRect.bottom;

      if (!inside) return;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const atEnd = el.scrollLeft >= maxScrollLeft - 5;

      const animationStopped = animationFrameId === null;

      if (!animationStopped && !atEnd && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };


    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, []);

  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const checkVisibility = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const boxes = document.querySelectorAll('[data-achievement-box]');
      
      boxes.forEach((box) => {
        const boxRect = box.getBoundingClientRect();
        const index = parseInt(box.getAttribute('data-box-index'));
        
        const isVisible = 
          boxRect.left < containerRect.right &&
          boxRect.right > containerRect.left &&
          boxRect.top < containerRect.bottom &&
          boxRect.bottom > containerRect.top;
        
        if (isVisible) {
          setVisibleBoxes((prev) => {
            if (!prev.has(index)) {
              return new Set([...prev, index]);
            }
            return prev;
          });
        }
      });
    };

    checkVisibility();

    const container = containerRef.current;
    container.addEventListener('scroll', checkVisibility, { passive: true });
    
    const boxes = document.querySelectorAll('[data-achievement-box]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !entry.rootBounds) return;
          
          const boxRect = entry.boundingClientRect;
          const rootRect = entry.rootBounds;
          
          const horizontalInside = 
            (boxRect.left >= rootRect.left ) || // Entered 20px from left
            (boxRect.right <= rootRect.right); // Entered 20px from right
          
          if (horizontalInside) {
            const index = parseInt(entry.target.getAttribute('data-box-index'));
            setVisibleBoxes((prev) => {
              if (!prev.has(index)) {
                return new Set([...prev, index]);
              }
              return prev;
            });
          }
        });
      },
      { 
        root: containerRef.current,
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    boxes.forEach((box) => observer.observe(box));

    // Observer for summary box
    const summaryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.rootBounds) {
            const boxRect = entry.boundingClientRect;
            const rootRect = entry.rootBounds;
            
            const horizontalInside = 
              (boxRect.left >= rootRect.left) || 
              (boxRect.right <= rootRect.right);
            
            if (horizontalInside) {
              setSummaryVisible(true);
            }
          }
        });
      },
      { 
        root: containerRef.current,
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    if (summaryRef.current) {
      summaryObserver.observe(summaryRef.current);
    }

    return () => {
      container.removeEventListener('scroll', checkVisibility);
      boxes.forEach((box) => observer.unobserve(box));
      if (summaryRef.current) {
        summaryObserver.unobserve(summaryRef.current);
      }
    };
  }, [positions]);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = containerRef.current;

    if (!section || !scroller) return;


    let current = scroller.scrollLeft || 0;
    let target = 0;
    let animationFrameId = null;

    
    
    
    const compute = () => {
      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - window.innerHeight;

      if (scrollRange <= 0) {
        target = 0;
        return;
      }

      const progress = Math.min(Math.max(-rect.top / scrollRange, 0), 1);
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;

      target = maxScroll * progress;

    };

   
    const update = () => {
      compute();

      const diff = target - current;
      const speed = Math.abs(diff) > 10 ? 0.16 : 0.12;
      current += diff * speed;

      scroller.scrollLeft = current;

      if (Math.abs(diff) > 0.1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        scroller.scrollLeft = target;
        current = target;
        animationFrameId = null;
      }
    };
    const handleScroll = () => {

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    let wheelTimeout = null;

    const handleWheel = () => {
      if (wheelTimeout) clearTimeout(wheelTimeout);

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(update);
      }      
      wheelTimeout = setTimeout(() => {
        if (animationFrameId === null) {
          animationFrameId = requestAnimationFrame(update);
        }
      }, 80);
    };

    
    compute();
    animationFrameId = requestAnimationFrame(update);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("wheel", handleWheel);

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [totalWidth]);



  
  const sectionHeight = useMemo(() => {
    if (typeof window === 'undefined') return '200vh';
    const height = (totalWidth / window.innerWidth) * 100;
    return `${Math.max(height, 100)}vh`;
  }, [totalWidth]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: sectionHeight }}
    >
      <style>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className="sticky top-0 h-screen overflow-hidden w-full"
      >
        <div
          className="relative"
          style={{ 
            width: totalWidth, 
            height: TOTAL_HEIGHT
          }}
        >
          <svg 
            width={totalWidth} 
            height={TOTAL_HEIGHT}
          >
            <path
              d={wavePath}
              stroke="#C50400"
              strokeWidth="3"
              fill="none"
            />
          </svg>

          {/* Achievement boxes */}
          {sortedAchievements.map((ach, i) => {
            const { x, waveY, boxY, isCrest, connectorHeight } = positions[i];

            return (
              <React.Fragment key={i}>
                <div
                  className={`absolute w-[2px] bg-[#C50400] transition-all duration-500 ${
                    visibleBoxes.has(i) ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    left: x,
                    top: isCrest ? waveY : boxY,
                    height: connectorHeight,
                    transform: "translateX(-50%)",
                    transitionDelay: visibleBoxes.has(i) ? "0.2s" : "0s",
                  }}
                />

                {/* Small dot at wave connection point */}
                <div
                  className={`absolute w-3 h-3 rounded-full bg-[#C50400] border-2 border-black transition-all duration-500 ${
                    visibleBoxes.has(i) ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                  style={{
                    left: x,
                    top: waveY,
                    transform: "translate(-50%, -50%)",
                    transitionDelay: visibleBoxes.has(i) ? "0.1s" : "0s",
                  }}
                />

                {/* Achievement box */}
                <div
                  data-achievement-box
                  data-box-index={i}
                  className={`absolute bg-[#050507]/95 border border-[#C50400] rounded-xl p-4 w-64 text-white backdrop-blur-md shadow-[0_0_20px_rgba(197,4,0,0.6)] transition-all duration-500 ${
                    visibleBoxes.has(i)
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75"
                  }`}
                  style={{
                    left: x - BOX_WIDTH / 2,
                    top: boxY,
                    animation: visibleBoxes.has(i) ? "popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
                  }}
                >
                  <h3 className="text-base md:text-lg font-share text-bloodred-500 font-semibold">
                    {ach.title}
                  </h3>

                  {ach.position !== undefined && (
                    <p className="text-xs md:text-sm text-yellow-400 mt-1 font-semibold">
                      {getPositionEmoji(ach.position)} Position: {ach.position === 0 ? "Finalist" : ach.position === 1 ? "1st" : ach.position === 2 ? "2nd" : ach.position === 3 ? "3rd" : `${ach.position}th`}
                    </p>
                  )}

                  <p className="text-xs md:text-sm text-gray-300 mt-1">
                    📅{" "}
                    {new Date(ach.date).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-xs md:text-sm text-green-400 mt-1">
                    💰 Prize: ₹{ach.prize}
                  </p>
                </div>
              </React.Fragment>
            );
          })}

          {/* Small dot at the end of the wave */}
          <div
            className="absolute w-3 h-3 rounded-full bg-[#C50400] border-2 border-black"
            style={{
              left: LEFT_PADDING + X_SCALE * tMax,
              top: K + A * Math.sin(tMax),
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Summary text at the end of the wave */}
          <div
            ref={summaryRef}
            className={`absolute transition-all duration-500 ${
              summaryVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: LEFT_PADDING + X_SCALE * tMax + 30,
              top: K + A * Math.sin(tMax),
              transform: "translateY(-50%)",
            }}
          >
            <h1 className="text-2xl md:text-3xl font-share text-bloodred-500 font-semibold whitespace-nowrap">
              Total Achievements
            </h1>
            <h1 className="text-2xl md:text-3xl font-share text-bloodred-500 font-semibold mt-2">
              {totals.totalCount}+
            </h1>
          </div>

          {/* Dot at the start of the connector */}
          <div
            className={`absolute w-3 h-3 rounded-full bg-[#C50400] border-2 border-black transition-all duration-500 ${
              summaryVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
            style={{
              left: LEFT_PADDING + X_SCALE * tMax + 280,
              top: K + A * Math.sin(tMax),
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Horizontal connector between the two text blocks */}
          <div
            className={`absolute h-[3px] bg-[#C50400] transition-all duration-500 ${
              summaryVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: LEFT_PADDING + X_SCALE * tMax + 280 + 8, // Padding from start dot
              top: K + A * Math.sin(tMax),
              width: 100 - 16, // Reduced width to account for padding on both sides
              transform: "translateY(-50%)",
            }}
          />

          {/* Dot at the end of the connector */}
          <div
            className={`absolute w-3 h-3 rounded-full bg-[#C50400] border-2 border-black transition-all duration-500 ${
              summaryVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
            style={{
              left: LEFT_PADDING + X_SCALE * tMax + 380,
              top: K + A * Math.sin(tMax),
              transform: "translate(-50%, -50%)",
            }}
          />

          <div
            className={`absolute transition-all duration-500 ${
              summaryVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: LEFT_PADDING + X_SCALE * tMax + 400,
              top: K + A * Math.sin(tMax),
              transform: "translateY(-50%)",
            }}
          >
            <h1 className="text-2xl md:text-3xl font-share text-bloodred-500 font-semibold whitespace-nowrap">
              Total Prize Amount
            </h1>
            <h1 className="text-2xl md:text-3xl font-share text-bloodred-500 font-semibold mt-2">
              ₹{totals.totalPrize.toLocaleString('en-IN')}+
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaveTimeline;