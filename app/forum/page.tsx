// app/forum/page.tsx
import React from "react";
import CommunityForum from "./CommunityForum";
// import ThemeSwitcher from "@/app/components/ThemeSwitcher"; // Correct import path

const CommunityForumPage = () => {
  return (
    <div className="relative">
      <div className="absolute right-4 top-4">
        {/* <ThemeSwitcher /> */}
      </div>
      <CommunityForum />
    </div>
  );
};

export default CommunityForumPage;
