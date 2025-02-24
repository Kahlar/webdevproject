"use client";

import { useState, useEffect } from "react"
import ClientWrapper from "./ClientWrapper"
import Link from "next/link"
import { Leaf, Calculator, Lightbulb, LineChart, MapPin, Mail, Menu, X, Users, ArrowRight, Globe } from "lucide-react"
import ThemeSwitcher from "@/app/components/ThemeSwitcher"
import { Button } from "@/app/components/ui/button"

const NavLink = ({ href = "/", icon, text, active }) => (
  <Link
    href={href}
    className={`flex items-center space-x-1 hover:text-green-200 transition-colors ${
      active ? "text-green-200" : "text-white"
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{text}</span>
  </Link>
)

const MobileNavLink = ({ href = "/", icon, text, active }) => (
  <Link
    href={href}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
      active
        ? "bg-green-700 text-white"
        : "text-green-100 hover:bg-green-700 hover:text-white"
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{text}</span>
  </Link>
)

const PreviewCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
      <button className="mt-6 text-green-600 dark:text-green-400 font-semibold inline-flex items-center hover:text-green-700 dark:hover:text-green-300 group">
        Learn More <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
)

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [activeTab, setActiveTab] = useState("daily")
  const [showScrollTop, setShowScrollTop] = useState(false)

  const ecoFacts = [
    { stat: "2.5B", text: "Tons of CO₂ saved by our community", icon: <Globe className="h-8 w-8" /> },
    { stat: "500K+", text: "Active eco-warriors worldwide", icon: <Users className="h-8 w-8" /> },
    { stat: "1M+", text: "Green actions logged daily", icon: <Leaf className="h-8 w-8" /> },
    { stat: "10K+", text: "Eco-friendly stores listed", icon: <MapPin className="h-8 w-8" /> },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Navigation Bar */}
        <nav
          className={`fixed w-full top-0 z-50 transition-all duration-300 ${
            scrollPosition > 50 ? "bg-green-600 dark:bg-green-800 shadow-lg" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-white" />
                <span className="font-bold text-xl text-white">GreenSphere</span>
              </div>

              <div className="hidden md:flex space-x-8">
                <NavLink href="/carbon-calculator" icon={<Calculator />} text="Carbon Calculator" />
                <NavLink href="/eco-tips" icon={<Lightbulb />} text="Eco Tips" />
                <NavLink href="/tracker" icon={<LineChart />} text="Tracker" />
                <NavLink href="/store-locator" icon={<MapPin />} text="Store Locator" />
                <NavLink href="/contact" icon={<Mail />} text="Contact" />
              </div>

              <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md hover:bg-green-700 focus:outline-none text-white"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-green-600 dark:bg-green-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavLink href="/carbon-calculator" icon={<Calculator />} text="Carbon Calculator" />
                <MobileNavLink href="/eco-tips" icon={<Lightbulb />} text="Eco Tips" />
                <MobileNavLink href="/tracker" icon={<LineChart />} text="Tracker" />
                <MobileNavLink href="/store-locator" icon={<MapPin />} text="Store Locator" />
                <MobileNavLink href="/contact" icon={<Mail />} text="Contact" />
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className="relative bg-green-600 dark:bg-green-800 py-32">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-5xl font-extrabold text-white mb-6">Join the Green Revolution</h1>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Take control of your carbon footprint and join millions of eco-warriors making a difference for our
                planet's future.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/carbon-calculator">
                  <Button
                    variant="outline"
                    className="!border-2 !border-white !text-white hover:!bg-green-700 dark:hover:!bg-green-900 transition-all"
                  >
                    Get Started
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  className="!border-2 !border-white !text-white hover:!bg-green-700 dark:hover:!bg-green-900 transition-all"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Your Journey to Sustainable Living Starts Here
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  GreenSphere empowers you with tools and knowledge to reduce your environmental impact. Track your
                  progress, connect with like-minded individuals, and discover eco-friendly alternatives in your
                  community.
                </p>
              </div>
            </div>
          </section>

          {/* Preview Section */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <Link href="/carbon-calculator">
                  <PreviewCard
                    icon={<Calculator className="h-12 w-12 text-green-600 dark:text-green-400" />}
                    title="Carbon Calculator"
                    description="Calculate your carbon footprint and get personalized recommendations for reducing your impact."
                  />
                </Link>
                <Link href="/tracker">
                  <PreviewCard
                    icon={<LineChart className="h-12 w-12 text-green-600 dark:text-green-400" />}
                    title="Progress Tracker"
                    description="Log your eco-friendly actions, earn points, and compete with other environmental champions."
                  />
                </Link>
                <Link href="/store-locator">
                  <PreviewCard
                    icon={<MapPin className="h-12 w-12 text-green-600 dark:text-green-400" />}
                    title="Store Locator"
                    description="Find eco-friendly stores, recycling centers, and sustainable businesses near you."
                  />
                </Link>
              </div>
            </div>
          </section>

          {/* Eco-Facts Section */}
          <section className="py-20 bg-green-600 dark:bg-green-800 text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Making a Global Impact</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {ecoFacts.map((fact, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">{fact.icon}</div>
                    <div className="text-4xl font-bold mb-2">{fact.stat}</div>
                    <div className="text-green-100">{fact.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Make a Difference?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join our community of eco-warriors and start your journey towards a sustainable lifestyle.
              </p>
              <Button 
                className="!bg-green-600 hover:!bg-green-700 dark:!bg-green-700 dark:hover:!bg-green-800 !text-white transition-all inline-flex items-center"
              >
                Start Your Green Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </ClientWrapper>
  )
}

export default HomePage