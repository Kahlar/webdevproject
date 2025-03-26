'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  type?: 'page' | 'component';
}

const LoadingState: React.FC<LoadingStateProps> = ({ type = 'component' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-center justify-center ${
        type === 'page' ? 'min-h-screen' : 'h-full'
      }`}
    >
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={dotVariants}
            className="w-3 h-3 bg-primary-600 rounded-full"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingState; 