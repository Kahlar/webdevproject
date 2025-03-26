"use client";

import React from "react";
import Link from "next/link";
import { House, Calculator, Leaf, Users, MapPin, ShoppingCart, Mail } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-green-600 dark:bg-gray-800 p-4 shadow-lg z-50">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-white dark:text-green-300">
                    GreenSphere
                </Link>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <Link href="/" className="flex items-center space-x-2 text-white font-bold dark:hover:text-green-400">
                        <House className="w-5 h-5 text-white" /> <span>Home</span>
                    </Link>
                    <Link href="/carbon-calculator" className="flex items-center space-x-2 font-bold text-white dark:text-gray-300 dark:hover:text-green-400">
                        <Calculator className="w-5 h-5 text-white" /> <span>Carbon Calculator</span>
                    </Link>
                    <Link href="/eco-tips" className="flex items-center space-x-2 text-white font-bold dark:text-gray-300 dark:hover:text-green-400">
                        <Leaf className="w-5 h-5 text-white" /> <span>Eco Tips</span>
                    </Link>
                    <Link href="/forum" className="flex items-center space-x-2 text-white font-bold dark:text-gray-300 dark:hover:text-green-400">
                        <Users className="w-5 h-5 text-white" /> <span>Community Forum</span>
                    </Link>
                    <Link href="/tracker" className="flex items-center space-x-2 text-white font-bold dark:text-gray-300 dark:hover:text-green-400">
                        <MapPin className="w-5 h-5 text-white" /> <span>Tracker</span>
                    </Link>
                    {/* <Link href="/store-locator" className="flex items-center space-x-2 text-white font-bold dark:text-gray-300 dark:hover:text-green-400">
                        <ShoppingCart className="w-5 h-5 text-white" /> <span>Store Locator</span>
                    </Link> */}
                    <Link href="/contact" className="flex items-center space-x-2 text-white font-bold dark:text-gray-300 dark:hover:text-green-400">
                        <Mail className="w-5 h-5 text-white" /> <span>Contact</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
