"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for system preference initially
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const storedTheme = localStorage.getItem("darkMode")
    
    // Use stored preference or system preference
    const isDarkMode = storedTheme !== null ? storedTheme === "true" : systemPrefersDark
    
    setDarkMode(isDarkMode)
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export default ThemeSwitcher