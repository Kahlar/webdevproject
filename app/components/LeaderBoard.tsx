// components/Leaderboard.tsx
import React, { useState, useEffect } from 'react';

interface LeaderboardItem {
  name: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    // Fetch leaderboard data from API
    const fetchData = async () => {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboardData(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
