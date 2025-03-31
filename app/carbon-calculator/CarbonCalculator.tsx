"use client";

import { useState, useEffect } from "react";
import { Car, Home, Apple, } from "lucide-react";
import { Button } from "@/app/components/ui/button"; // Importing Button from Shadcn UI
import { Input } from "@/app/components/ui/input"; // Importing Input from Shadcn UI

interface FormData {
    carMiles: string;
    publicTransport: string;
    flights: string;
    electricityBill: string;
    gasUsage: string;
    renewable: "yes" | "no";
    dietType: "vegan" | "vegetarian" | "mixed" | "meatHeavy";
    meatFrequency: string;
    localFood: string;
}

interface Result {
    annualFootprint: string;
    comparison: string;
    tips: string[];
}

interface ProgressStepProps {
    icon: React.ReactNode;
    title: string;
    active: boolean;
    onClick: () => void;
}

const CarbonCalculator = () => {
    const [formData, setFormData] = useState<FormData>({
        // Travel
        carMiles: "",
        publicTransport: "",
        flights: "",
        // Energy
        electricityBill: "",
        gasUsage: "",
        renewable: "no",
        // Diet
        dietType: "mixed",
        meatFrequency: "sometimes",
        localFood: "sometimes",
    });

    const [result, setResult] = useState<Result | null>(null);
    const [activeSection, setActiveSection] = useState("travel");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateFootprint = () => {
        // Simple calculation for demonstration
        // In a real app, this would be more sophisticated
        let total = 0;

        // Travel calculations
        total += Number(formData.carMiles) * 0.404; // kg CO2 per mile
        total += Number(formData.publicTransport) * 0.14;
        total += Number(formData.flights) * 90; // Average per flight

        // Energy calculations
        total += Number(formData.electricityBill) * 0.85;
        total += Number(formData.gasUsage) * 0.18;
        if (formData.renewable === "yes") total *= 0.7;

        // Diet calculations
        const dietMultipliers = {
            vegan: 1,
            vegetarian: 1.5,
            mixed: 2.5,
            meatHeavy: 3.3,
        };
        total *= dietMultipliers[formData.dietType];

        setResult({
            annualFootprint: total.toFixed(2),
            comparison: (total / 1000).toFixed(2), // Compare to average
            tips: generateTips(formData),
        });
    };

    const generateTips = (data: FormData): string[] => {
        const tips: string[] = [];
        if (Number(data.carMiles) > 100) {
            tips.push("Consider carpooling or using public transport to reduce your travel emissions.");
        }
        if (data.renewable === "no") {
            tips.push("Switching to renewable energy could significantly reduce your carbon footprint.");
        }
        if (data.dietType === "meatHeavy") {
            tips.push("Reducing meat consumption, especially red meat, can lower your carbon footprint.");
        }
        return tips;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800 pt-16 transition-colors duration-200">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    {/* Theme Switcher */}
                    {/* <div className="absolute right-0 top-0">
                        <ThemeSwitcher />
                    </div> */}

                    <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-300 mb-4 tracking-tight">
                        Carbon Footprint Calculator
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Calculate your carbon footprint and discover personalized ways to reduce your environmental impact.
                    </p>
                </div>

                {/* Calculator Form */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 transition-colors duration-200">
                    {/* Progress Steps */}
                    <div className="flex justify-between mb-8">
                        <ProgressStep
                            icon={<Car />}
                            title="Travel"
                            active={activeSection === "travel"}
                            onClick={() => setActiveSection("travel")}
                        />
                        <ProgressStep
                            icon={<Home />}
                            title="Energy"
                            active={activeSection === "energy"}
                            onClick={() => setActiveSection("energy")}
                        />
                        <ProgressStep
                            icon={<Apple />}
                            title="Diet"
                            active={activeSection === "diet"}
                            onClick={() => setActiveSection("diet")}
                        />
                    </div>

                    {/* Form Sections */}
                    <div className="space-y-8">
                        {activeSection === "travel" && (
                            <section>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                    Travel Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Miles driven by car per week
                                        </label>
                                        <Input
                                            type="number"
                                            name="carMiles"
                                            value={formData.carMiles}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Public transport trips per week
                                        </label>
                                        <Input
                                            type="number"
                                            name="publicTransport"
                                            value={formData.publicTransport}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Flights per year
                                        </label>
                                        <Input
                                            type="number"
                                            name="flights"
                                            value={formData.flights}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSection === "energy" && (
                            <section>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                    Energy Usage
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Monthly electricity bill ($)
                                        </label>
                                        <Input
                                            type="number"
                                            name="electricityBill"
                                            value={formData.electricityBill}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Monthly natural gas usage (therms)
                                        </label>
                                        <Input
                                            type="number"
                                            name="gasUsage"
                                            value={formData.gasUsage}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Do you use renewable energy?
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-5 w-5 text-green-600 dark:bg-gray-700 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-500 transition-shadow duration-200"
                                                    name="renewable"
                                                    value="yes"
                                                    checked={formData.renewable === "yes"}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-5 w-5 text-green-600 dark:bg-gray-700 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-500 transition-shadow duration-200"
                                                    name="renewable"
                                                    value="no"
                                                    checked={formData.renewable === "no"}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSection === "diet" && (
                            <section>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                    Dietary Habits
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Your Diet Type
                                        </label>
                                        <select
                                            name="dietType"
                                            value={formData.dietType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                        >
                                            <option value="vegan">Vegan</option>
                                            <option value="vegetarian">Vegetarian</option>
                                            <option value="mixed">Mixed</option>
                                            <option value="meatHeavy">Meat-Heavy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            How often do you eat meat
                                        </label>
                                        <select
                                            name="meatFrequency"
                                            value={formData.meatFrequency}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="sometimes">Sometimes</option>
                                            <option value="rarely">Rarely</option>
                                            <option value="never">Never</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Do you eat locally sourced food?
                                        </label>
                                        <select
                                            name="localFood"
                                            value={formData.localFood}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500 transition-shadow duration-200 shadow-sm"
                                        >
                                            <option value="often">Often</option>
                                            <option value="sometimes">Sometimes</option>
                                            <option value="rarely">Rarely</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Calculate Button */}
                    <div className="mt-8">
                        <Button
                            onClick={calculateFootprint}
                            className="w-full px-6 py-4 rounded-xl text-white font-semibold focus:outline-none shadow-md transition-all duration-200 hover:bg-green-700"
                        >
                            Calculate My Footprint
                        </Button>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 transition-colors duration-200">
                        <h2 className="text-3xl font-semibold text-center text-green-700 dark:text-green-300 mb-6">
                            Your Results
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                            Based on your inputs, your estimated annual carbon footprint is:
                        </p>
                        <div className="text-center text-5xl font-bold text-green-600 dark:text-green-400 mb-6">
                            {result.annualFootprint} kg CO₂
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                            This is equivalent to {result.comparison} tons of CO₂, compared to the average.
                        </p>

                        {/* Personalized Eco Tips */}
                        {result.tips.length > 0 && (
                            <>
                                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                    Personalized Eco Tips
                                </h3>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                                    {result.tips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProgressStep: React.FC<ProgressStepProps> = ({ icon, title, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-200 ${
            active
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
    >
        {icon}
        <span className="text-sm font-medium">{title}</span>
    </button>
);

export default CarbonCalculator;
