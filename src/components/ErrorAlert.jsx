
import React from 'react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-md mt-4">
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;
