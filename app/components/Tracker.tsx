// components/Tracker.tsx
"use client";

import React, { useState, useEffect } from 'react';
import ActionLogForm from '@/app/components/ActionLogForm';
import ProgressChart from '@/app/components/ProgressChart';
import Leaderboard from "@/app/components/LeaderBoard";

const Tracker = () => {
  const userId = "testUser"; // Replace with actual user authentication logic
  const [totalPoints, setTotalPoints] = useState(0);
  const [badge, setBadge] = useState('Eco-Newbie');
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
    <div>
      <h2>Your Stats</h2>
      <p>Total Points: {totalPoints}</p>
      <p>Badge: {badge}</p>
      <ActionLogForm userId={userId} onActionLogged={handleActionLogged} />
      <ProgressChart chartData={chartData} />
      <Leaderboard />
    </div>
  );
};

export default Tracker;
