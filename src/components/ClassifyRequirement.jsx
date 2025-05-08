
import React, { useState } from 'react';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';

const ClassifyRequirement = () => {
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requirement.trim()) {
      setError('Please enter a requirement to classify');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/classify', {
        requirement: requirement.trim()
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during classification');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRequirement('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Classify Single Requirement</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="requirement" className="block text-sm font-medium text-gray-700 mb-1">
              Requirement Text
            </label>
            <input
              type="text"
              id="requirement"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Enter a requirement to classify..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !requirement.trim()}
              className={`px-4 py-2 rounded-md text-white ${
                loading || !requirement.trim()
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? 'Classifying...' : 'Classify Requirement'}
            </button>
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        <ErrorAlert message={error} />

        {result && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Classification Result</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Type</p>
                <p className={`font-semibold ${
                  result.type === 'Functional' ? 'text-blue-700' : 'text-purple-700'
                }`}>
                  {result.type} Requirement
                </p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="font-semibold">
                  {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifyRequirement;
