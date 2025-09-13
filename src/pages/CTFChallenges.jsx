import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import logo from '../assets/logo.png';

const CTFChallenges = () => {
  const { id: ctfName } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [challenges, setChallenges] = useState([]);

  // Fetch categories
  useEffect(() => {
    const ctfRef = ref(database, `writeups/${ctfName}`);
    onValue(ctfRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const catList = Object.keys(data);
      setCategories(catList);
    });
  }, [ctfName]);

  useEffect(() => {
    if (!selectedCategory) return;

    const catRef = ref(database, `writeups/${ctfName}/${selectedCategory}`);
    onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const chList = Object.keys(data || {}).map((ch) => ({
        category: selectedCategory,
        challenge: ch,
      }));
      setChallenges(chList);
    });
  }, [ctfName, selectedCategory]);

  console.log(challenges)

  return (
    <div className="min-h-screen bg-[#010101] text-white px-6 py-10 font-share">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-bloodred-500 mb-10 text-center">
          {ctfName} {selectedCategory ? `- ${selectedCategory}` : "Categories"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!selectedCategory &&
            categories.map((category) => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="relative group p-8 rounded-xl border-2 border-bloodred-500 
                  bg-black/60 shadow-lg shadow-red-900/30 hover:scale-105 transform transition 
                  hover:shadow-[0_0_25px_rgba(197,4,0,0.6)] cursor-pointer overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-5 group-hover:opacity-10 transition bg-center bg-contain bg-no-repeat"
                  style={{ backgroundImage: `url(${logo})` }}
                ></div>

                <h2 className="relative text-2xl font-bold text-bloodred-400">{category}</h2>
                <p className="relative mt-2 text-gray-400">Click to view challenges</p>
              </div>
            ))}

          {selectedCategory &&
            challenges.map(({ category, challenge }) => (
              <Link
                key={`${category}-${challenge}`}
                to={`/writeup/${ctfName}/${category}/${challenge}`}
                className="relative group p-8 rounded-xl border-2 border-bloodred-500 
                   shadow-lg shadow-red-900/30 hover:scale-105 transform transition 
                  hover:shadow-[0_0_25px_rgba(197,4,0,0.6)] overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-5 group-hover:opacity-10 transition bg-center bg-contain bg-no-repeat"
                  style={{ backgroundImage: logo }}
                ></div>

                <h2 className="relative text-2xl font-bold text-bloodred-400">{challenge}</h2>
                <p className="relative mt-2 text-gray-400">Click to view writeup</p>
              </Link>
            ))}
        </div>

        {selectedCategory && (
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setChallenges([]);
              }}
              className="px-6 py-2 border-2 border-bloodred-500 text-bloodred-500 rounded-lg 
                shadow-lg shadow-red-900/50 bg-transparent font-semibold transition-all 
                duration-300 hover:bg-bloodred-500 hover:text-white"
            >
              Back to Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CTFChallenges;
