// app/tracker/Tracker.tsx
"use client";

import React, { useState, useEffect } from "react";
import ActionLogForm from "@/app/components/ActionLogForm";
import ProgressBar from "@/app/components/ProgressBar";

const Tracker = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [actions, setActions] = useState<
    { action: string; points: number }[]
  >([]);
  const [badge, setBadge] = useState("Eco-Newbie");

  useEffect(() => {
    // Update badge based on points
    if (totalPoints > 500) {
      setBadge("Planet Protector");
    } else if (totalPoints > 100) {
      setBadge("Green Warrior");
    } else {
      setBadge("Eco-Newbie");
    }
  }, [totalPoints]);

  const handleLogAction = (action: string, points: number) => {
    setTotalPoints((prevPoints) => prevPoints + points);
    setActions((prevActions) => [...prevActions, { action, points }]);
  };

  // Dummy leaderboard data
  const leaderboardData = [
    { name: "EcoChampion1", points: 1200 },
    { name: "GreenCrusader", points: 850 },
    { name: "EarthSaver", points: 600 },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Track Your Progress
      </h1>

      {/* Action Logging Form */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Log Your Actions</h2>
        <ActionLogForm onLogAction={handleLogAction} />
      </div>

      {/* Points and Badge */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Your Stats</h2>
        <p>Total Points: {totalPoints}</p>
        <p>Badge: {badge}</p>
      </div>

      {/* Progress Visualization */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Weekly Progress</h2>
        <ProgressBar progress={(totalPoints % 100)} />
        {/* Simple Progress Bar */}
      </div>

      {/* Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Leaderboard</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tracker;
