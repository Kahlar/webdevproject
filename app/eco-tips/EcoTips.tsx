// app/eco-tips/EcoTips.tsx
"use client";

import React from "react";
import Link from 'next/link'; // Import the Link component
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion"; // Ensure this path is correct

interface EcoTipsProps { }

const EcoTips: React.FC<EcoTipsProps> = () => {
  const tips = {
    Transportation: [
      "Walk or cycle for short trips.",
      "Use public transportation whenever possible.",
      "Consider carpooling with colleagues or neighbors.",
      "Maintain your vehicle for better fuel efficiency.",
      "If buying a car, consider hybrid or electric models.",
    ],
    "Energy Usage": [
      "Switch to energy-efficient light bulbs (LEDs).",
      "Unplug electronics when not in use.",
      "Use a programmable thermostat to regulate heating and cooling.",
      "Insulate your home to reduce energy waste.",
      "Wash clothes in cold water to save energy.",
    ],
    Diet: [
      "Reduce your meat consumption, especially red meat.",
      "Eat more plant-based meals.",
      "Buy local and seasonal produce.",
      "Reduce food waste by planning meals and using leftovers.",
      "Grow your own fruits and vegetables.",
    ],
    "Waste Management": [
      "Recycle paper, plastic, and glass.",
      "Compost food scraps and yard waste.",
      "Use reusable shopping bags and water bottles.",
      "Avoid single-use plastics.",
      "Donate or sell unwanted items instead of throwing them away.",
    ],
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Eco-Friendly Tips
      </h1>

      {/* Navigation Links */}
      <div className="flex justify-center space-x-4 mb-6">
        <Link href="/forum" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Community Forum
        </Link>
        <Link href="/contact" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Contact Us
        </Link>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {Object.entries(tips).map(([category, tipList]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="font-semibold text-lg">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                {tipList.map((tip, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {tip}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default EcoTips;
