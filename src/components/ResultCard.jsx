
import React from 'react';

const ResultCard = ({ requirement, similarity, id }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium flex-grow">{requirement}</p>
        {similarity !== undefined && (
          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {similarity}%
          </span>
        )}
      </div>
      {id && <p className="text-xs text-gray-500 mt-1">ID: {id}</p>}
    </div>
  );
};

export default ResultCard;
