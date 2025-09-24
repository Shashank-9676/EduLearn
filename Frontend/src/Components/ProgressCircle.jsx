import React from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Check } from "lucide-react";

export default function ProgressExample({ percentage = 90 }) {
  return (
    <div className="w-10 h-10">
      {percentage >= 100 ? (
        <div className="flex flex-col items-center justify-center text-green-600">
          <Check size={25} />
          <span className="text-xs">Completed</span>
        </div>
      ) : (
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textSize: "24px",
            pathColor: "#10b981", // Tailwind green-500
            textColor: "#374151", // Tailwind gray-700
            trailColor: "#e5e7eb", // Tailwind gray-200
          })}
        />
      )}
    </div>
  );
}
