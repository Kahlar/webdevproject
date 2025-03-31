// app/eco-tips/EcoTips.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Car, Lightbulb, Apple, Recycle, ArrowRight } from "lucide-react";
import LoadingState from "@/app/components/LoadingState";
import { analytics } from "@/app/services/analytics";
import { colors, spacing, typography, shadows, transitions } from "@/app/styles/design-system";

interface EcoTipsProps {
  initialCategory?: string;
}

const EcoTips: React.FC<EcoTipsProps> = ({ initialCategory = 'transportation' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    { id: 'transportation', name: 'Transportation' },
    { id: 'energy', name: 'Energy Usage' },
    { id: 'diet', name: 'Diet' },
    { id: 'waste', name: 'Waste Management' },
  ];

  const tips = {
    transportation: [
      {
        title: 'Use Public Transportation',
        description: 'Opt for buses, trains, or subways instead of driving alone. This significantly reduces your carbon footprint.',
        link: 'https://www.transit.dot.gov/',
      },
      {
        title: 'Carpool or Rideshare',
        description: 'Share rides with colleagues or use ridesharing services to reduce the number of vehicles on the road.',
        link: 'https://www.rideshare.com/',
      },
      {
        title: 'Bike or Walk',
        description: 'For short distances, consider biking or walking instead of driving. It\'s healthy and eco-friendly!',
        link: 'https://www.bikeleague.org/',
      },
    ],
    energy: [
      {
        title: 'Switch to LED Bulbs',
        description: 'LED bulbs use up to 90% less energy than traditional incandescent bulbs and last much longer.',
        link: 'https://www.energy.gov/energysaver/led-lighting',
      },
      {
        title: 'Use Smart Thermostats',
        description: 'Programmable thermostats help optimize heating and cooling, saving energy and money.',
        link: 'https://www.energy.gov/energysaver/programmable-thermostats',
      },
      {
        title: 'Unplug Electronics',
        description: 'Many devices consume energy even when turned off. Unplug them when not in use.',
        link: 'https://www.energy.gov/energysaver/standby-power',
      },
    ],
    diet: [
      {
        title: 'Reduce Meat Consumption',
        description: 'Consider having meatless meals a few times a week. Plant-based diets have a lower environmental impact.',
        link: 'https://www.plantbasedfoods.org/',
      },
      {
        title: 'Buy Local Produce',
        description: 'Support local farmers and reduce transportation emissions by buying seasonal, local produce.',
        link: 'https://www.localharvest.org/',
      },
      {
        title: 'Minimize Food Waste',
        description: 'Plan meals, store food properly, and use leftovers to reduce food waste.',
        link: 'https://www.foodwastealliance.org/',
      },
    ],
    waste: [
      {
        title: 'Recycle Properly',
        description: 'Learn about your local recycling guidelines and ensure you\'re recycling correctly.',
        link: 'https://www.epa.gov/recycle',
      },
      {
        title: 'Compost Food Scraps',
        description: 'Start a compost pile or use a composting service to turn food waste into nutrient-rich soil.',
        link: 'https://www.epa.gov/recycle/composting-home',
      },
      {
        title: 'Use Reusable Items',
        description: 'Switch to reusable bags, water bottles, and containers to reduce single-use plastic waste.',
        link: 'https://www.epa.gov/trash-free-waters',
      },
    ],
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Transportation":
        return <Car className="h-6 w-6" />;
      case "Energy Usage":
        return <Lightbulb className="h-6 w-6" />;
      case "Diet":
        return <Apple className="h-6 w-6" />;
      case "Waste Management":
        return <Recycle className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    analytics.trackCategoryClick(categoryId);
  };

  const handleLinkClick = (link: string) => {
    analytics.trackButtonClick('link_clicked', {
      url: link,
    });
  };

  if (!mounted) {
    return <LoadingState />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Eco-Friendly Tips</h1>
        <p className="text-gray-600">
          Discover practical ways to reduce your environmental impact and live more sustainably.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-white text-gray-700 '
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {tips[selectedCategory as keyof typeof tips].map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-gray-600 mb-4">{tip.description}</p>
              <motion.a
                href={tip.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(tip.link)}
                whileHover={{ x: 5 }}
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
              >
                Learn more
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default EcoTips;
