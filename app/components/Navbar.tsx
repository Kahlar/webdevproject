// app/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="bg-green-100 dark:bg-gray-800 p-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-green-700 dark:text-green-300">
                    GreenSphere
                </Link>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Home
                    </Link>
                    <Link href="/carbon-calculator" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Carbon Calculator
                    </Link>
                    <Link href="/eco-tips" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Eco Tips
                    </Link>
                    <Link href="/forum" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Community Forum
                    </Link>
                    <Link href="/tracker" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Tracker
                    </Link>
                    <Link href="/store-locator" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Store Locator
                    </Link>
                    <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
