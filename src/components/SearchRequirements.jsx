
import React, { useState } from 'react';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';

const SearchRequirements = () => {
  const [formData, setFormData] = useState({
    requirement: '',
    top_n: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTopNChange = (e) => {
    const value = parseInt(e.target.value);
    // Enforce the 1-20 limit
    if (value < 1) {
      setFormData({ ...formData, top_n: 1 });
    } else if (value > 20) {
      setFormData({ ...formData, top_n: 20 });
    } else {
      setFormData({ ...formData, top_n: value });
    }
  };

  const validateForm = () => {
    if (!formData.requirement.trim()) {
      setError('Please enter a requirement to search');
      return false;
    }
    
    if (formData.top_n < 1 || formData.top_n > 20) {
      setError('Number of results must be between 1 and 20');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/search', {
        requirement: formData.requirement.trim(),
        top_n: formData.top_n
      });
      
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during search');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      requirement: '',
      top_n: 5
    });
    setResults(null);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Search Similar Requirements</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="requirement" className="block text-sm font-medium text-gray-700 mb-1">
              Requirement Text
            </label>
            <textarea
              id="requirement"
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              placeholder="Enter a requirement to search for similar ones..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="top_n" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Results (1-20)
            </label>
            <input
              type="number"
              id="top_n"
              name="top_n"
              min="1"
              max="20"
              value={formData.top_n}
              onChange={handleTopNChange}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !formData.requirement.trim()}
              className={`px-4 py-2 rounded-md text-white ${
                loading || !formData.requirement.trim()
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? 'Searching...' : 'Search Requirements'}
            </button>
            {results && (
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

        {results && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Search Results</h3>
            <div className="border rounded-md overflow-hidden">
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {results.requirements.map((item, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{item.text}</p>
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {Math.round(item.similarity * 100)}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRequirements;
