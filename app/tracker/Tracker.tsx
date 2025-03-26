import React, { useState, useEffect } from "react";

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<{ name: string; points: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/api/leaderboard"); // Adjust API URL if needed
                const data = await response.json();

                if (Array.isArray(data)) {
                    setLeaderboardData(data);
                } else {
                    console.error("Leaderboard API returned non-array data:", data);
                    setLeaderboardData([]);
                }
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <p>Loading leaderboard...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">Top Performers</h3>
            {leaderboardData.length > 0 ? (
                <ul>
                    {leaderboardData.map((player, index) => (
                        <li key={index} className="p-2 border-b">
                            {index + 1}. {player.name} - {player.points} pts
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No leaderboard data available.</p>
            )}
        </div>
    );
};

export default Leaderboard;
