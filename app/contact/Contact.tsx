// app/contact/Contact.tsx
"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import Link from "next/link";

const Contact = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5 text-center">Contact Us</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
        We'd love to hear from you! Send us your feedback, questions, or
        inquiries using the form below.
      </p>

      {/* Contact Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Name:
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Your Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Your Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Message:
            </label>
            <Textarea
              id="message"
              placeholder="Your Message"
              rows={5}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <Button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send Message
          </Button>
        </form>
      </div>

      {/* Social Media Links */}
      <div className="text-center mt-8">
        <h2 className="text-xl font-semibold mb-3">Connect With Us</h2>
        <div className="flex justify-center space-x-6">
          <Link href="#" className="text-blue-500 hover:text-blue-700">
            Facebook
          </Link>
          <Link href="#" className="text-blue-500 hover:text-blue-700">
            Twitter
          </Link>
          <Link href="#" className="text-blue-500 hover:text-blue-700">
            Instagram
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          <details className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <summary className="font-semibold cursor-pointer">
              What is the purpose of this website?
            </summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              This website is dedicated to promoting sustainable living and
              reducing carbon emissions through education, tools, and community
              engagement.
            </p>
          </details>
          <details className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <summary className="font-semibold cursor-pointer">
              How can I calculate my carbon footprint?
            </summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              You can use our Carbon Calculator tool to estimate your carbon
              footprint based on your daily/weekly travel, electricity usage,
              and diet habits.
            </p>
          </details>
          {/* Add more FAQ items here */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
