// src/components/CustomProgress.jsx

import React from "react";

const CustomProgress = ({ percent }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="bg-blue-500 h-4 rounded-full"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default CustomProgress;
