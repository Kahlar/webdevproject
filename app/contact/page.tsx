// app/contact/page.tsx
import React from "react";
import Contact from "./Contact";
// import ThemeSwitcher from "@/app/components/ThemeSwitcher"; // Correct import path

const ContactPage = () => {
  return (
    <div className="relative">
      <div className="absolute right-4 top-4">
        {/* <ThemeSwitcher /> */}
      </div>
      <Contact />
    </div>
  );
};

export default ContactPage;
