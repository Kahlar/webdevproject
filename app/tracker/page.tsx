// components/Tracker.tsx
"use client";

import React, { useState, useEffect } from "react";
import ActionLogForm from "@/app/components/ActionLogForm";
import ProgressBar from "@/app/components/ProgressBar";
import ProgressChart from "@/app/components/ProgressChart";
// import Leaderboard from "@/app/components/LeaderBoard";

const Tracker = () => {
  const userId = "testUser"; // Replace with actual user authentication logic
  const [totalPoints, setTotalPoints] = useState(0);
  const [actions, setActions] = useState<
    { action: string; points: number }[]
  >([]);
  const [badge, setBadge] = useState("Eco-Newbie");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ label: 'Points', data: [], fill: false, backgroundColor: 'rgb(75, 192, 192)', borderColor: 'rgba(75, 192, 192, 0.2)' }],
  });

  const fetchData = async () => {
    // Fetch points from the API
    const pointsResponse = await fetch(`/api/points?userId=${userId}`);
    const pointsData = await pointsResponse.json();
    setTotalPoints(pointsData.points || 0);

    // Fetch badge from the API
    const badgeResponse = await fetch(`/api/badges?userId=${userId}`);
    const badgeData = await badgeResponse.json();
    setBadge(badgeData.badge);
  };

  useEffect(() => {
    fetchData(); // Initial data fetch
  }, []);

  const handleActionLogged = () => {
    fetchData(); // Refresh data after an action is logged
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Track Your Progress
      </h1>
      <div className="absolute right-4 top-4">
      </div>

      {/* Action Logging Form */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Log Your Actions</h2>
        <ActionLogForm userId={userId} onActionLogged={handleActionLogged} />
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
        <ProgressChart chartData={chartData} />
        {/* Simple Progress Bar */}
      </div>

      {/* Leaderboard */}
      
    </div>
  );
};

export default Tracker;
