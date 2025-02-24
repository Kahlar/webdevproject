"use client";

import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress percentage (0-100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(progress, 100)); // Ensure progress is within 0-100 range

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-green-600 h-2.5 rounded-full"
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
