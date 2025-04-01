"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import Link from "next/link";
import { motion } from "framer-motion";

const Contact = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Auto-close after 3s
  };

  return (
    <div className="container mx-auto py-10 relative">
      <h1 className="text-3xl font-bold mb-5 text-center">Contact Us</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
        We'd love to hear from you! Send us your feedback, questions, or
        inquiries using the form below.
      </p>

      {/* Contact Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Name:
            </label>
            <Input type="text" id="name" placeholder="Your Name" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email:
            </label>
            <Input type="email" id="email" placeholder="Your Email" required />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Message:
            </label>
            <Textarea id="message" placeholder="Your Message" rows={5} required />
          </div>
          <Button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Send Message
          </Button>
        </form>
      </div>

      {/* Pop-up Notification */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex flex-col items-center space-y-2 z-50 w-64"
        >
          <span className="text-lg font-semibold">✅ Message Sent!</span>
          <p className="text-sm">We will get back to you soon.</p>
          {/* Loading Line (Both Sides to Center) */}
          <div className="w-full h-1 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full bg-white absolute left-0 right-0 mx-auto"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Contact;
