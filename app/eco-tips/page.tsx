// app/eco-tips/page.tsx
import React from "react";
import EcoTips from "./EcoTips";
import ThemeSwitcher from "@/app/components/ThemeSwitcher"; // Correct import path

const EcoTipsPage = () => {
  return (
    <div className="relative"> {/* Make the container relative for absolute positioning */}
      <div className="absolute right-4 top-4">
        <ThemeSwitcher />
      </div>
      <EcoTips />
    </div>
  );
};

export default EcoTipsPage;
