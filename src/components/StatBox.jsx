
import React from 'react';

const StatBox = ({ title, value, className }) => {
  return (
    <div className={`bg-white p-4 rounded-md shadow ${className}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default StatBox;
