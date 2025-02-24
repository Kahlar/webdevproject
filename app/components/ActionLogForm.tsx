// components/ActionLogForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface ActionLogFormProps {
  userId: string; // Pass the userId as a prop
  onActionLogged: () => void; // Callback function to refresh data in Tracker.tsx
}

const ActionLogForm: React.FC<ActionLogFormProps> = ({ userId, onActionLogged }) => {
  const [action, setAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a loading state
  const actionTypes = [
    "Used public transport",
    "Recycled household waste",
    "Bought local organic produce",
    // Add more actions here
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, action: action }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Trigger the callback to refresh data in Tracker.tsx
      onActionLogged();
    } catch (error) {
      console.error('Failed to log action', error);
      // Handle the error (e.g., show an error message)
    } finally {
      setIsSubmitting(false);
      setAction(""); // Clear the input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="action" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action:</label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select an Action</option>
          {actionTypes.map((actionType) => (
            <option key={actionType} value={actionType}>{actionType}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging Action..." : "Log Action"}
      </Button>
    </form>
  );
};

export default ActionLogForm;
